import './App.css';
import '@fontsource/inter';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './page/Home'
import CardDetail from './components/ModalDetail'
import axios from 'axios';
import React, { useEffect, useState,useContext  } from 'react';
import Explore from './page/Explore';
import ExploreFrom from './components/ExploreFrom';
import { FrappeProvider, useFrappeAuth } from 'frappe-react-sdk'
import Map from './components/Map';


function App() {
  return (
    <div className="min-h-screen">
      <FrappeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/manual" element={<Home />} />
            <Route path="/help" element={<Home />} />
            <Route path='/card-detail/:billboardname' element={<CardDetail />} />
            <Route path='/explorefrom/:landNumber' element={<ExploreFrom />} />
            <Route path='/explorefrom' element={<ExploreFrom />} />
            <Route path='/map' element={<Map/>} />
          </Routes>
        </Router>
      </FrappeProvider>
    </div>
  );
}

function Login() {

  const {
    currentUser,
    isValidating,
    isLoading,
    login,
    logout,
    error,
    updateCurrentUser,
    getUserCookie,

  } = useFrappeAuth()

  const logo = '/billboard.png';
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [name]: value
    }));
  };


  const doLogin = async () => {

    await isLoginWrapper(async () => {
      try {
        // setLoginError({ message: '' })
        let result = await login(credentials)

        updateCurrentUser({ username: credentials.username });
        console.log('doLogin result', result)
        console.log(result)
        navigate('/home')
      } catch (error) {
        console.log('doLogin error', error)
        // setLoginError(error)
      }
    })
  }
  const isLoginWrapper = async (callback) => {
    // setIsLogin(true)
    await callback()
    // setIsLogin(false)
  }

  // const doLogout = async () => {
  //   await isLoginWrapper(async () => {
  //     let result = await logout()
  //     console.log(result)
  //   })
  // }

  const handleHome = async (e) => {
    e.preventDefault()
    await doLogin()
  }

  if(isLoading) {
    return (<div>Loading...</div>)
  }

  if (currentUser) {
    navigate('/home')
  } else {
    return (
      <header className="w-full  min-h-screen justify-center flex flex-col bg-curious-blue-500">
        <div className='flex flex-col justify-center items-center'>
          <img src={logo} className="max-w-[15rem]  md:max-w-sm lg:max-w-md rounded-3xl my-8" alt="logo" />
          <form className="mt-5 text-left" onSubmit={handleHome}>
            <label className='mb-1.5 block font-Inter font-bold text-sky-950'>Userame</label>
            <input
              type="text"
              id="username"
              name="username"
              className='mb-4 p-2.5 w-52 border-none rounded-2xl'
              value={credentials.username} onChange={handleChange}
              placeholder="Enter your username" /><br />
            <label htmlFor="password" className='mb-1.5 block font-Inter font-bold text-sky-950'>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className='mb-4 p-2.5 w-52 border-none rounded-2xl'
              value={credentials.password} onChange={handleChange}
              placeholder="Enter your password"
            /><br />
            <div >
              <button type="submit"
                className='py-3.5 px-10 my-4 mx-8 bg-seashell-peach-50 text-custom-blue-950 font-Inter font-bold border-none rounded-xl text-xl hover:bg-curious-blue-600 hover:text-curious-blue-50 transition duration-300'>Login</button>
            </div>
            {errorMessage && <p className='text-red-700 '>{errorMessage}</p>}
          </form>
        </div>
      </header>
    )
  }


}

export default App;
