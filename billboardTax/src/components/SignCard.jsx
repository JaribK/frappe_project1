import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function SignCard() {
  const location = useLocation();
  const card = location.state?.card || {};
  const [signs, setSigns] = useState(card.signs || []);

  const handleDeleteCard = (index) => {
    const updatedSigns = signs.filter((_, i) => i !== index);
    setSigns(updatedSigns);
    console.log("deleted");
  };

  return (
    <div className='flex flex-col gap-2.5'>
      {signs.length > 0 ? (
        signs.map((sign, index) => (
          <div key={index} className='flex border border-gray-300 p-1 rounded-2xl bg-linen-50'>
            <div className='w-32 h-32 object-cover my-1 mx-2.5'>         
              <img src={sign.imageUrl} alt={`Sign ${index + 1}`} className='rounded-md' />
            </div> 
            <div className='flex-1 mt-4 text-sky-950'>
              <p><strong>ขนาด :</strong> {sign.size}</p>
              <p><strong>ประเภท :</strong> {sign.type}</p>
              <p><strong>ราคา :</strong> {sign.price}</p>
            </div>
            <div className='mt-1'>
              <i 
                className="fa-solid fa-trash-can pr-3 text-red-500 text-base hover:text-red-800"
                onClick={() => handleDeleteCard(index)} 
              ></i>
            </div>
          </div>
        ))
      ) : (
        <p></p> 
      )}
    </div>
  );
}
