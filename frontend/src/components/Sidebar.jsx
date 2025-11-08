import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

export default function Sidebar({options, selectedOption, setSelectedOption}) {
  return (
    <div className='h-full bg-[#111216] text-white'>
        <div className="h-full w-full  border-red-600 flex flex-col justify-between">
          <div className='p-5 border-b border-neutral-900 flex gap-3'>
            <div className='p-3 rounded-2xl bg-linear-to-r from-[#7B3FF2] to-[#B44CFF] font-semibold hover:from-[#8F50FF] hover:to-[#C05FFF]'>
              <AutoAwesomeIcon/>              
            </div>

            <h1 className="font-semibold flex flex-col">
              <span className='text-lg text-gray-300'>AI Learning</span>
              <span className="font-semibold text-gray-400 text-sm">Platform</span></h1>            
          </div>
          <div className='h-full'>
            <div className=" p-4 space-y-2 flex flex-col">
              {options.map((option, idx) => 
                <button 
                  onClick={() => setSelectedOption(idx)}
                  key={idx} 
                  className={`w-full text-left text-gray-300 px-3 py-2 rounded-lg flex items-center gap-3 ${selectedOption === idx ? 'bg-indigo-500/10' : 'hover:bg-[#191c21]'}`}>
                    {idx === 0 ? 
                      <span className="material-symbols-outlined">videocam</span> : 
                      idx === 1 ? <span className="material-symbols-outlined">chat_bubble</span>: 
                        <span className="material-symbols-outlined">video_library</span>}
                    <span className='flex flex-col'>
                      <span className={`font-medium text-lg ${selectedOption === idx && 'text-[#8277fa]'}`}>{option.title}</span>
                      <span className="font-semibold text-gray-400">{option.description}</span>
                    </span>
                  </button>
              )}
            </div>            
          </div>
          <div className='p-4 border-t border-neutral-900'>
            <p className='font-normal text-gray-400 text-sm'>Learn anything with AI-powered explanations and animated videos</p>
          </div>
        </div>
    </div>
  )
}
