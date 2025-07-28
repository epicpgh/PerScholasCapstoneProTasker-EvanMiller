import { useState } from 'react'
import { backEndClient } from './clients/backendClients';
import TaskPage from './pages/TaskPage';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Pro-Tasker</h1>
        <h2>Task Management Simplified</h2>
         <NavBar />
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/login' element={<LogInPage/>} />
        <Route path='/tasks/:id' element={<TaskPage/>} />
      </Routes>
        </div>
    </>
  )
}

export default App
