import React, { useState, useEffect, useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend); // ลงทะเบียนประเภทกราฟที่ใช้

const ChartSwitcher = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartType, ] = useState('bar'); // สถานะสำหรับเลือกประเภทของกราฟ, ค่าเริ่มต้นเป็น 'bar'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [
          { month: 'มกราคม', sales: 23 },
          { month: 'กุมภาพันธ์', sales: 53 },
          { month: 'มีนาคม', sales: 85 },
          { month: 'เมษายน', sales: 41 },
          { month: 'พฤษภาคม', sales: 44 },
          { month: 'มิถุนายน', sales: 65 },
          { month: 'กรกฎาคม', sales: 56 }
        ];
        const labels = data.map(item => item.month);
        const salesData = data.map(item => item.sales);

        setChartData({
          labels: labels,
          datasets: [{
            label: 'ยอดขาย',
            data: salesData,
            backgroundColor: chartType === 'bar'
              ? 'rgba(75, 192, 192, 0.2)'
              : [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(199, 199, 199, 0.2)',
              ],
            borderColor: chartType === 'bar'
              ? 'rgba(75, 192, 192, 1)'
              : [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)',
              ],
            borderWidth: 1,
          }],
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
            return `ยอดขาย: ${tooltipItem.raw}`;
          },
        },
      },
    },
    ...(chartType === 'bar' && {
      scales: {
        x: {
          title: {
            display: true,
            text: 'เดือน',
          },
        },
        y: {
          title: {
            display: true,
            text: 'ยอดขาย',
          },
        },
      },
    }),
    ...(chartType === 'pie' && {
      elements: {
        arc: {
          borderWidth: 1,
        },
      },
      cutout: 0,
      responsive: true, 
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `ยอดขาย: ${tooltipItem.raw}`;
            },
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
        ) : (
          <Pie data={chartData} options={options} />
        )}
      </div>
      {/* <div className="button-container">
        <button onClick={toggleChartType} className="toggle-button">
          {chartType === 'bar' ? 'แสดงกราฟวงกลม' : 'แสดงกราฟแท่ง'}
        </button>
      </div> */}
    </div>
  );
};

export default ChartSwitcher;
