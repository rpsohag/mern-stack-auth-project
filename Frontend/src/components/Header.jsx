import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { authActions } from '../store';
axios.defaults.withCredentials = true;

const Header = () => {
  const isLoggedIn = useSelector(state => state.isLoggedIn)
  const dispatch = useDispatch()

  const sendLogoutRequest = async () => {
    const res = await axios.post("http://localhost:5000/api/logout", null,{
      withCredentials : true
    })
    if(res.status === 2000){
      return res
    }
    return new Error("unable to logout")
  }

  const handleLogout = () => {
    sendLogoutRequest().then(() => {
      dispatch(authActions.logout())
    })
  }
  return (
    <div>
        <nav>
            <div className="logo">
            <Link to="/">Logo</Link>
            </div>
            <ul>
              {!isLoggedIn && 
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">SignUp</Link></li>
              </>
              }
                {isLoggedIn && 
                <li><Link to="/" onClick={handleLogout}>LogOut</Link></li>
              }
            </ul>
        </nav>
    </div>
  )
}

export default Header