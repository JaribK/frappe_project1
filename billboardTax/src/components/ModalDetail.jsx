import React, { useState,useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Fromsurvey from './Fromsurvey';
import ConfirmPopup from './Confirmpop';
import SignCard from './SignCard';
import { FrappeContext } from 'frappe-react-sdk';

const CardDetailPage = () => {
  const location = useLocation();
  const billboard = location.state?.billboard; 
  const navigate = useNavigate();
  const { call } = useContext(FrappeContext);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isAddSignModalOpen, setIsAddSignModalOpen] = useState(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [idCardNumber, setIdCardNumber] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  console.log(billboard)
  // const handleStatusChange = (status) => {
  //   setSelectedStatus(status);
  //   if (status === 'cancel') {
  //     setIsCancelPopupOpen(true);
  //   }
  //   console.log(`Selected status: ${status}`);
  // };

  const closeCancelPopup = () => setIsCancelPopupOpen(false);

  useEffect(() => {
    if (isCancelPopupOpen) {
      const timer = setTimeout(() => {
        closeCancelPopup();
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [isCancelPopupOpen]);

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

  const handleConfirmSurvey = () => console.log('Survey confirmed');

  const handleAddSign = () => setIsAddSignModalOpen(true);

  
  useEffect(() => {
    if (billboard && billboard.status) {
      setSelectedStatus(billboard.status);
    }
  }, [billboard]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setFormData(prevFormData => ({
      ...prevFormData,
      data_billboards: [
        {
          ...prevFormData.data_billboards[0],
          billboard_status: status  
        }
      ]
    }));
  };
  

  const [formData, setFormData] = useState({
      land_id: '',
      owner_cid: '',
      owner_name: '',
      no_receipt: '',
      research_by: '',
      payment_status: '',
      data_billboards: [{ picture: '', width: '', height: '', type_of_billboards: '', billboard_status: '' }]
  });
  console.log('test :'+ JSON.stringify(formData))

  useEffect(() => {
    const billboradData = () =>{

      if (!billboard.land_id || !billboard.owner_cid || !billboard.owner_name) {
        console.error('Form data is incomplete');
        return;
      }

      setLoading(true);
      console.log(formData)
      if (!formData) return;
      call.put("maechan.api.update_billboard_document", {
          name:billboard.name,
          data: JSON.stringify(formData)
      }).then(r =>{
        setLoading(false);
        console.log(r.message)
      })
      .catch(err => {
        setError('Error post billboard data'); 
        if (err.r && err.r.data && err.r.data.message) {
          console.log(err.r.data.message);
        } else {
          console.log(err);
        }
        setLoading(false);  
      });
    };
      billboradData();
  },[formData])

  return (
    <div className='min-h-screen bg-curious-blue-200 font-prompt font-normal text-curious-blue-950 flex justify-center'>
      {billboard ? (
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
          {/* <div className='Position'>
            <p>ที่ตั้ง (พิกัด)</p>
              <p>{`${card.position.latitude}, ${card.position.longitude}`}</p>
          </div> */}
          <div>
            <p>รหัสที่ดิน</p>
            <p className='mt-1 text-gray-500 bg-seashell-peach-50 rounded-md px-2 py-1'>{billboard.land_id}</p>
          </div>
          <div className='mt-3'>
            <p>ชื่อเจ้าของกิจการ/บริษัท</p>
            <p className='mt-1 text-gray-500 bg-seashell-peach-50 rounded-md px-2 py-1'>{billboard.owner_name}</p>
          </div>
          
          
         <div className='mt-3'>
          <p>สถานะของป้าย</p>
          <div className="flex flex-col ">
            <div
              className={`flex items-center border-none rounded-full px-4 py-2 text-base overflow-hidden ${selectedStatus === 'เปลี่ยนแปลงแล้ว' ? 'active' : ''}`}
              onClick={() => handleStatusChange('เปลี่ยนแปลงแล้ว')}
            >
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${selectedStatus === 'เปลี่ยนแปลงแล้ว' ? 'shadow-[inset_0_0_0_4px_#4195CC] bg-blue-500' : 'bg-white'}`}
              ></span>
              <span>เปลี่ยนแปลง</span>
            </div>
            <div
              className={`flex items-center border-none rounded-full px-4 py-2 text-base overflow-hidden ${selectedStatus === 'ยกเลิกแล้ว' ? 'active' : ''}`}
              onClick={() => handleStatusChange('ยกเลิกแล้ว')}
            >
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${selectedStatus === 'ยกเลิกแล้ว' ? 'shadow-[inset_0_0_0_4px_#4195CC] bg-blue-500' : 'bg-white'}`}
              ></span>
              <span>ยกเลิก</span>
            </div>
          </div>
        </div>


          {isCancelPopupOpen && (
            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-5 z-50'>
              <div className='bg-gray-300 w-1/2 p-4 rounded-lg text-center shadow-lg'>
                <i className="fa-regular fa-circle-xmark custom-size text-red-700"></i>
                <p>ยกเลิกแล้ว</p>
               
              </div>
            </div>
          )}
          
          <div className="mt-3">
            <p>สถานะการจ่ายเงิน</p>
            <div className="flex flex-col ">
            <p
              className={`flex items-center px-4 py-2 rounded-full text-base  overflow-hidden ${
                selectedPaymentStatus === 'ยังไม่จ่าย' ? '' : ''}
              }`}
              onClick={() => handlePaymentStatusChange('ยังไม่จ่าย')}
            >
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${
                  selectedPaymentStatus === 'ยังไม่จ่าย' ? 'bg-curious-blue-500' : 'bg-white'
                }`}
              ></span>
              <span>ยังไม่ได้ชำระ</span>
            </p>

              {selectedPaymentStatus === 'ยังไม่จ่าย' && (
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
                className={`flex items-center px-4 py-2 rounded-full text-base  overflow-hidden ${selectedPaymentStatus === 'จ่ายแล้ว' ? 'active' : ''}`}
                onClick={() => handlePaymentStatusChange('จ่ายแล้ว')}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${selectedPaymentStatus === 'จ่ายแล้ว' ? 'bg-blue-500' : 'bg-white'}`}></span>
                <span >ชำระแล้ว</span>
              </p>

              {selectedPaymentStatus === 'จ่ายแล้ว' && (
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
          
          <div className='mt-3'>
            <p>จำนวนป้าย : {billboard.data_billboards.length}</p>
          </div>

          <div className='mt-3'>
            <p>จำนวนเงินทั้งหมด (บาท) : {billboard.total_price}</p>
          </div>

          <div className='flex flex-col items-center mt-4'>
            <button className='mb-5 mt-2 px-3 py-4 rounded bg-curious-blue-500 text-white font-semibold text-xl' onClick={handleConfirmSurvey}>ยืนยันการสำรวจ</button>
            <button className='self-end mb-5 px-6 py-2 rounded bg-cruise-500 text-white font-semibold text=lg' onClick={handleAddSign}>เพิ่มป้าย</button>
          </div>

          <div className=''>
            <SignCard/>
          </div>

          {isAddSignModalOpen && (
            <Fromsurvey onClose={() => setIsAddSignModalOpen(false)} />
          )}
        </div>
      ) : (
        <p>ไม่มีข้อมูลการ์ด</p>
      )}
    </div>
  );
};

export default CardDetailPage;
