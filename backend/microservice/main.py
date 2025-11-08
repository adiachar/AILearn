import cloudinary
import cloudinary.uploader
from manim import *
import tempfile
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from groq import Groq
from dotenv import load_dotenv
import os
import asyncio
import subprocess
from pydantic import BaseModel
from openai import OpenAI
import glob

load_dotenv()

app = FastAPI()

cloudinary.config(
  cloud_name=os.getenv("CLOUDINARY_NAME"),
  api_key=os.getenv("CLOUDINARY_API_KEY"),
  api_secret=os.getenv("CLOUDINARY_SECRET"),
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_video_description(content):
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
        {
            "role": "system",
            "content": 'You are a helpful assistant'
        },
        {
            "role": "user",
            "content": content
        }
        ],
        temperature=1,
        max_completion_tokens=8192,
        top_p=1,
        stream=True,
        stop=None
    )
    description = ''
    for chunk in completion:
        if chunk.choices[0].delta.content:
            description += chunk.choices[0].delta.content
    
    return description


def get_video_code(video_description):
    completion = client.chat.completions.create(
        model="qwen/qwen3-32b",
        messages=[
        {
            "role": "user",
            "content": f"""SYSTEM INSTRUCTION (DO NOT IGNORE):

            You are an AI code generator specialized in creating Manim animations compatible with Manim Community Edition v0.19.0 and above.

                Follow these strict rules:

                1. Always include ALL necessary import statements at the top of the code. Do NOT assume any pre-existing imports.
                2. The animation must be implemented entirely inside ONE Manim Scene class only. Do not create multiple classes or helper files.
                3. The Scene class must inherit from manim.Scene or a subclass like MovingCameraScene or ThreeDScene if appropriate.
                4. The code must be fully executable when saved as "scene.py" and run with the command:
                    manim -pql scene.py EXECUTABLE_SCENE
                5. Do NOT include explanations, comments, or text outside the Python code.
                6. The name of the main Scene class as should be MyScene.
                7. Output ONLY valid Python code — no extra text, explanations, or comments.
                8. Automatically include all necessary imports based on the animation content.
                9. The Scene class must represent the entire animation video so that it can be rendered as a single file.
                10. Never load, fetch, or reference any external assets (e.g., images, fonts, audio, or models). Only use built-in Manim features.
                11. Do NOT use deprecated or invalid syntax. Specifically:
                    - Use built-in color constants (e.g., BLACK, WHITE) instead of Color.BLACK.
                    - Use `self.play()` only for animation objects (e.g., Write, FadeIn, FadeOut).
                    - Do NOT call `.play()` on static Mobjects like `Text` or `Circle`.
                12. Do NOT manually call `scene.render()` inside the script. Manim will handle rendering automatically.
                13. Ensure the code runs without modification in Manim CE v0.19.0+ environments.
                14. If any instruction conflicts, prefer rule compliance over creativity.


                USER INSTRUCTION:{video_description}
            """
        }],
        temperature=1,
        max_completion_tokens=8192,
        top_p=1,
        stream=True,
        stop=None
    )
    code = ""
    print(completion)
    for chunk in completion:
        if chunk.choices[0].delta.content:
            code += chunk.choices[0].delta.content
    start = code.find('```python')
    end = code.find('```', start + 9)
    code = code[start: end]
    code = code.replace('```python', '').replace('```', '').strip()
    return code

no_of_tries = 0

def generate_video_scene(scene_description):
    print("🎬 Generating video for scene description:", scene_description)

    for attempt in range(3):
        code = get_video_code(scene_description)

        if not code:
            return None

        with tempfile.TemporaryDirectory() as tempdir:
            config.media_dir = tempdir
            code_path = os.path.join(tempdir, "scene.py") # for getting the full path of script.py file inside this temporary directory.
            
            with open(code_path, "w") as code_file:
                code_file.write(code)

            try:
                # Exucuting this in subprocess because the code may have malwares which may delete files or folders in the current process.
                result = subprocess.run(
                    [
                        "manim",
                        code_path,
                        'MyScene',
                        "-ql",
                        "-o", 
                        "output.mp4"
                    ],
                    cwd=tempdir,
                    capture_output=True,
                    text=True,
                    timeout=120
                )

                if result.returncode != 0:
                    print("❌ Rendering error:")
                    print(result.stderr)
                    print("-----------------------------------------------------------------------------------------------")
                    print("Trying Again...")
                    continue
                

                possible_videos = glob.glob(os.path.join(tempdir, "**", "output.mp4"), recursive=True)
                if possible_videos:
                    video_path = possible_videos[0]


                if os.path.exists(video_path):
                    print("Render complete:", video_path)
                    upload_result = cloudinary.uploader.upload(video_path, resource_type="video")
                    print("Upload complete:", upload_result["secure_url"])
                    print("Generating video description...")
                    description = get_video_description(scene_description)
                    return {"videoUrl": upload_result["secure_url"], "description": description}
                
                else:
                    print("Video file not found after rendering.")
                    return None

            except subprocess.TimeoutExpired:
                print("⏱️ Rendering timed out.")
                return None
    
    return None

class Body(BaseModel):
    content: str = 'Hello'

@app.post("/generate_video")
async def generate_video_endpoint(body: Body):
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, generate_video_scene, body.content)

    if not result:
        return JSONResponse({"message": "Request failed!"}, status_code=400)
    return result