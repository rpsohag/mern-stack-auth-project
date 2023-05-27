import React, { useState } from 'react'
import axios from 'axios'
import Header from './Header'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authActions } from '../store'
axios.defaults.withCredentials

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setInputs(prev => ({
            ...prev,
            [e.target.name] : e.target.value
        }))

    }

    const sendRequest = async () => {
        const res = await axios.post("http://localhost:5000/api/login",{
            email: inputs.email,
            password: inputs.password
        }).catch((error) => {
            console.log(error)
        })
        const data = await res.data;
        return data;
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest().then(() => {
            dispatch(authActions.login())
        }).then(() => {
            navigate("/")
        })
    }
  return (
    <div>
        <Header/>
        <form onSubmit={handleSubmit}>
            <div className="formGroup">
                <input type="email" value={inputs.email} onChange={handleChange} name='email' placeholder='enter your email' />
                <input type="password" value={inputs.password} onChange={handleChange} name='password' placeholder='enter your password' />
                <input type="submit" value="submit" />
            </div>
        </form>
    </div>
  )
}

export default Login