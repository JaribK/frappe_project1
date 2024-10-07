import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend); // ลงทะเบียนประเภทกราฟที่ใช้

const Chart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartType, ] = useState('bar'); // สถานะสำหรับเลือกประเภทของกราฟ, ค่าเริ่มต้นเป็น 'bar'
  const location = useLocation();
  const billboard = location.state?.billboard; 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [
          { month: 'หมู่ 1', salesA: 23, salesB: 30 },
          { month: 'หมู่ 2', salesA: 53, salesB: 40 },
          { month: 'หมู่ 3', salesA: 85, salesB: 70 },
          { month: 'หมู่ 4', salesA: 41, salesB: 60 },
          { month: 'หมู่ 5', salesA: 44, salesB: 50 },
          { month: 'หมู่ 6', salesA: 65, salesB: 80 },
          { month: 'หมู่ 7', salesA: 56, salesB: 90 },
        ];
        const labels = data.map(item => item.month);
        const salesData = data.map(item => item.sales);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'ผลการสำรวจ A',
              data: data.map(item => item.salesA),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'ผลการสำรวจ B',
              data: data.map(item => item.salesB),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [chartType]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `ผลการสำรวจ: ${tooltipItem.raw}`;
          },
        },
      },
    },
    ...(chartType === 'bar' && {
      scales: {
        x: {
          title: {
            display: true,
            text: 'หมู่',
          },
        },
        y: {
          title: {
            display: true,
            text: 'ผลการสำรวจ',
          },
        },
      },
    }),
  }), [chartType]);

  // const toggleChartType = () => {
  //   setChartType(prevType => (prevType === 'bar' ? 'pie' : 'bar'));
  // };

  return (
    <div className="flex flex-col items-center p-5">
      <div className="w-full max-w-[800px] h-[500px] border-2 border-gray-300 bg-gray-50 p-5 mb-5 rounded-lg box-border ">
        {chartType === 'bar' ? (
          <Bar data={chartData} options={options} />
        ) : (null)}
      </div>
      {/* <div className="button-container">
        <button onClick={toggleChartType} className="toggle-button">
          {chartType === 'bar' ? 'แสดงกราฟวงกลม' : 'แสดงกราฟแท่ง'}
        </button>
      </div> */}
    </div>
  );
};

export default Chart;
