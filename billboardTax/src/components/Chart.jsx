import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { FrappeContext } from 'frappe-react-sdk';


ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend); // ลงทะเบียนประเภทกราฟที่ใช้

const Chart = ({ selectedMoo }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartType, ] = useState('bar'); 
  const location = useLocation();
  const billboard = location.state?.billboard; 
  const { call } = useContext(FrappeContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataOld, setDataOld] = useState([]);
  const [dataNew, setDataNew] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const Response = await call.get("maechan.api.get_all_billboard_documents");
        const date = new Date()
        const thisyear = date.getFullYear()
        const oldyear = date.getFullYear()-1
        console.log('this year', thisyear)
        console.log('last year', oldyear)
        console.log('re', Response.message)
        setDataOld(Response.message);
        setDataNew(Response.message);

        const landidCountOld = {};
        const landidCountNew = {};

        const year = new Date(Response.message[0].modified_date).getFullYear()
        console.log('year', year)
        Response.message.forEach((item) => {
          const itemYear = new Date(item.modified_date).getFullYear(); // Move year check inside the loop
          if (selectedMoo && item.moo === selectedMoo) {
            if (itemYear === oldyear) {
              if (!landidCountOld[item.landid]) {
                landidCountOld[item.landid] = 0;
              }
              landidCountOld[item.landid] += 1;
            }
          }
        });
        Response.message.forEach((item) => {
          const itemYear = new Date(item.modified_date).getFullYear(); // Move year check inside the loop
          if (selectedMoo && item.moo === selectedMoo) {
            if (itemYear === thisyear) {
              if (!landidCountNew[item.landid]) {
                landidCountNew[item.landid] = 0;
              }
              landidCountNew[item.landid] += 1;
            }
          }
        });
        console.log(landidCountOld)
        console.log('new',landidCountNew)

        const labels = [selectedMoo];

        setChartData({
          labels: labels,
          datasets: [
            {
              label: oldyear,
              data: Object.values(landidCountOld),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              barThickness: 70,
            },
            {
              label: year,
              data: Object.values(landidCountNew),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              barThickness: 70,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [chartType,selectedMoo]);

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
            const value =  Math.round(tooltipItem.raw);
            return `ผลการสำรวจ: ${value} ครั้ง`;
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
          ticks: {
            beginAtZero: true,
            precision: 0, 
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
      <div className="w-full max-w-[800px] h-[500px] border-2 border-gray-300 bg-linen-50 p-5 mb-5 rounded-lg box-border ">
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
