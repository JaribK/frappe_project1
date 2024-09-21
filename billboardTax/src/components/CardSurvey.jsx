import React from 'react';

export default function CardSurvey({ landCode, ownerName, signCount }) {
  return (
    <div className="flex items-center bg-white rounded-2xl border-none p-2.5 my-4">
        <div className="text-sm font-prompt font-normal">
          <p>รหัสที่ดิน: {landCode}</p>
          <p>ชื่อเจ้าของกิจการ: {ownerName}</p>
          <p>จำนวนป้าย: {signCount}</p>
        </div>
    </div>
  );
}
