import React, { useState, useRef, useContext, useEffect } from 'react';
import { useLocation,  } from 'react-router-dom';
import { FrappeContext } from 'frappe-react-sdk';
import CameraPopup from './Camerapop';
import Select from 'react-select';
import sha1 from 'js-sha1';


export default function Fromsurvey({ onClose,addSign }) {
  const [selectedType, setSelectedType] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [image, setImage] = useState('');
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isCameraPopupOpen, setIsCameraPopupOpen] = useState(false);
  const location = useLocation();
  const billboard = location.state?.billboard; 
  const { call } = useContext(FrappeContext);

 
  const handleOpenCameraPopup = () => {
    setIsCameraPopupOpen(true);
  };

  const handleCloseCameraPopup = () => {
    setIsCameraPopupOpen(false);
  };

  const closeAddSignModal = () => {
    if (onClose) onClose(); 
  };

  const handleCapture = (image) => {
    setNewBillboard(prevData => ({
      ...prevData,
      picture: image,
    }));
    
    setIsCameraOn(false);
  };


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      
      const cloudName = 'dhtq4rtgu'; 
      const uploadPreset = 'forproject'; 
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Upload failed:', data);
          return;
        }
        
        console.log('Uploaded Image URL:', data.secure_url);
        setNewBillboard(prevData => ({
          ...prevData,
          picture: data.secure_url,
        }));
        
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else { 
      console.error('No file selected');
    }
  };
  

 const [dataBillboards, setDataBillboards] = useState(billboard.data_billboards || []);

  const [newBillboard, setNewBillboard] = useState({
    picture: '',
    width: '',
    height: '',
    price: '',
    type_of_billboards: '',
  });

  console.log(newBillboard)

  const handleSave = () => {
    setDataBillboards((prev) => {
      const updatedData = [...prev, newBillboard];
      const paymentStatus = newBillboard.payment_status || '';
      const billboardStatus = newBillboard.payment_status || '';
      const updatedBillboard = {
        ...billboard, 
        payment_status: paymentStatus,
        billboard_status : billboardStatus,
        data_billboards: [...dataBillboards, 
          {
          ...newBillboard,
        }],
      };
  
      console.log('Updated Billboard:', updatedBillboard);
      // console.log('Payment Status:', newBillboard.payment_status);

      for (const key in updatedBillboard) {
        if (updatedBillboard[key] === undefined || updatedBillboard[key] === null) {
          console.error(`Field ${key} is not valid:`, updatedBillboard[key]);
          return; 
        }
      }
      // call.put('maechan.api.update_billboard_document', {
      //   name: billboard.name,
      //   data: updatedBillboard
      // })
      // .then(response => {
      //   console.log('Data saved successfully:', response);
      //   closeAddSignModal();
      // })
      // .catch(error => {
      //   console.error('Error saving data:', error.response ? error.response.data : error.message);
        
      //   if (error.response && error.response.data.message.includes("Document has been modified")) {
      //     alert("เอกสารนี้ถูกแก้ไขโดยผู้ใช้อื่น กรุณารีเฟรชหน้าเพื่อตรวจสอบข้อมูลล่าสุด");
      //   }
      // });
      return updatedData;
    });
    if (newBillboard.picture || newBillboard.width || newBillboard.height) {
      addSign(newBillboard); 
    }
  
    setNewBillboard({
      picture: '',
      width: '',
      height: '',
      type_of_billboards: '',
    });
    onClose()

  };

  
  const  handleChange = (name, value, ) => {
    console.log(`Updating: ${name}, Value: ${value}, `); 
    setNewBillboard(prev => ({ ...prev, [name]: value }));
 };
  
 const calculatePrice = () => {
  const { width, height } = newBillboard;
  return (width && height) ? ((width * height / 500) * 3).toFixed(2) : '0.00';
};

