import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fontsource/inter';
import '@fortawesome/fontawesome-free/css/all.min.css';
import PieChart from '../components/ChartSwitcher';
import Card from '../components/CardSurvey';
import axios from 'axios';
import { FrappeContext, useSWR } from 'frappe-react-sdk';

// !dropdown ทำแก้ 
// *placeholder="Search..."
// !dropdown ใส่ map
// !ใส่พิกัดในแผนที่

export default function Home() {

  // const {
  //   currentUser,
  //   isValidating,
  //   isLoading,
  //   login,
  //   logout,
  //   error,
  //   updateCurrentUser,
  //   getUserCookie,

  // } = useFrappeAuth()

  // const { call } = useContext(FrappeContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [showAllCards, setShowAllCards] = useState(false);
  const navigate = useNavigate();
  // const [selectedCard, setSelectedCard] = useState(null); 

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  useSWR()

  const cardData = {
    2024: [
      {
        id: 1, landCode: '001', owner_name: 'นาย A', signCount: 3,
        signs: [
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน',
            price: 10
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน',
            price: 120
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน',
            price: 140
          }
        ], position: {
          latitude: '13.7563',
          longitude: '100.5018'
        },
        status: 'change', paymentStatus: 'not_paid', Totel_Price: 1230
      },
      {
        id: 2, landCode: '002', owner_name: 'นาย B', signCount: 5,
        signs: [
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน',
            price: 120
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน',
            price: 10
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน',
            price: 143
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 140
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน',
            price: 140
          }
        ], position: {
          latitude: '13.7563',
          longitude: '100.5018'
        },
        status: 'cancel', paymentStatus: 'paid', Totel_Price: 1230
      },
      {
        id: 3, landCode: '003', owner_name: 'นาย C', signCount: 2,
        signs: [
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 110
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 140
          }
        ], position: {
          latitude: '13.7563',
          longitude: '100.5018'
        },
        status: '', paymentStatus: 'not_paid', Totel_Price: 123
      },
      {
        id: 6, landCode: '006', owner_name: 'นาย F', signCount: 4,
        signs: [
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 140
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 140
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*90',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 1402
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '58*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 240
          }
        ], position: {
          latitude: '13.7563',
          longitude: '100.5018'
        },
        status: 'change', paymentStatus: 'paid', Totel_Price: 1230
      },
    ],
    2023: [
      {
        id: 4, landCode: '004', owner_name: 'นาย D', signCount: 4,
        signs: [
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '90*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 1140
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 1140
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 1140
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '59*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 1140
          }
        ], position: {
          latitude: '13.7563',
          longitude: '100.5018'
        },
        status: '', paymentStatus: 'paid', Totel_Price: 120
      },
      {
        id: 7, landCode: '007', owner_name: 'นาย G', signCount: 6,
        signs: [
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 140
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 114
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 114
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 114
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 114
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 114
          }
        ], position: {
          latitude: '13.7563',
          longitude: '100.5018'
        },
        status: 'change', paymentStatus: 'not_paid', Totel_Price: 2230
      },
    ],
    2022: [
      {
        id: 5, landCode: '005', owner_name: 'นาย E', signCount: 1,
        signs: [
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 114
          }
        ],
        status: 'cancel', paymentStatus: 'paid', Totel_Price: 130
      },
      {
        id: 8, landCode: '008', owner_name: 'นาย H', signCount: 3,
        signs: [
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '20*70',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 114
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '20*39',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 114
          },
          {
            imageUrl: 'https://via.placeholder.com/150',
            size: '50*100',
            type: 'ป้ายที่มีอักษรไทยล้วน', price: 114
          }
        ], position: {
          latitude: '13.7563',
          longitude: '100.5018'
        },
        status: '', paymentStatus: 'not_paid', Totel_Price: 1230
      },
    ],
  };



  const sortedYears = cardData ? Object.keys(cardData).sort((a, b) => b - a) : [];
  const displayedYears = showAllCards ? sortedYears : sortedYears.slice(0, 1);

  const handleToggleShowAll = () => {
    setShowAllCards(prev => !prev);
  };

  const handleCardClick = (card) => {
    navigate(`/card-detail/${card.id}`, { state: { card } });
  };

  // const handleCloseModal = () => {
  //   setSelectedCard(null);
  // };


  return (
    <div className='bg-sky-200 '>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="relative m-8 pt-14 flex justify-center items-center">
        <select
          value={selectedValue}
          onChange={handleSelectChange}
          className='w-11/12 h-10 p-2 pr-9 border-none rounded-3xl text-sm bg-white appearance-none'
        >
          <option value="" disabled></option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <div className="absolute inset-y-0 top-14 right-6 flex items-center pointer-events-none">
          <i className="fas fa-chevron-down text-gray-400"></i>
        </div>
      </div>
      <PieChart />
      <div className='p-5 text-left text-sky-950'>
        <div
          className='underline text-xl font-prompt font-semibold text-sky-950'><p>ผลการสำรวจ</p></div>
        {displayedYears.map((year, index) => (
          <div key={year}>
            <h3 className='text-center font-semibold font-prompt'>ปี {year}</h3>
            <div>
              {cardData[year].slice(0, 3).map((card) => (
                <div key={card.id} onClick={() => handleCardClick(card)}>
                  <Card
                    landCode={card.landCode}
                    ownerName={card.owner_name}
                    signCount={card.signCount}
                  />
                </div>
              ))}
              {index < displayedYears.length - 1 && <hr className="divide-y border-gray-400 my-5" />}
            </div>
          </div>
        ))}
        {sortedYears.length > 2 && (
          <p onClick={handleToggleShowAll} className='underline text-center font-prompt font-semibold text-sky-950'>
            {showAllCards ? 'ปิด' : 'ดูเพิ่มเติม'}
          </p>
        )}
      </div>
    </div>
  )
}

