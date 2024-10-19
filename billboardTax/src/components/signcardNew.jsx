import React from 'react'

export default function SigncardNew({ sign,onRemove  }) {
  return (
    <div className='flex border border-gray-300 p-1 rounded-2xl bg-linen-50 my-2 mb-4'>
    <div className='w-32 h-32 object-cover my-1 mx-2.5'>
      <img
        src={sign.picture}
        alt={`Sign`}
        className='rounded-md w-full h-full object-cover'
      />
    </div>
    <div className='flex-1 mt-4 text-sky-950 mr-1'>
      <p>
        <strong>ขนาด :</strong> {sign.width * sign.height}  ตร.ซม.
      </p>
      <p>
        <strong>ประเภท :</strong> {sign.type_of_billboards}
      </p>
      <p>
        <strong>ราคา :</strong> {sign.price} บาท
      </p>
    </div>
    <div className='mt-1'>
      <i
        className='fa-solid fa-trash-can pr-3 text-red-500 text-base hover:text-red-800'
        onClick={onRemove}
      ></i>
    </div>
  </div>
  )
}
