import './App.css'
import { RouterProvider } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { routes } from './app.routes.jsx'
import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hook/useAuth.js'
import { useEffect } from 'react'

function App() {

  const { handleGetMe } = useAuth()

  const user = useSelector(state => state.auth.user)
  console.log(user);
 useEffect(() => {
  (async () => {
    console.log("APP MOUNTED");
    await handleGetMe();
  })();
}, []);

  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
