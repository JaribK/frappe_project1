import React, { useState, useRef, useEffect } from 'react';
import CameraPopup from './Camerapop';

export default function Fromsurvey({ onClose }) {
  const [selectedType, setSelectedType] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isCameraPopupOpen, setIsCameraPopupOpen] = useState(false);

  const handleOpenCameraPopup = () => {
    setIsCameraPopupOpen(true);
  };

  const handleCloseCameraPopup = () => {
    setIsCameraPopupOpen(false);
  };

  const closeAddSignModal = () => {
    if (onClose) onClose(); 
  };

  const handleTypeChange = (event) => setSelectedType(event.target.value);

  useEffect(() => {
    if (isCameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Error accessing camera: ", err));
    } else {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    }
  }, [isCameraOn]);

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL('image/png'));
    setIsCameraOn(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log('Save clicked');
    closeAddSignModal();
  };

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50  '>
      <div className='bg-cruise-500 text-white p-8 m-4 font-medium  rounded-xl shadow-md w-11/12 max-w-full'>
        <p className='my-2'>ประเภทป้ายภาษี</p>
        <div >
          <select
            className='rounded-md h-7 w-full text-sky-800  focus:outline-none  ' 
            value={selectedType} 
            onChange={handleTypeChange}
          >
            <option value="" disabled></option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-6 my-2">
          <div className='flex flex-col'>
            <p className='mb-1'>กว้าง (ตร.ซม.)</p>
            <input type="text" className='border rounded-md'/>
          </div>
          <div className='flex flex-col'>
          <p className='mb-1'>ยาว (ตร.ซม.)</p>
          <input type="text" className='border rounded-md'/>
          </div>
        </div>
        <div>
          <p>รูปภาพ</p>
          <div className='grid grid-cols-2 gap-2 mx-4 my-2'>
            <div className="flex justify-center items-center h-36 w-36 border-2 border-gray-300 bg-gray-300 rounded-md">
              {image ? (
                <img className='max-w-full max-h-full object-cover  ' src={image} alt="Selected" />
              ) : (
                <i className="fa-solid fa-plus text-red-600 text-2xl border-2 border-dashed border-gray-400 p-8"></i>
              )}
            </div>
            <div className="flex flex-col justify-end">
              {isCameraOn ? (
                <>
                  <video ref={videoRef} autoPlay></video>
                  <button onClick={handleCapture}>จับภาพ</button>
                  <button onClick={() => setIsCameraOn(false)}>ปิดกล้อง</button>
                </>
              ) : (
                <>
                  <button onClick={handleOpenCameraPopup} className='px-4 py-2 m-2.5 mt-0 bg-alto-200 text-black rounded '>เปิดกล้อง</button>
                  <CameraPopup isOpen={isCameraPopupOpen} onClose={handleCloseCameraPopup} />
                  <button className='px-4 py-2 m-2.5 mt-0 bg-alto-200 text-black rounded' onClick={() => fileInputRef.current.click()}>แนบไฟล์</button>
                  <input 
                    className='mb-2.5 '
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                  />
                </>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          </div>
          <div className='flex items-center justify-center  mt-5 space-x-6'>
            <button className='rounded-md bg-alto-200 w-20 text-black' onClick={closeAddSignModal}>ยกเลิก</button>
            <button className='rounded-md bg-alto-200 w-20 text-black' onClick={handleSave}>บันทีก</button>
          </div>
        </div>
      </div>
    </div>
  );
}
