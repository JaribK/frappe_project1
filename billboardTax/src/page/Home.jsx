import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fontsource/inter';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Chart from '../components/Chart';
import Card from '../components/CardSurvey';
import axios from 'axios';
import { FrappeContext, useSWR } from 'frappe-react-sdk';
import { useFrappeAuth } from 'frappe-react-sdk'
import Select from 'react-select';
import Chartall from '../components/Chartall';
import Navbar from '../components/Navbar';
import Manu from '../components/Manu';

// !dropdown ทำแก้ 
// *placeholder="Search..."
// !dropdown ใส่ map
// !ใส่พิกัดในแผนที่
// !แก้ปี
// !นับจน.ป้ายเอง
// !totolpice ยังใช้ไม่ได้
// *get success



export default function Home() {
  const { call } = useContext(FrappeContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMoo, setSelectedMoo] = useState(null);
  const [showAllCards, setShowAllCards] = useState(false);
  const [billboards, setBillboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [oldBillboards,setOldBillboards] = useState([])

  // const [selectedCard, setSelectedCard] = useState(null); 

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      console.log("Selected Option:", selectedOption);
        setSelectedMoo(selectedOption.value); 
        console.log("Selected Value:", selectedMoo); 
    } else {
        setSelectedMoo(null);
        console.error("Selected option is null/undefined");
    }
  };
  useEffect(() => {
    console.log("Updated selectedMoo:", selectedMoo);
  }, [selectedMoo]);

  //useSWR()

 useEffect(() => {
  const fetchData = () => {
    setLoading(true);
    //console.log('Loading state:', true);
    call.get("maechan.api.get_all_billboard_documents")
    .then(response => {
      setBillboards(response.message);  
      console.log(response.message)
      setLoading(false);  
    })
    .catch(err => {
      setError('Error fetching billboard data'); 
      if (err.response && err.response.data && err.response.data.message) {
        console.log(err.response.data.message);
      } else {
        console.log(err);
      }
      setLoading(false);  
    });
  };
    fetchData();
  }, [call]);

  
 useEffect(() => {
  const fetchData = () => {
    setLoading(true);
    //console.log('Loading state:', true);
    call.get("maechan.api.get_all_false_billboard_documents")
    .then(response => {
      setOldBillboards(response.message);  
      //console.log(response.message)
      setLoading(false);  
    })
    .catch(err => {
      setError('Error fetching billboard data'); 
      if (err.response && err.response.data && err.response.data.message) {
        console.log(err.response.data.message);
      } else {
        console.log(err);
      }
      setLoading(false);  
    });
  };
    fetchData();
  }, [call]);


  const handleToggleShowAll = (landCode) => {
    setShowAllCards((prev) => ({
      ...prev,
      [landCode]: !prev[landCode],
    }));
  };

  const handleCardClick = (billboard) => {
    console.log(billboard)
    console.log(billboard.name)
    const encodedName = encodeURIComponent(billboard.name);
    navigate(`/card-detail/${encodedName}`, { state: { billboard } });
  };


  const uniqueYears = [...new Set(billboards.map(billboard => new Date(billboard.modified_date).getFullYear()))];
  const sortedYears = uniqueYears.sort((a, b) => a - b);

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
        <i className="fa-solid fa-spinner animate-spin text-5xl mb-2"></i>
        <p className='text-center'>Loading...</p>
      </div>
    </div>
  );
  
  
  if (error) return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
        <i className="fa-solid fa-exclamation-triangle text-red-500 text-5xl mb-2"></i>
        <p className='text-center'>Error: {error.message}</p>
      </div>
    </div>
  );
  
  console.log('billboard',billboards)

 
  const displayedBillboard = billboards
    .filter(billboard => billboard.billboard_status !== 'ยกเลิกแล้ว' &&
      billboard.is_doctype_copy !== 'true'
    )
    .sort((a, b) => new Date(b.modified_date) - new Date(a.modified_date))


  const groupedBillboards = displayedBillboard.reduce((groups, billboard) => {
    const group = groups[billboard.moo] || [];
    group.push(billboard);
    groups[billboard.moo] = group;
    return groups;
  }, {});

  console.log('groupedBillboards',groupedBillboards)

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar toggleSidebar={toggleSidebar} />
    <div className="flex-grow overflow-auto">
        <>
        <Chartall/>

        <div className='p-5 text-left text-curious-blue-800 '>
          <div
            className='underline text-xl font-prompt font-semibold text-curious-blue-800'><p>ผลการสำรวจ</p></div>
            {sortedYears.map((year, index) => (
              <div key={year}>
                <h3 className='text-center font-semibold font-prompt'>ปี {year}</h3>
                <div className=''>
                {Object.entries(groupedBillboards).map(([landCode, billboards]) => (
                <div key={landCode}>
                <h3 className='font-semibold font-prompt'>หมู่ : {landCode}</h3>
                  {billboards
                  .filter(billboard => new Date(billboard.modified_date).getFullYear() === year)
                  .slice(0, showAllCards[landCode] ? billboards.length : 4)
                  .map(billboard => (
                      <div key={billboard.name} onClick={() => handleCardClick(billboard)}>
                      <div ></div>
                      <Card
                          landCode={billboard.land_id}
                          ownerName={billboard.owner_name}
                          signCount={billboard.data_billboards.length}
                          Lastupdate={billboard.modified_date}
                      />
                      </div>
                    ))}
                    {billboards.length > 4 && (
                      <p
                        onClick={() => handleToggleShowAll(landCode)}
                        className="underline text-center font-prompt font-semibold text-sky-950 cursor-pointer"
                      >
                        {showAllCards[landCode] ? 'ปิด' : 'ดูเพิ่มเติม'}
                      </p>
                    )}
                    </div>
                    ))}
                </div>
                {index < sortedYears.length - 1 && <hr className="divide-y border-gray-400 my-5" />}
            </div>
          ))}
          {sortedYears.length > 2 && (
            <p onClick={handleToggleShowAll} className='underline text-center font-prompt font-semibold text-sky-950'>
              {showAllCards ? 'ปิด' : 'ดูเพิ่มเติม'}
            </p>
          )}
        </div>
      </>
      </div>
      <Manu isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
    </div>
  )
}

