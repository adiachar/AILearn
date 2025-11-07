import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

export default function Chat() {
  return (
    <div className='h-full w-full p-10 text-gray-300 flex flex-col justify-between'>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Ask AI</h2>
        <p className="text-gray-400 mb-6">Get instant answers to your questions</p>
      </div>
      <div className='h-full w-full flex flex-col justify-end'>
        {true && 
        <div className='h-full w-full flex flex-col justify-center items-center'>
          <div className='p-4 rounded-2xl bg-[#8871f1]/10'>
            <AutoAwesomeIcon
              sx={{fontSize: "3rem"}} 
              className='text-[#8871f1]'/> 
          </div>
          <div className='mt-2 text-center'>
            <h1>Ask me anything</h1>
            <p className='text-gray-500'>Start by typing a question about any topic</p>
          </div>   
        </div>
        }
      </div>
      <div>
        <label className="font-medium text-lg flex gap-4" htmlFor="topic">
          <input
            className="w-full font-normal text-[1rem] mt-2 p-3 bg-[#0f1013] border border-[#3b3a53] rounded-lg focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none"
            placeholder="Topic or Concept"
          />
          <button className='p-3 rounded-2xl bg-linear-to-r from-[#7B3FF2] to-[#B44CFF] font-semibold hover:from-[#8F50FF] hover:to-[#C05FFF]'>
            <span 
              style={{fontSize: "2rem"}}
              className="material-symbols-outlined rotate-[-60deg]">send</span>             
          </button>     
        </label>
      </div>
    </div>
  )
}
