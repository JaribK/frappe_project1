import React from 'react';

export default function CardSurvey({ landCode, ownerName, signCount,Lastupdate }) {
  const LastupDate = new Date(Lastupdate).toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    calendar: 'gregory'
});

  return (
    <div className="flex items-center bg-white rounded-2xl border-none p-2.5 my-4">
        <div className="text-sm font-prompt font-normal">
          <p>รหัสที่ดิน: {landCode}</p>
          <p>ชื่อเจ้าของกิจการ: {ownerName}</p>
          <p>จำนวนป้าย: {signCount}</p>
          <p>แก้ไขล่าสุดเมื่อ: {LastupDate}</p>
        </div>
    </div>
  );
}
