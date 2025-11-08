import {useEffect, useState} from 'react'
import axios from 'axios'
import ReactMarkdown from "react-markdown"
import TryIcon from '@mui/icons-material/Try';
import AnimationIcon from '@mui/icons-material/Animation';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

const loadingMessages = [
  "Loading...",
  "Analyzing your topic deeply… 🧠",
  "Generating knowledge graph… 🔍",
  "Transforming concepts into visuals… 🎨",
  "Building smooth animation layers… 🧩",
  "Optimizing motion curves and timing… ⏱️",
  "Adding realistic lighting and depth… 💡",
  "Syncing narration with visuals… 🎙️",
  "Rendering AI-generated frames… 🧬",
  "Assembling video timeline… 🪄",
  "Finalizing transitions and effects… ✨",
  "Compressing and exporting your animation… 📦",
  "Almost there — polishing the visuals… 🧹",
  "Something went wrong...",
  "Trying again..."
];

export default function CreateVideo() {
  const [topic, setTopic] = useState('')
  const [addContext, setAddContext] = useState('')
  const [aiResponse, setAiResponse] = useState({})
  const [loading, setLoading] = useState(false)
  const [dummyLoadingText, setDummyLoadingText] = useState('');
  

  const generateVideo = async () => {

    if(!topic || topic.length < 15) {
      alert("The topic or concept should have atleast 15 characters!")
      return
    }

    setLoading(true)
    const content = `${topic} \n ${addContext}`

    try {
      console.log(import.meta.env.VITE_API_URL)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/generate-video`, {content: content})

      if(response.status === 200) {
        console.log(response.data)
        setAiResponse(response.data)
        setLoading(false)
      }

    } catch(err) {
      setLoading(false)
      console.log(err)
      alert("Sry, the video was not generated! Please try again...")
    }
  }

  useEffect(() => {
    let i = 0
    let interval
    if(loading) {
      interval = setInterval(() => {
        if(i >= loadingMessages.length) {
          i = 0
        }
        setDummyLoadingText(loadingMessages[i++])
      }, 3000)
    } else {
      if(interval) {
        clearInterval(interval)        
      }
    }
  }, [loading])

  return (
    <div className='h-full flex-1 p-10 text-gray-300 overflow-auto'>
      <h2 className="text-2xl font-semibold mb-4">Create Explanation Video</h2>
      <p className="text-gray-400 mb-6">Enter a topic or concept, and AI will generate both an animated explanation video and detailed text explanation</p>
      <div className="w-full flex gap-3 flex-col lg:flex-row md:flex-row">
        <div className='left'>
          <div className="w-full mx-auto bg-[#15171c] p-8 rounded-xl flex flex-col gap-4 border border-gray-800">

            <label className="block font-medium text-lg" htmlFor="topic">
              Topic or Concept
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full font-normal text-[1rem] mt-2 p-3 bg-[#0f1013] border border-[#3b3a53] rounded-lg focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none"
                placeholder="Topic or Concept. example: Neural Networks, Quantum Computing etc.."
              />          
            </label>

            <label className="block font-medium text-lg" htmlFor="topic">
              Additional Context (optional)
              <input
                value={addContext}
                onChange={(e) => setAddContext(e.target.value)}
                className="w-full mt-2 p-3 font-normal text-[1rem] bg-[#0f1013] border border-[#3b3a53] rounded-lg focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none"
                placeholder="Add any specific aspects you'd like the explanation to focus on..."
              />          
            </label>

            <button
              onClick={generateVideo}
              className="mt-6 w-full py-2 rounded-lg bg-linear-to-r from-[#7B3FF2] to-[#B44CFF] font-semibold hover:from-[#8F50FF] hover:to-[#C05FFF] flex justify-center items-center"
            >
            {!loading ? 'Generate Explanation' : 
              <div className='flex justify-center items-center gap-3 animate-pulse'>
                Generating...
                <div class="w-5 h-5 rounded-full border-4 border-t-transparent border-gray-300 animate-spin"></div>
              </div>}
            </button>
          </div>

          <div className='mt-5 p-4 border border-gray-800 rounded-2xl flex flex-col gap-7 bg-[#17171b]'>
            {aiResponse && aiResponse.videoUrl ? <video
              src={aiResponse.videoUrl}
              controls
              className="max-w-full rounded-2xlborder-violet-700/50"
            >
              Your browser does not support the video tag.
            </video> :
              <div className='w-full min-h-80 bg-black flex items-center justify-center'>
                {!loading ? <h1 className='text-gray-500'>AI Generated Explanation Video will appear here...</h1> : <h1 className='animate-pulse text-gray-500'>{dummyLoadingText}</h1>}
              </div>}
            <div className='p-4 bg-[#0e0e11] rounded'>
              {aiResponse.description ? <ReactMarkdown>{aiResponse.description}</ReactMarkdown> : loading ? <h1 className='animate-pulse text-gray-500'>Generating Explanation...</h1> : <h1 className='text-gray-500'>Explanations</h1>}
            </div>
          </div>
        </div>

        <div className="right max-w-1/2 px-6 text-gray-300 flex flex-col gap-5">
          <div className="text-center bg-[#15171c] p-6 rounded-xl border border-gray-800">
            <h2 className="text-3xl font-bold mb-4">
              About Our Platform
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed text-start">
              Our platform empowers creators to generate AI-based explanations and videos
              effortlessly. Whether you’re a student, teacher, or professional, you can
              easily create, manage, and share your own learning content — all in one
              place.
            </p>
          </div>

          <div className="flex flex-col gap-3 bg-[#15171c] rounded border border-gray-800 p-6">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl hover:bg-black transition border border-gray-800 flex flex-col">
              <div className='flex gap-3 items-center'>
                <TryIcon 
                  style={{fontSize: "2rem"}} 
                  className="text-indigo-400"/>
                <h3 className="text-2xl font-semibold mb-2">Write Your Topic</h3>              
              </div>
                <p className="text-gray-400">
                  Enter any concept or question. The AI analyzes your input and prepares a detailed explanation.
                </p>  
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl hover:bg-black transition border border-gray-800 flex flex-col">
              <div className='flex gap-3 items-center'>
                  <AnimationIcon 
                  style={{fontSize: "2rem"}} 
                  className="text-indigo-400"/>
                <h3 className="text-2xl font-semibold mb-2">Watch Animations</h3>              
              </div>
                <p className="text-gray-400">
                  Get a clear, visually engaging animated explanation created by AI — bringing your topic to life.
                </p>  
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl hover:bg-black transition border border-gray-800 flex flex-col">
              <div className='flex gap-3 items-center'>
                <LibraryAddIcon 
                  style={{fontSize: "2rem"}} 
                  className="text-indigo-400"/>
                <h3 className="text-2xl font-semibold mb-2">Save to Library</h3>              
              </div>
                <p className="text-gray-400">
                  Store your generated videos and revisit them anytime in your personal library. You can also just ask for AI explanations without video using the
                </p>  
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
