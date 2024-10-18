import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { FrappeContext } from 'frappe-react-sdk';


ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend); // ลงทะเบียนประเภทกราฟที่ใช้

const Chartall = ({ selectedMoo }) => {
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
        
        console.log('this year', thisyear)
        
        console.log('re', Response.message)
       
        setDataNew(Response.message);

        const landidCountByMoo = {};
        

        const year = new Date(Response.message[0].modified_date).getFullYear();
        console.log('year', year)

        Response.message.forEach((item) => {
            if (!landidCountByMoo[item.moo]) {
              landidCountByMoo[item.moo] = {}; 
            }
            if (!landidCountByMoo[item.moo][item.landid]) {
              landidCountByMoo[item.moo][item.landid] = 0; 
            }
            landidCountByMoo[item.moo][item.landid] += 1; 
        });      
        
        

        const labels = Object.keys(landidCountByMoo);

        const datasets = labels.map((moo) => ({
            label: `หมู่ ${moo}`,
            data: Object.values(landidCountByMoo[moo]), 
            backgroundColor: 'rgba(75, 192, 192, 0.2)', 
            borderColor: 'rgba(75, 192, 192, 1)', 
            borderWidth: 1,
            barThickness: 50,
          }));
      
          setChartData({
            labels: Object.keys(landidCountByMoo),
            datasets: datasets,
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

export default Chartall;
