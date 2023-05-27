import React, { useEffect, useState } from 'react'
import Header from './Header'
import axios from 'axios'
axios.defaults.withCredentials = true
let firstRender = true;
const Welcome = () => {
    const [user, setUser] = useState()

    const refreshToken = async () => {
        const res = await axios.get("http://localhost:5000/api/refresh",{
            withCredentials: true
            }).catch((err) => {
                console.log(err)
            })

            const data = await res.data;
            return data;
    }

    const sendRequest = async () => {
        const res = await axios.get("http://localhost:5000/api/user",{
            withCredentials: true
        }).catch((error) => {
            console.log(error)
        })
        const data = await res.data;
        return data;
    }
    useEffect(() => {
        if(firstRender){
            firstRender = false
            sendRequest().then((data) => {
                setUser(data.data)
            })
        }
        let interval = setInterval(() => {
            refreshToken().then((data) => {
                setUser(data.data)
            })
        },1000 * 29)

        return () =>  clearInterval(interval)
    },[])
  return (
    <div>
        <Header/>
        <div>
            {user && <div>
                <h1>{user.name}</h1>
                <h1>{user.email}</h1>
                </div>
                }
        </div>
    </div>
  )
}

export default Welcome