import {useState} from 'react'
import Sidebar from './Sidebar.jsx'
import CreateVideo from './CreateVideo.jsx'
import Chat from './Chat.jsx'
import Library from './Library.jsx'


const options = [{title: 'Create Explanation', description: 'Generate video & text'}, {title: 'Ask AI', description: 'Quick questions'}, {title: 'My Library', description: 'Saved content'}]

export default function Page() {

  const [selectedOption, setSelectedOption] = useState(0)

  return (
    <div className='w-screen h-screen bg-[#0e0e11] flex'>
      <div className='h-full w-3/12'>
        <Sidebar options={options} selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
      </div>
      <div className='w-full'>
        {selectedOption === 0 ? <CreateVideo /> : selectedOption === 1 ? <Chat/> : <Library />}
      </div>
    </div>
  )
}
