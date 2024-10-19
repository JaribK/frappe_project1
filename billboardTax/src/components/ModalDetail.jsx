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
  const [isAddSignModalOpen, setIsAddSignModalOpen] = useState(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  console.log(billboard)
  console.log('moo is',billboard.moo)
  const [formData, setFormData] = useState({
      land_id: billboard.land_id,
      owner_cid: billboard.owner_cid,
      owner_name: billboard.owner_name,
      no_receipt: billboard.no_receipt,
      research_by: billboard.research_by || '',
      payment_status: '',
      billboard_status: '',
      data_billboards: billboard.data_billboards || []
  });  
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  console.log('formdata',formData)
  
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
    setFormData((prevState) => ({
      ...prevState,
      payment_status: status
    }));
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

  useEffect(() => {
    console.log('สถานะจ่ายเงินที่อัปเดต:', selectedPaymentStatus);
  }, [selectedPaymentStatus]);  
  
  useEffect(() => {
    console.log('สถานะที่อัปเดต:', selectedStatus);
  }, [selectedStatus]);  

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setFormData((prevState) => ({
      ...prevState,
      billboard_status: status
    }));
  };
  

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      payment_status: selectedPaymentStatus,
      billboard_status: selectedStatus
    }));
  }, [selectedPaymentStatus, selectedStatus]);
  

  //console.log('test :'+ JSON.stringify(formData))


    const handleConfirmSurvey = () =>{
      const fieldNames = {
        land_id: 'รหัสที่ดิน',
        owner_cid: 'หมายเลขประจำตัวประชาชน',
        owner_name: 'ชื่อเจ้าของ',
        no_receipt: 'หมายเลขใบเสร็จ',
        research_by: 'ผู้วิจัย',
        payment_status: 'สถานะการชำระเงิน',
        billboard_status: 'สถานะของป้าย',
      };
      const billboardFieldNames = {
        picture: 'ภาพ',
        width: 'ความกว้าง',
        height: 'ความสูง',
        price: 'ราคา',
        type_of_billboards: 'ประเภทของป้าย',
      };
      const missingFields = [];
      if (!formData.land_id) {
        missingFields.push('land_id');
      }
      if (!formData.owner_name) {
        missingFields.push('owner_name');
      }
      if (formData.payment_status) {
      if (!formData.no_receipt && !formData.owner_cid) {
        missingFields.push('no_receipt และ owner_cid');
      }
    }
      // if (!formData.research_by) {
      //   missingFields.push('research_by');
      // }
      if (!formData.payment_status) {
        missingFields.push('payment_status');
      }
      if (!formData.billboard_status) {
        missingFields.push('billboard_status');
      }

      // ตรวจสอบ data_billboards
      if (!Array.isArray(formData.data_billboards) || formData.data_billboards.length === 0) {
        missingFields.push('ไม่มีข้อมูลป้าย');
      } else {
        // ตรวจสอบแต่ละรายการใน data_billboards
        formData.data_billboards.forEach((sign, index) => {
          if (!sign.picture) {
            missingFields.push(`ป้ายที่ ${index + 1}: ${billboardFieldNames.picture}`);
          }
          if (!sign.width) {
            missingFields.push(`ป้ายที่ ${index + 1}: ${billboardFieldNames.width}`);
          }
          if (!sign.height) {
            missingFields.push(`ป้ายที่ ${index + 1}: ${billboardFieldNames.height}`);
          }
          // if (!sign.price || sign.price === '0.00') {
          //   missingFields.push(`ป้ายที่ ${index + 1}: ${billboardFieldNames.price}`);
          // }
          if (!sign.type_of_billboards) {
            missingFields.push(`ป้ายที่ ${index + 1}: ${billboardFieldNames.type_of_billboards}`);
          }
        });
      }
      if (missingFields.length > 0) {
        const friendlyMissingFields = missingFields.map(field => {
          if (field === 'ไม่มีข้อมูลป้าย') {
            return field; 
          }
          if (field.startsWith('data_billboards')) {
            const [_, fieldName] = field.split('].'); 
            const index = fieldName.includes('[') ? fieldName.split('[')[1].replace(']', '') : null; 
            const displayIndex = index !== null ? `ป้ายที่ ${parseInt(index) + 1}` : "ป้ายที่ ?";
            return `${displayIndex}: ${billboardFieldNames[fieldName.replace('data_billboards[0].', '')] || fieldName}`;
          }
          return fieldNames[field] || field;
        }).join(', ');
        const errorMessage = `ข้อมูลที่ไม่ครบถ้วน ได้แก่ \n${friendlyMissingFields}`;
        console.log('เกิดข้อผิดพลาด: ข้อมูลที่ไม่ครบถ้วน ได้แก่',errorMessage)
        showModalWithMessage(errorMessage); 
        setIsSuccess(false);
        return;
      }

      setLoading(true);
      console.log(formData)
      console.log(billboard.name)
      if (!formData) return;
      call.put("maechan.api.update_billboard_document", {
          name:billboard.name,
          data: formData
      }) .then((response) => {
        setLoading(false);
        console.log(response.message);
        showModalWithMessage('ยืนยันการสำรวจ');
        setIsSuccess(true);
      })
      .catch((err) => {
        setError('Error post billboard data'); 
        if (err.r && err.r.data && err.r.data.message) {
          console.log(err.r.data.message);
        } else {
          console.log(err);
        }
        setLoading(false);  
      });
    }

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
    

    const addSign = (newSign) => {
      setFormData((prevState) => {
        const updatedSigns = [...prevState.data_billboards, newSign];
        return {
          ...prevState,
          data_billboards: updatedSigns
        };
      });
    };
    
      const removeSign = (indexToRemove) => {
        setFormData((prevState) => {
          const updatedSigns = prevState.data_billboards.filter((_, index) => index !== indexToRemove);
          return {
            ...prevState,
            data_billboards: updatedSigns
          };
        });
      };
      
      const updateSign = (indexToUpdate, updatedSign) => {
        setFormData((prevState) => {
          const updatedSigns = prevState.data_billboards.map((sign, index) =>
            index === indexToUpdate ? updatedSign : sign
          );
          return {
            ...prevState,
            data_billboards: updatedSigns
          };
        });
      };
      const showModalWithMessage = (message) => {
        setPopupMessage(message);
        setShowModal(true);
      };
    
      const closeModal = () => {
        setShowModal(false); 
      };
    
      if (loading) return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
            <i className="fa-solid fa-spinner animate-spin text-5xl mb-2"></i>
            <p className='text-center'>Loading...</p>
          </div>
        </div>
      );
      

  return (
    <div className='min-h-screen  font-prompt  font-normal text-curious-blue-950 flex justify-center'>
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
          <div>
            <p>รหัสที่ดิน</p>
            <p className='mt-1 text-gray-500 bg-seashell-peach-50 rounded-md px-2 py-1'>{billboard.land_id}</p>
          </div>
          <div className='mt-3'>
            <p>ชื่อเจ้าของกิจการ/บริษัท</p>
            <p className='mt-1 text-gray-500 bg-seashell-peach-50 rounded-md px-2 py-1'>{billboard.owner_name}</p>
          </div>
          <div  className='mt-3'>
            <p className='mb-1'>เลขบัตรประชาชน</p>
            <input 
              className='w-full mt-1 text-gray-500 bg-seashell-peach-50 rounded-md px-2 py-1'              
              type="text" 
              name="owner_cid"
              value={formData.owner_cid} 
              onChange={handleChange} 
            />
          </div>
          
         <div className='mt-3'>
          <p>สถานะของป้าย</p>
          <div className="flex flex-col ">
            <div
              className={`flex items-center border-none rounded-full px-4 py-2 text-base overflow-hidden ${selectedStatus === 'เปลี่ยนแปลงแล้ว' ? 'active' : ''}`}
              onClick={() => handleStatusChange('เปลี่ยนแปลงแล้ว')}
            >
              <span
              value={billboard.billboard_status}
                className={`
                  inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 border-2 border-alto-500
                  ${selectedStatus === 'เปลี่ยนแปลงแล้ว' ? 'shadow-[inset_0_0_0_4px_#4195CC] bg-blue-500' : 'bg-white'
                  }`}
              ></span>
              <span>เปลี่ยนแปลง</span>
            </div>
            <div
              className={`flex items-center border-none rounded-full px-4 py-2 text-base overflow-hidden ${selectedStatus === 'ยกเลิกแล้ว' ? 'active' : ''}`}
              onClick={() => handleStatusChange('ยกเลิกแล้ว')}
            >
              <span
                value={billboard.billboard_status}
                className={`inline-flex items-center justify-center w-5 h-5 border-2 border-alto-500 rounded-full mr-2 ${selectedStatus === 'ยกเลิกแล้ว' ? 'shadow-[inset_0_0_0_4px_#4195CC] bg-blue-500' : 'bg-white'}`}
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
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 border-2 border-alto-500 ${
                  selectedPaymentStatus === 'ยังไม่จ่าย' ? 'bg-curious-blue-500' : 'bg-white'
                }`}
              ></span>
              <span>ยังไม่ได้ชำระ</span>
            </p>

              <p
                className={`flex items-center px-4 py-2 rounded-full text-base  overflow-hidden ${selectedPaymentStatus === 'จ่ายแล้ว' ? 'active' : ''}`}
                onClick={() => handlePaymentStatusChange('จ่ายแล้ว')}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 border-2 border-alto-500 ${selectedPaymentStatus === 'จ่ายแล้ว' ? 'bg-blue-500' : 'bg-white'}`}></span>
                <span >ชำระแล้ว</span>
              </p>

              {selectedPaymentStatus === 'จ่ายแล้ว' && (
                <div className="w-9/12 mx-8 rounded-xl px-5 py-4 bg-curious-blue-300">
                  <p>เลขที่ใบเสร็จชำระเงิน</p>
                  <input 
                    className='rounded-md bg-seashell-peach-50 h-5'
                    type="text"
                    name='no_receipt' 
                    value={formData.no_receipt} 
                    onChange={handleChange}  
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* <div className='mt-3'>
            <p>จำนวนป้าย : {billboard.data_billboards.length}</p>
          </div> */}

          <div className='mt-3'>
            <p>จำนวนเงินทั้งหมด (บาท) : {billboard.total_price}</p>
          </div>

          <div className='flex flex-col items-center mt-4'>
            <button className='mb-5 mt-2 px-3 py-4 rounded bg-curious-blue-500 text-white font-semibold text-xl' onClick={handleConfirmSurvey}>ยืนยันการสำรวจ</button>
            <button className='self-end mb-5 px-6 py-2 rounded bg-cruise-500 text-white font-semibold text=lg' onClick={handleAddSign}>เพิ่มป้าย</button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-5/6 shadow-lg">
              {isSuccess ? (
                <>
                  <i className="fa-solid fa-circle-check text-cruise-500 text-6xl mb-4 flex justify-center items-center"></i>
                  <p className="mb-2 text-2xl font-semibold flex justify-center items-center text-cruise-500">{popupMessage}</p>
                  <button
                    onClick={() => {
                      closeModal(); 
                      navigate('/home'); 
                    }}
                    className="w-full px-4 py-2 bg-none underline text-alto-700 rounded hover:bg-cruise-600"
                  >
                    กลับหน้าหลัก
                  </button>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-triangle-exclamation text-red-500 text-5xl mb-4 flex justify-center items-center"></i>
                  <p className="mb-4 text-lg font-semibold px-1 pl-2">{popupMessage}</p>
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    ปิด
                  </button>
                </>
              )}
              </div>
            </div>
          )}

          <div className=''>
          {formData.data_billboards.map((sign, index) => (
            <SignCard key={index} index={index} sign={sign} onRemove={() => removeSign(index)} onUpdate={(updatedSign) => updateSign(index, updatedSign)}/>
          ))}
          </div>

          {isAddSignModalOpen && (
            <Fromsurvey onClose={() => setIsAddSignModalOpen(false)} addSign={addSign}/>
          )}
        </div>
      ) : (
        <p>ไม่มีข้อมูลการ์ด</p>
      )}
    </div>
  );
};

export default CardDetailPage;
