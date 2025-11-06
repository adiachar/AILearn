import cloudinary
from manim import *
import tempfile
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from groq import Groq
from dotenv import load_dotenv
import os
import asyncio
import subprocess
import runpy
from pydantic import BaseModel


load_dotenv()

app = FastAPI()

cloudinary.config(
  cloud_name="dxq4dsa9j",
  api_key="824226778437839",
  api_secret="XRBzcV-QK2C3ObwPwBtBxcZx7ls"
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_video_description(content):
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
        {
            "role": "system",
            "content": 'You are a helpful assistant that generates concise video scene descriptions based on user prompts. Provide clear and detailed descriptions suitable for video generation. You will not write any codes and generate only plain texts'
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
    desctiption = ''
    for chunk in completion:
        if chunk.choices[0].delta.content:
            desctiption += chunk.choices[0].delta.content
    
    return desctiption


def get_video_code(video_description):
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
        {
            "role": "system",
            "content": """You are an AI code generator. Your task is to generate a single, complete Python script for a Manim animation. Follow these strict rules:
                1. Always include ALL necessary import statements at the top of the code. Do not assume any pre-existing imports.
                2. The entire animation must be implemented inside ONE Manim Scene class only. Do not create multiple classes or helper files.
                3. The Scene class must inherit from manim.Scene or any subclass like MovingCameraScene or ThreeDScene if appropriate.
                4. The code must be fully executable when saved as "scene.py" and run with Manim.
                5. Do NOT include explanations, comments, or text outside the Python code.
                6. The last line of the file MUST define a variable named EXECUTABLE_SCENE and assign it the name of the main Scene class as a string.
                Example:
                EXECUTABLE_SCENE = "NeuralNetworkVisualization"
                7. Do not print or return anything else — output ONLY valid Python code.
                8. The AI should decide and include all necessary imports automatically based on the animation content.
                9. The Scene class should represent the entire video so that it can be rendered and uploaded as a single file.""",
        },
        {
            "role": "user",
            "content": video_description
        }
        ],
        temperature=1,
        max_completion_tokens=8192,
        top_p=1,
        stream=True,
        stop=None
    )

    code = ''
    for chunk in completion:
        if chunk.choices[0].delta.content:
            code += chunk.choices[0].delta.content

    print(code)
    return code


def generate_video_scene(scene_description):

    description = get_video_description(scene_description)
    code = get_video_code(description)

    with tempfile.TemporaryDirectory() as tempdir:
        config.media_dir = tempdir
        code_path = os.path.join(tempdir, "scene.py") # for getting the full path of script.py file inside this temporary directory.
        
        with open(code_path, "w") as code_file:
            code_file.write(code)

        try:
            globals_dict = runpy.run_path(code_path)
            executable_scene = globals_dict['EXECUTABLE_SCENE']

            if not executable_scene:
                raise ValueError("EXECUTABLE_SCENE not found in generated code.")
        
        except Exception as e:
            print("❌ Error while loading EXECUTABLE_SCENE:", e)
            return JSONResponse({"video_url": None}, status_code=400)
        
        try:
            # Exucuting this in subprocess because the code may have malwares which may delete files or folders in the current process.
            result = subprocess.run(
                [
                    "manim",
                    code_path,
                    executable_scene,
                    "-ql",              # quick low-quality render
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
                return JSONResponse({"video_url": None}, status_code=400)

            video_path = os.path.join(tempdir, "output.mp4")

            if os.path.exists(video_path):
                print("✅ Render complete:", video_path)
                upload_result = cloudinary.uploader.upload(video_path)
                return {"video_url": upload_result["secure_url"]}
            
            else:
                print("⚠️ Video file not found after rendering.")
                return JSONResponse({"video_url": None}, status_code=400)

        except subprocess.TimeoutExpired:
            print("⏱️ Rendering timed out.")
            return None
        
class Body(BaseModel):
    scene: str = 'Hello'

@app.post("/generate_video")
async def generate_video_endpoint(body: Body):
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, generate_video_scene, body.scene)
    return {"video_url": result}