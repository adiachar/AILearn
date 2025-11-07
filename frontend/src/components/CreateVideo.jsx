import {useState} from 'react'
import axios from 'axios'
import ReactMarkdown from "react-markdown"

export default function CreateVideo() {
  const [topic, setTopic] = useState('')
  const [addContext, setAddContext] = useState('')
  const [aiResponse, setAiResponse] = useState({})
  const [loading, setLoading] = useState(false)
  

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

  return (
    <div className='h-full flex-1 p-10 text-gray-300 overflow-auto'>
      <h2 className="text-2xl font-semibold mb-4">Create Explanation Video</h2>
      <p className="text-gray-400 mb-6">Enter a topic or concept, and AI will generate both an animated explanation video and detailed text explanation</p>
      <div className="w-full mx-auto bg-[#15171c] p-8 rounded-xl flex flex-col gap-4">

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
          className="mt-6 w-full py-2 rounded-lg bg-linear-to-r from-[#7B3FF2] to-[#B44CFF] font-semibold hover:from-[#8F50FF] hover:to-[#C05FFF]"
        >
         {!loading ? 'Generate Explanation' : 'Generating...'}
        </button>
      </div>

      {aiResponse && aiResponse.videoUrl && <div className='mt-5 p-4 border border-gray-800 rounded-2xl flex flex-col gap-7 bg-[#17171b]'>
        <video
          src={aiResponse.videoUrl}
          controls
          className="max-w-full rounded-2xlborder-violet-700/50"
        >
          Your browser does not support the video tag.
        </video>
        <div className='p-4 border border-gray-800 rounded'>
          <ReactMarkdown>{aiResponse.description}</ReactMarkdown>
        </div>
      </div>
      }
    </div>
  )
}
