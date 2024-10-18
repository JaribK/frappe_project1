import React from 'react'
import Manu from '../components/Manu';
import { useNavigate } from 'react-router-dom';
import { useFrappeAuth } from 'frappe-react-sdk';
import Navbar from '../components/Navbar';

export default function Profile() {
  const navigate = useNavigate();
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

const dologout = async () => {
  try {
    if (!currentUser) {
      console.error('user not found');
      return;
    }
    await logout();
    console.log('logout succeed')
    navigate('/');
  } catch (error) {
    console.error('Logout failed', error);
  }
};
const handleNavigate = (path) => {
  navigate(path);
};
  return(
  <div className='flex flex-col h-screen font-prompt'>
    <Navbar/>
    <div className="flex-grow overflow-auto">
    
     <div className='flex items-center justify-center my-6'>
      <i className="fa-regular fa-circle-user text-7xl "></i>
     </div>
      <h3 className="text-xl  flex items-center justify-center my-6">ชื่อผู้ใช้ : {currentUser}</h3>
      <div className='bg-linen-50 rounded-md m-4'>
        <div className='flex items-center px-5 py-2.5 font-prompt ' onClick={() => handleNavigate('/setting')}>
          <p>ตั้งค่าการแสดงผล</p>
        </div>
        <div className='flex items-center px-5 py-2.5 font-prompt border-t-2 border-alto-200 ' onClick={() => handleNavigate('/setting')}>
          <p>ตั้งค่าการประสิทธิภาพ</p>
        </div>
        <div className='flex items-center px-5 py-2.5 font-prompt border-t-2 border-alto-200' onClick={() => handleNavigate('/setting')}>
          <p>ตั้งค่าความเป็นส่วนตัว</p>
        </div>
      </div>  
      <div className='bg-linen-50 rounded-md m-4'>
        <div className='flex items-center px-5 py-2.5 font-prompt ' onClick={() => handleNavigate('/manual')}>
          <p>คู่มือการใช้งาน</p>
        </div>
        <div className='flex items-center px-5 py-2.5 font-prompt border-t-2 border-alto-200' onClick={() => handleNavigate('/help')}>
          <p>ศูนย์ช่วยเหลือ</p>
        </div>
        
      </div>
      <div className='bg-linen-50 rounded-md m-4' onClick={dologout}>
        {/* <i className="fas fa-sign-out-alt text-2xl m-2.5 px-5" onClick={dologout}></i> */}
        <p className='mt-1 py-2 text-lg text-seashell-peach-600 flex justify-center items-center ' >Logout</p>
      </div>
    </div>
    <Manu/>
  </div>
);
}