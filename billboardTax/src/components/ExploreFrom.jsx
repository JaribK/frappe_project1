import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SignCard from './SignCard';
import Fromsurvey from './Fromsurvey';
import ConfirmPopup from './Confirmpop';



export default function ExploreFrom() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isAddSignModalOpen, setIsAddSignModalOpen] = useState(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [idCardNumber, setIdCardNumber] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const [landNumber, setLandNumber] = useState('');


  // useEffect(() => {
  //   if (location.state && location.state.landNumber) {
  //     setLandNumber(location.state.landNumber);
  //   }
  // }, [location.state]);

  // const handleStatusChange = (status) => {
  //   setSelectedStatus(status);
  //   if (status === 'cancel') {
  //     setIsCancelPopupOpen(true);
  //   }
  //   console.log(`Selected status: ${status}`);
  // };

  const closeCancelPopup = () => setIsCancelPopupOpen(false);

  const handlePaymentStatusChange = (status) => {
    setSelectedPaymentStatus(status);
  };

  const onClose = () => {
    setIsConfirmPopupOpen(true);
  };
  const handleConfirmClose = () => {
    setIsConfirmPopupOpen(false);
    navigate('/home');
  };

  const handleCancelClose = () => {
    setIsConfirmPopupOpen(false);
  };



  const handleAddSign = () => setIsAddSignModalOpen(true);

  
  const handleConfirmSurvey = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false); 
    }, 3000);
  };
  
  return (
    
    <div className='flex justify-center min-h-screen bg-curious-blue-200 font-prompt font-normal text-curious-blue-950 '>
      <div className='w-5/6'>
          <button onClick={onClose} className='absolute top-4 right-6 text-3xl '>
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
          <ConfirmPopup
            isOpen={isConfirmPopupOpen}
            onConfirm={handleConfirmClose}
            onCancel={handleCancelClose}
            />
          <div className='text-center py-10 text-2xl font-medium'><p>ข้อมูลการสำรวจ</p></div>
          {/* <div className='PositionII'>
            <p>ที่ตั้ง (พิกัด)</p>
            <input type="text" />
          </div> */}
          <div>
          <p>รหัสที่ดิน</p>
            <input 
              type="text" 
              value={landNumber} 
              className='h-8 w-full mt-1 text-gray-500 bg-seashell-peach-50 rounded-md px-2 py-1' />
          </div>
          <div className='mt-3'>
            <p>ชื่อเจ้าของกิจการ/บริษัท</p>
            <input type="text"
              
              className='h-8 w-full mt-1 text-gray-500 bg-seashell-peach-50 rounded-md px-2 py-1' 
            />
          </div>
          
          
          {/* <div className='mt-3'>
            <p>สถานะของป้าย</p>
            <div className="flex flex-col ">
              <p
              className={`flex items-center border-none rounded-full px-4 py-2 text-base  overflow-hidden ${selectedStatus === 'change' ? 'active' : ''}`}
              onClick={() => handleStatusChange('change')}
              >
                <span className={` inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${selectedStatus === 'change' ? 'shadow-[inset_0_0_0_4px_#4195CC] bg-blue-500' : 'bg-white'}`}></span>
                <span >เปลี่ยนแปลง</span>
              </p>
              <p
              className={`flex items-center border-none rounded-full px-4 py-2 text-base overflow-hidden  ${selectedStatus === 'cancel' ? 'active' : ''}`}
              onClick={() => handleStatusChange('cancel')}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${selectedStatus === 'cancel' ? 'shadow-[inset_0_0_0_4px_#4195CC] bg-blue-500': 'bg-white'}`}></span>
                <span >ยกเลิก</span>
              </p>
            </div>
          </div>

          {isCancelPopupOpen && (
            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-5 z-50 '>
              <div className='bg-gray-300 w-1/2 p-4 rounded-lg text-center shadow-lg'>
                <i className="fa-regular fa-circle-xmark custom-size text-red-700"></i>
                <p>ยกเลิกแล้ว</p>
               
              </div>
            </div>
          )} */}
          
          <div className="mt-3">
            <p>สถานะการจ่ายเงิน</p>
            <div className="flex flex-col ">
            <p
              className={`flex items-center px-4 py-2 rounded-full text-base  overflow-hidden ${
                selectedPaymentStatus === 'not_paid' ? '' : ''}
              }`}
              onClick={() => handlePaymentStatusChange('not_paid')}
            >
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${
                  selectedPaymentStatus === 'not_paid' ? 'bg-curious-blue-500' : 'bg-white'
                }`}
              ></span>
              <span>ยังไม่ได้ชำระ</span>
            </p>

              {selectedPaymentStatus === 'not_paid' && (
                <div className="w-9/12 mx-8 rounded-xl px-5 py-4 bg-curious-blue-300">
                  <p>เลขบัตรประชาชน</p>
                  <input 
                    className='rounded-md bg-seashellpeach-50 h-5'
                    type="text" 
                    value={idCardNumber} 
                    onChange={(e) => setIdCardNumber(e.target.value)} 
                  />
                </div>
              )}

              <p
                className={`flex items-center px-4 py-2 rounded-full text-base  overflow-hidden ${selectedPaymentStatus === 'paid' ? 'active' : ''}`}
                onClick={() => handlePaymentStatusChange('paid')}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${selectedPaymentStatus === 'paid' ? 'bg-blue-500' : 'bg-white'}`}></span>
                <span >ชำระแล้ว</span>
              </p>

              {selectedPaymentStatus === 'paid' && (
                <div className="w-9/12 mx-8 rounded-xl px-5 py-4 bg-curious-blue-300">
                  <p>เลขที่ใบเสร็จชำระเงิน</p>
                  <input 
                    className='rounded-md bg-seashellpeach-50 h-5'
                    type="text" 
                    value={receiptNumber} 
                    onChange={(e) => setReceiptNumber(e.target.value)}  
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* <div className='mt-3 inline-flex'>
            <p>จำนวนป้าย : </p>
            <input type="text" className='bg-inherit border-b ml-2  border-curious-blue-950 focus:border-curious-blue-700 outline-none'/>
          </div> */}

          <div className='mt-3 inline-flex text-sm'>
            <p>จำนวนเงินทั้งหมด (บาท) :</p>
            <input type="text" className='bg-inherit border-b ml-1  border-curious-blue-700 focus:border-curious-blue-700 outline-none'/>

          </div>

          <div className='flex flex-col items-center mt-4'>
            <button className='my-5 px-3 py-4 rounded bg-curious-blue-500 text-white font-semibold text-xl' onClick={handleConfirmSurvey}>ยืนยันการสำรวจ</button>
            <button className='self-end  px-6 py-2 rounded bg-cruise-500 text-white font-semibold text=lg' onClick={handleAddSign}>เพิ่มป้าย</button>
          </div>

          {/* <div className=''>
            <SignCard/>
          </div> */}

          {isAddSignModalOpen && (
            <Fromsurvey onClose={() => setIsAddSignModalOpen(false)} />
          )}
          
          {showPopup && (
            <div className="">
              <p>บันทึกสำเร็จ</p>
            </div>
          )}
          </div>
    </div>
  );
}
