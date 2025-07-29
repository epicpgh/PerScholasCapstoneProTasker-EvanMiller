import { useState } from 'react'

import TaskDetailPage from './pages/TaskDetailPage';
import TaskListPage from './pages/TaskLIstPage';
import HomePage from'./pages/HomePage'
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar';
import {Routes, Route} from 'react-router-dom';
import './App.css'

function App() {
 

  return (
    <>
      <div className='NavBar'>
        <h1>Pro-Tasker</h1>
        <h2>Task Management Simplified</h2>
         <NavBar />
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/login' element={<LoginPage/>} />
       <Route path="/tasks" element={<TaskListPage />} />
       <Route path="/tasks/:id" element={<TaskDetailPage />} />

      </Routes>
        </div>
    </>
  )
}

export default App
