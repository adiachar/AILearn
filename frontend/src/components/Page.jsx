import {useState} from 'react'
import Sidebar from './Sidebar.jsx'
import CreateVideo from './CreateVideo.jsx'
import Chat from './Chat.jsx'
import Library from './Library.jsx'


const options = [{title: 'Create Explanation', description: 'Generate video & text'}, {title: 'Ask AI', description: 'Quick questions'}, {title: 'My Library', description: 'Saved content'}]

export default function Page() {

  const [selectedOption, setSelectedOption] = useState(0)
  const [openOptions, setOpenOptions] = useState(false)

  return (
    <div className='w-screen h-screen bg-[#0e0e11] flex'>
      <div className={`h-full lg:flex lg:relative ${!openOptions ? 'hidden' : 'absolute w-4/6 lg:w-auto'}`}>
        <Sidebar options={options} selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
      </div>
      <div className='h-screen w-full flex flex-col justify-between border'>
        <div className='w-full h-15 lg:h-10 bg-[#111216] border-b border-neutral-900 flex items-center'>
          <div
            className={`w-full h-full px-3 ${openOptions && 'hidden'} md:hidden lg:hidden text-gray-300 flex items-center`}>
            <span
              onClick={() => setOpenOptions(o => !o)}
              style={{fontSize: '2rem'}} 
              className="material-symbols-outlined">menu</span>
          </div>
        </div>
        <div
          className='h-full overflow-auto' 
          onClick={() => setOpenOptions(false)} >
          {selectedOption === 0 ? <CreateVideo /> : selectedOption === 1 ? <Chat/> : <Library />}          
        </div>
      </div>
    </div>
  )
}
