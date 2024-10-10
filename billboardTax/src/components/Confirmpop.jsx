import React from 'react';

const ConfirmPopup = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white p-5 rounded-lg text-center relative font-medium">
        <p>คุณแน่ใจว่าต้องการออกจากหน้านี้?</p>
        <button onClick={onConfirm} className='m-2 mt-3 py-2 px-5 bg-blue-500 text-white rounded hover:bg-blue-700'>ใช่</button>
        <button onClick={onCancel} className='m-2 mt-3 py-2 px-5 bg-blue-500 text-white rounded hover:bg-blue-700'>ไม่</button>
      </div>
    </div>
  );
};

export default ConfirmPopup;
