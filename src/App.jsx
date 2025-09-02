import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AddTransactionModal from './Components/Transaction/transaction.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AddTransactionModal />
    </>
  )
}

export default App