// function Sidebar({ isSidebarOpen, toggleSidebar }) {
//   const navigate = useNavigate();
//     const {
//     currentUser,
//     isValidating,
//     isLoading,
//     login,
//     logout,
//     error,
//     updateCurrentUser,
//     getUserCookie,

//   } = useFrappeAuth()

//   const dologout = async () => {
//     try {
//       if (!currentUser) {
//         console.error('user not found');
//         return;
//       }
//       await logout();
//       console.log('logout succeed')
//       navigate('/');
//     } catch (error) {
//       console.error('Logout failed', error);
//     }
//   };

//   const handleNavigate = (path) => {
//     navigate(path);
//   };

//   return (
//       <div 
//         className={`fixed z-50 text-lg top-0 left-0 w-full h-full bg-gray-500 bg-opacity-80 text-white font-prompt font-bold overflow-hidden flex flex-col justify-between transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>    <div className='w-[250px] bg-sky-800 flex flex-col  h-full'
//         onClick={toggleSidebar}
//       >
//         <div className='w-[250px] bg-sky-800 flex flex-col h-full' onClick={(e) => e.stopPropagation()}>
//         <nav className='bg-sky-800 h-14'>
//           <i className="fas fa-bars flex text-left w-7 text-white text-2xl px-6 py-3 " onClick={toggleSidebar}></i>
//         </nav> 
//         <div className='flex items-center px-5 py-2.5 font-prompt font-bold border-t-2 ' onClick={() => handleNavigate('/home')}>
//           <i className="fas fa-home mr-2.5" ></i>
//           <p>หน้าแรก</p>
//         </div>
//         <div className='flex items-center px-5 py-2.5 font-prompt font-bold border-t-2 ' onClick={() => handleNavigate('/explore')}>
//           <i className="fas fa-compass mr-2.5" ></i>
//           <p>สำรวจ</p>
//         </div>
//         <div className='flex items-center px-5 py-2.5 font-prompt font-bold border-t-2 ' onClick={() => handleNavigate('/manual')}>
//           <i className="fas fa-book-open mr-2.5" ></i>
//           <p>คู่มือการใช้งาน</p>
//         </div>
//         <div className='flex items-center px-5 py-2.5 font-prompt font-bold border-y-2 ' onClick={() => handleNavigate('/help')}>
//           <i className="fas fa-info-circle mr-2.5"></i>
//           <p>ศูนย์ช่วยเหลือ</p>
//         </div>
//         </div>
//         <div className='flex items-center border-t-2 inline-flex'>
//           <i className="fas fa-sign-out-alt  text-2xl m-2.5 px-5 " onClick={dologout}></i>
//         </div>
      
//       </div>
//     </div>
//   );
// }