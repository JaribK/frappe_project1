// CameraPopup.js
import React, { useState, useRef, useEffect } from 'react';

const CameraPopup = ({ isOpen, onClose, onCapture  }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  //!!จับกับปิดไม่ได้
  //!!ปรับขนาด จอรูป

  useEffect(() => {
    if (isOpen) {
      setIsCameraOn(true); 
      console.log('setIsCameraOn(true)')
    }
  }, [isOpen]);

  useEffect(() => {
    let stream;
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
        videoRef.current.srcObject = null; 
      }
    }
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isCameraOn]);

  const handleCapture = () => {
    console.log('ok')
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL('image/png'));
    setIsCameraOn(false);
  };
  
  const uploadImageToCloudinary = async (imageData) => {
    const cloudName = 'dhtq4rtgu'; 
    const uploadPreset = 'forproject'; 
  
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: new URLSearchParams({
        file: imageData,
        upload_preset: uploadPreset,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
  
    const data = await response.json();
    return data.secure_url; 
  };
  

  const handleUseImage = async () => {
    if (image) {
      try {
        const uploadedImageUrl = await uploadImageToCloudinary(image);
        console.log('Uploaded Image URL:', uploadedImageUrl);
        onCapture(uploadedImageUrl); 
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    onClose(); 
  };
  

  const handleRetake = () => {
    setImage(null); 
    setIsCameraOn(true); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white p-6 rounded-lg w-4/5 max-w-[600px] relative">
        <button className="absolute top-2.5 right-2.5 text-red-500 text-xl bg-transparent border-none " onClick={onClose}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </button>
        <div className="flex  justify-center items-center w-full h-[200px] border-2 border-dashed border-gray-400 rounded-sm mb-5 mt-1.5">
          {image ? (
            <img src={image} alt="Captured" className='w-full h-full object-cover'/>
          ) : (
            <video ref={videoRef} autoPlay className='w-full h-full object-cover'></video>
          )}
        </div>
        <div className="flex flex-col items-center">
          {isCameraOn ? (
            <div>
              <button className="m-1 bg-alto-200 p-1.5 rounded-md text-curious-blue-950" onClick={handleCapture}>จับภาพ</button>
            </div>
          ) : image ? (
            <div>
              <button className="m-1 bg-alto-200 p-1.5 rounded-md text-curious-blue-950" onClick={handleUseImage}>ใช้ภาพนี้</button>
              <button className="m-1 bg-alto-200 p-1.5 rounded-md text-curious-blue-950" onClick={handleRetake}>ถ่ายใหม่</button>
            </div>
          ) : (
            <div>
              <button className="m-1 bg-alto-200 p-1.5 rounded-md text-curious-blue-950" onClick={handleCapture}>จับภาพ</button>
            </div>
          )
        }
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
    </div>
  );
};

export default CameraPopup;
