import React from 'react';

const Modal = ({ card, onClose }) => {
  if (!card) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <button onClick={onClose} className='modal-close-button'>×</button>
        <h2>รายละเอียดการ์ด</h2>
        <p><strong>รหัสที่ดิน:</strong> {card.landCode}</p>
        <p><strong>ชื่อเจ้าของ:</strong> {card.ownerName}</p>
        <p><strong>จำนวนลายเซ็น:</strong> {card.signCount}</p>
      </div>
    </div>
  );
};

export default Modal;
