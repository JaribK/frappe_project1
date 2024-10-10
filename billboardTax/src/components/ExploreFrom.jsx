import React, { useState, useEffect,useContext  } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SignCardNew  from './signcardNew';
import Fromsurveynew from './Fromsurveynew';
import ConfirmPopup from './Confirmpop';
import { useFrappeAuth,FrappeContext } from 'frappe-react-sdk';


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
  const [billboard , setBillboard] = useState()
  const location = useLocation();
  //const {Totleprice} = location.state?.billboard;
  const { landNumber } = location.state || { landNumber: '' };
  const { currentUser } = useFrappeAuth();
  const [ownerName,setOwnerName] = useState('')
  const [signs, setSigns] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { call } = useContext(FrappeContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  console.log(currentUser)
  console.log(landNumber)
  console.log(selectedPaymentStatus)
  console.log(idCardNumber)
  
  const data = {
    land_id: landNumber,
    owner_cid: idCardNumber,
    owner_name: ownerName, 
    no_receipt: receiptNumber,
    research_by: currentUser, 
    payment_status: selectedPaymentStatus,
    billboard_status: selectedStatus,
    data_billboards: signs
  };
  console.log(data)
  console.log(signs)

  const calculateTotalPrice = () => {
    const total = signs.reduce((acc, sign) => acc + (parseFloat(sign.price) || 0), 0); 
    setTotalPrice(Number(total).toFixed(2));
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [signs]);

  //   const fetchData = () => {
  //     setLoading(true);
  //     call.get("maechan.api.get_billboard_documents", {
  //       name : name
  //     }) .then(response => {
  //       console.log("Fetched Data:", response.data);
  //       setBillboard(response.data);
  //       setLoading(false); 
  //     })
  //     .catch(error => {
  //       console.error("Error fetching billboard documents:", error);
  //       setLoading(false); 
  //     });
  //   };
  
  

  const closeCancelPopup = () => setIsCancelPopupOpen(false);

  const handlePaymentStatusChange = (status) => {
    setSelectedPaymentStatus(status);
  };

  const onClose = () => {
    setIsConfirmPopupOpen(true);
  };
  const handleConfirmClose = () => {
    setIsConfirmPopupOpen(false);
    navigate('/map');
  };

  const handleCancelClose = () => {
    setIsConfirmPopupOpen(false);
  };

  const addSign = (newSign) => {
    setSigns((prevSigns) => [...prevSigns, newSign]);
  };

  const handleAddSign = () => setIsAddSignModalOpen(true);

  
  const handleConfirmSurvey = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
    
    setLoading(true);
    const data = {
      land_id: landNumber,
      owner_cid: idCardNumber,
      owner_name: ownerName,
      no_receipt: receiptNumber,
      research_by: currentUser,
      payment_status: selectedPaymentStatus,
      billboard_status: selectedStatus,
      data_billboards: signs,
    };
    console.log("Data to be sent:", data);
  
    call.post("maechan.api.post_billboard_document", { data })
      .then(response => {
        setLoading(false);
        console.log("Response from API:", response); 
        if (response.data && response.data.message) {
          setShowPopup(true);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      })
      .catch(error => {
        console.error("Error creating billboard document:", error);
        setLoading(false);
      });
    console.log('post success');
  };
   
    useEffect(() => {
      if (landNumber && idCardNumber && receiptNumber && ownerName) {
        createRenew();
      }
    }, [landNumber, idCardNumber, receiptNumber, ownerName]);
    

  const removeSign = (index) => {
    setSigns((prevSigns) => prevSigns.filter((_, i) => i !== index));
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
            <div>
              <p>รหัสที่ดิน</p>
              {landNumber ? (
              <p className='mt-1 w-full h-8 text-gray-500 bg-seashell-peach-50 rounded-md px-2 py-1'>{landNumber}</p>
            ) : (
              <input 
              type="text" 
              value={landNumber} 
              className='mt-1 w-full h-8 text-gray-500 bg-seashell-peach-50 rounded-md px-2 py-1'
              />
            )}
              </div>
            <div className='mt-3'>
              <p>ชื่อเจ้าของกิจการ/บริษัท</p>
              <input type="text"
                value={ownerName} 
                onChange={(e) => setOwnerName(e.target.value)}
                className='h-8 w-full mt-1 text-gray-500 bg-seashell-peach-50 rounded-md px-2 py-1' 
              />
          </div>
                  
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
                className={`flex items-center px-4 py-2 rounded-full text-base  overflow-hidden 
                  ${selectedPaymentStatus === 'จ่ายแล้ว' ? '' : ''}`}
                onClick={() => handlePaymentStatusChange('จ่ายแล้ว')}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 
                  ${selectedPaymentStatus === 'จ่ายแล้ว' ? 'bg-blue-500' : 'bg-white'}`}></span>
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
          
          {/* <div className='mt-3 inline-flex'>
            <p>จำนวนป้าย : </p>
            <input type="text" className='bg-inherit border-b ml-2  border-curious-blue-950 focus:border-curious-blue-700 outline-none'/>
          </div> */}

          <div className='mt-3 inline-flex text-sm'>
            <p>จำนวนเงินทั้งหมด (บาท) :</p>
            {/* <input type="text" className='bg-inherit border-b ml-1  border-curious-blue-700 focus:border-curious-blue-700 outline-none'/> */}
            <p className='bg-inherit  ml-1  '>{totalPrice.toLocaleString()}</p>
          </div>

          <div className='flex flex-col items-center mt-4'>
            <button className='my-5 px-3 py-4 rounded bg-curious-blue-500 text-white font-semibold text-xl' onClick={handleConfirmSurvey}>ยืนยันการสำรวจ</button>
            <button className='self-end  px-6 py-2 rounded bg-cruise-500 text-white font-semibold text=lg' onClick={handleAddSign}>เพิ่มป้าย</button>
          </div>

          <div className=''>
          {signs.map((sign, index) => (
            <SignCardNew  key={index} sign={sign} onRemove={() => removeSign(index)}/> 
          ))}
          </div>

          {isAddSignModalOpen && (
            <Fromsurveynew onClose={() => setIsAddSignModalOpen(false)} addSign={addSign}/>
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
