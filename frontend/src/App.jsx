import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Page from './components/Page'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='m-0 p-0 min-w-screen min-h-screen'>
      <Page/>
    </div>
  )
}

export default App
