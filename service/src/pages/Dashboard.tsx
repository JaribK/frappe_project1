function Dashboard() {
    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-xl font-bold">ยินดีต้อนรับสู่ระบบริการประชาชน</h1>


            <h1 className="font-bold">การใช้งานเบื้องต้น</h1>
            <ol className="list-decimal ml-6">
                <li>กรอกข้อมูล ในเมนูข้อมูลส่วนตัว</li>
                <li>เพิ่มกิจการ ในเมนูกิจการของท่าน</li>
                <li>สร้างคำร้องใบอนุญาต ในเมนูคำร้องขอใบอนุญาต</li>
                <li>ใบอนุญาตที่ท่านได้รับ อยู่ในเมนูใบอนุญาต</li>
            </ol>

        </div>

    )
}

export default Dashboard