useEffect(() => {
  setNewBillboard(prevState => ({
      ...prevState,
      price: calculatePrice()
  }));
}, [newBillboard.width, newBillboard.height]);

   const options = [
    { value: 'ป้ายอักษรไทยล้วน', label: 'ป้ายอักษรไทยล้วน' },
    { value: 'ป้ายอักษรไทย,อังกฤษ,ปนภาพ,เครื่องหมาย', label: 'ป้ายอักษรไทย,อังกฤษ,ปนภาพ,เครื่องหมาย' },
    { value: 'ป้ายไม่มีอักษรไทย', label: 'ป้ายไม่มีอักษรไทย' },
    { value: 'ป้ายที่แก้ไข ข้อความ,รูป,เครื่องหมาย(จ่ายแล้ว)', label: 'ป้ายที่แก้ไข ข้อความ,รูป,เครื่องหมาย(จ่ายแล้ว)' },
  ];


  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50  '>
      <div className='bg-cruise-500 text-white p-8 m-4 font-medium  rounded-xl shadow-md w-11/12 max-w-full'>
        
        <p className='my-2'>ประเภทป้ายภาษี</p>
        <div  className='text-md'>
        <Select
          options={options}
          value={options.find(option => option.value === selectedType)}
          name="type_of_billboards"
          onChange={(selectedOption) => handleChange('type_of_billboards',selectedOption.value)}          
          className='text-curious-blue-800'
          placeholder="-- โปรดเลือกประเภทป้าย --"
        />
        </div>
        
      
        <div className="grid grid-cols-2 gap-6 my-2">
          <div className='flex flex-col'>
            <p className='mb-1'>กว้าง (ตร.ซม.)</p>
            <input 
              type="text" 
              value={newBillboard.width} 
              onChange={(e) => handleChange('width',e.target.value)}
              name='width'
              className='px-2 border rounded-md text-curious-blue-800'
            />
          </div>

          <div className='flex flex-col'>
            <p className='mb-1'>ยาว (ตร.ซม.)</p>
            <input 
              type="text" 
              onChange={(e) => handleChange('height',e.target.value)}
              value={newBillboard.height}
              className='px-2 border rounded-md text-curious-blue-800'
            />
          </div>
        </div>
        <div>
          <p>รูปภาพ</p>
          <div className='flex justify-center items-center my-4'>
          <div className='grid grid-cols-2 gap-2 mx-4 my-2 h-40'>
            <div className="flex justify-center items-center aspect-w-1 aspect-h-1 h-10/12 w-36 border-2 border-gray-300 bg-gray-300 rounded-md  overflow-hidden">
              {image ? (
                <img className='w-full h-full object-cover' src={image} alt="Selected" />
              ) : (
                <i className="fa-solid fa-plus text-red-600 text-2xl border-2 border-dashed border-gray-400 p-8"></i>
              )}
            </div>
            <div className="flex flex-col justify-end">
                <>
                  <button onClick={handleOpenCameraPopup} className='px-4 py-2 m-2.5 mt-0 bg-alto-200 text-black rounded '>เปิดกล้อง</button>
                  <CameraPopup isOpen={isCameraPopupOpen} onClose={handleCloseCameraPopup} onCapture={handleCapture} />
                  <button className='px-4 py-2 m-2.5 mt-0 bg-alto-200 text-black rounded' onClick={() => fileInputRef.current.click()}>แนบไฟล์</button>
                  <input 
                    className='mb-2.5 '
                    type="file"
                    name='picture' 
                    ref={fileInputRef} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={(e) => handleFileChange(e)}
                  />
                </>
              
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          </div>
          </div>
        </div>
          <div className='flex items-center justify-center  mt-5 space-x-6'>
            <button className='rounded-md bg-alto-200 w-20 text-black' onClick={closeAddSignModal}>ยกเลิก</button>
            <button className='rounded-md bg-alto-200 w-20 text-black' onClick={handleSave}>บันทึก</button>
          </div>
      </div>
    </div>
  );
}