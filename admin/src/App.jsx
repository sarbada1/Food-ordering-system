
import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/SIdebar/Sidebar'
import { Routes,Route } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Order from './pages/Order/Order'
const App = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path='/add' element={<Add/>} />
          <Route path='/list' element={<List/>} />
          <Route path='/order' element={<Order/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App