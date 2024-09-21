import logo from '../public/billboard.png'
import './App.css';
import '@fontsource/inter';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './page/Home'
import CardDetail from './components/ModalDetail'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Explore from './page/Explore';
import ExploreFrom from './components/ExploreFrom';
import { FrappeProvider, useFrappeAuth } from 'frappe-react-sdk'


function App() {
  return (
    <div className="bg-sky-500">
      <FrappeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/manual" element={<Home />} />
            <Route path="/help" element={<Home />} />
            <Route path='/card-detail/:cardId' element={<CardDetail />} />
            <Route path='/explorefrom/:landNumber' element={<ExploreFrom />} />
            <Route path='/explorefrom' element={<ExploreFrom />} />
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
        console.log('doLogin result', result)
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

  const doLogout = async () => {
    await isLoginWrapper(async () => {
      let result = await logout()
      console.log(result)
    })
  }

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
      <header className="w-full h-svh justify-center flex">
        <div className='flex flex-col justify-center items-center'>
          <img src={logo} className="w-3/12 rounded-full" alt="logo" />
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
            <div className="text-center">
              <button type="submit"
                className='py-3.5 px-10 my-4 mx-8 bg-red-50 text-sky-950 font-Inter font-bold border-none rounded-xl text-xl hover:bg-customBlue hover:text-red-50'>Login</button>
            </div>
            {errorMessage && <p className='text-red-700 '>{errorMessage}</p>}
          </form>
        </div>
      </header>
    )
  }


}

export default App;