function Navbar({ toggleSidebar }) {
  return (
    <nav className='bg-sky-800 h-14 fixed top-0 left-0 w-full z-50'>
      <i className="fas fa-bars flex text-left w-7 text-white text-2xl px-6 py-4 " onClick={toggleSidebar}></i>
    </nav>
  );
}

function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }

      await axios.get('http://localhost:8000/api/method/maechan.api.logout', {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      localStorage.removeItem('token');
      console.log('logout succeed')
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className={`fixed z-50 top-0 left-0 w-[250px] h-full bg-sky-800 text-white font-prompt font-bold overflow-hidden flex flex-col justify-between transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        <nav className='bg-sky-800 h-14'>
          <i className="fas fa-bars flex text-left w-7 text-white text-2xl px-6 py-4 " onClick={toggleSidebar}></i>
        </nav>
        <div className='flex items-center px-5 py-2.5 font-prompt font-bold border-t-2 ' onClick={() => handleNavigate('/home')}>
          <i className="fas fa-home mr-2.5" ></i>
          <p>หน้าแรก</p>
        </div>
        <div className='flex items-center px-5 py-2.5 font-prompt font-bold border-t-2 ' onClick={() => handleNavigate('/explore')}>
          <i className="fas fa-compass mr-2.5" ></i>
          <p>สำรวจ</p>
        </div>
        <div className='flex items-center px-5 py-2.5 font-prompt font-bold border-t-2 ' onClick={() => handleNavigate('/manual')}>
          <i className="fas fa-book-open mr-2.5" ></i>
          <p>คู่มือการใช้งาน</p>
        </div>
        <div className='flex items-center px-5 py-2.5 font-prompt font-bold border-y-2 ' onClick={() => handleNavigate('/help')}>
          <i className="fas fa-info-circle mr-2.5"></i>
          <p>ศูนย์ช่วยเหลือ</p>
        </div>
      </div>
      <div className='self-end m-5'>
        <i className="fas fa-sign-out-alt text-2xl" onClick={logout}></i>
      </div>
    </div>
  );
}