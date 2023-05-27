import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App.jsx'
import './index.css'
import Welcome from './components/Welcome.jsx'
import Login from './components/Login.jsx'
import SignUp from './components/SignUp.jsx'
import { store } from './store/index.js'

const router = createBrowserRouter([
  {
    path: "/",
    element:  <Welcome/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/signup",
    element: <SignUp/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}>
         <App />
    </RouterProvider>
      </Provider>
  </React.StrictMode>,
)
