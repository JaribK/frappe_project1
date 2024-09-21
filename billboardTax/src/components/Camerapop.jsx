// CameraPopup.js
import React, { useState, useRef, useEffect } from 'react';

const CameraPopup = ({ isOpen, onClose }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  //commment
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white p-5 rounded-lg w-4/5 max-w-[600px] relative">
        <button className="absolute top-2.5 right-2.5 text-red-500 text-2xl bg-transparent border-none " onClick={onClose}>×</button>
        <div className="flex justify-center items-center w-full h-[200px] border-2 border-dashed border-gray-400 rounded-sm mb-5 mt-1.5">
          {image ? (
            <img src={image} alt="Captured" />
          ) : (
            <video ref={videoRef} autoPlay></video>
          )}
        </div>
        <div className="flex flex-col items-center">
          {isCameraOn ? (
            <>
              <button class="m-1 bg-alto-200 p-1.5 rounded-md text-curious-blue-950" onClick={handleCapture}>จับภาพ</button>
              <button class="m-1 bg-alto-200 p-1.5 rounded-md text-curious-blue-950" onClick={() => setIsCameraOn(false)}>ปิดกล้อง</button>
            </>
          ) : (
            <>
              <button class="m-1 bg-alto-200 p-1.5 rounded-md text-curious-blue-950" onClick={() => setIsCameraOn(true)}>เปิดกล้อง</button>
            </>
          )}
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
    </div>
  );
};

export default CameraPopup;
