import React, { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SignCard({sign, onRemove, onUpdate,index}) {
 const [localSign, setLocalSign] = useState(sign);

 const handleDeleteCard = () => {
  onRemove(); 
};

const handleUpdate = (newData) => {
  setLocalSign(newData); 
  onUpdate(newData); 
};

  return (
    <div className='flex flex-col gap-2.5'>

          <div key={index} className='flex border border-gray-300 p-1 rounded-2xl bg-linen-50 my-2 mb-4'>
            <div className='w-32 h-32 object-cover my-1 mx-2.5'>         
              <img src={sign.picture} alt={`Sign ${index + 1}`} className='rounded-md w-full h-full object-cover' />
            </div> 
            <div className='flex-1 mt-4 text-sky-950 mr-1 '>
              <p><strong>ขนาด :</strong> {localSign.width * localSign.height}</p>
              <p><strong>ประเภท :</strong> {localSign.type_of_billboards}</p>
              <p><strong>ราคา :</strong> {localSign.price}</p>
            </div>
            <div className='mt-1'>
              <i 
                className="fa-solid fa-trash-can pr-3 text-red-500 text-base hover:text-red-800"
                onClick={handleDeleteCard} 
              ></i>
            </div>
          </div>
    
    </div>
  );
}
