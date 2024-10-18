import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { FrappeContext } from 'frappe-react-sdk';


ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend,Title); 

const Chartall = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartType, ] = useState('bar'); 
  const location = useLocation();
  const billboard = location.state?.billboard; 
  const { call } = useContext(FrappeContext);
  const [loading, setLoading] = useState(false);
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
       
        const filteredData = Response.message.filter(item => {
          const itemYear = new Date(item.modified_date).getFullYear();
          return itemYear === thisyear;
        });
  
        setDataNew(filteredData);

        const landidCountByMoo = {};
        

        const year = new Date(Response.message[0].modified_date).getFullYear();
        console.log('year', year)

        filteredData.forEach((item) => {
          console.log('item:', item);
          console.log('landid:', item.land_id);

          if (!landidCountByMoo[item.moo]) {
            landidCountByMoo[item.moo] = {};
          }
          if (!landidCountByMoo[item.moo][item.land_id]) {
            landidCountByMoo[item.moo][item.land_id] = 0;
          }
          landidCountByMoo[item.moo][item.land_id] += 1;
        });      
        
        console.log('landidCountByMoo :',landidCountByMoo)

        const labels = Object.keys(landidCountByMoo);
        const data = labels.map(moo => {
          const counts = Object.values(landidCountByMoo[moo]);
          return counts.reduce((sum, count) => sum + count, 0); 
        });

        const datasets = [{
          label: 'จำนวนผลการสำรวจ',
          data: data,
          backgroundColor: [
            'rgba(246, 213, 218, 0.2)',
            'rgba(246, 176, 123, 0.2)',
            'rgba(186, 228, 231, 0.2)',
            'rgba(75, 188, 157, 0.2)',
            'rgba(147, 196, 230, 0.2)',
            'rgba(252, 229, 139, 0.2)',
            'rgba(217, 206, 255, 0.2)',
          ].slice(0, data.length),
          borderColor: [
            'rgba(246, 213, 218, 1)',
            'rgba(246, 176, 123, 1)',
            'rgba(186, 228, 231, 1)',
            'rgba(75, 188, 157, 1)',
            'rgba(147, 196, 230, 1)',
            'rgba(252, 229, 139, 1)',
            'rgba(217, 206, 255, 1)'
          ].slice(0, data.length),
          borderWidth: 1,
        }]; 
      
          setChartData({
            labels: labels,
            datasets: datasets,
          });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [chartType]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true, 
        text: `ผลการสำรวจ ปี ${new Date().getFullYear()}`,
        font: {
          size: 18,
          family: 'prompt',
        },
        color: '#1d4b6f',
        padding: {
          top: 10,
          bottom: 30, 
        },
      },
      legend: {
        position: 'top',
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = Math.round(tooltipItem.raw);
            return `ผลการสำรวจ: ${value} ครั้ง`;
          },
        },
      },
    },
  };
  console.log('chartData:', chartData);
  console.log('datasets:', chartData.datasets);

  // const toggleChartType = () => {
  //   setChartType(prevType => (prevType === 'bar' ? 'pie' : 'bar'));
  // };

  return (
    <div className="flex flex-col items-center p-5">
      <div className="w-full max-w-[800px] h-[500px] border-2 border-gray-300 bg-gray-50 p-5 mb-5 rounded-lg box-border ">
        {chartType === 'bar' ? (
          <Pie data={chartData} options={options} />
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
