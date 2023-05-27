import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Welcome from './components/Welcome'
import { useSelector } from 'react-redux'

function App() {
  const isLoggedIn = useSelector(state => state.isLoggedIn)

  return (
    <>

      
    </>
  )
}

export default App
