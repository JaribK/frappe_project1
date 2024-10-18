import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fontsource/inter';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Chart from '../components/Chart';
import Card from '../components/CardSurvey';
import { FrappeContext} from 'frappe-react-sdk';
import Select from 'react-select';
import Navbar from '../components/Navbar';
import Manu from '../components/Manu';



export default function Home() {
  const { call } = useContext(FrappeContext);
  const [selectedMoo, setSelectedMoo] = useState(null);
  const [showAllCards, setShowAllCards] = useState(false);
  const [billboards, setBillboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [oldBillboards,setOldBillboards] = useState([])
  const options = billboards
    .map((billboard) => ({
      value: billboard.moo,
      label: `หมู่ ${billboard.moo}`,
    }))
    .filter(
      (option, index, self) =>
        index === self.findIndex((o) => o.value === option.value)
    )
    .sort((a, b) => Number(a.value) - Number(b.value)); 

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
    if (!selectedMoo && options.length > 0) {
      setSelectedMoo(options[0].value); 
    }
  }, [selectedMoo, options]);
  
  //useSWR()

 useEffect(() => {
  const fetchData = () => {
    setLoading(true);
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
    call.get("maechan.api.get_all_false_billboard_documents")
    .then(response => {
      setOldBillboards(response.message);  
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


  const handleToggleShowAll = () => {
    setShowAllCards(prev => !prev);
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
  

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: '1px solid  #adadad', 
      fontFamily: 'prompt, sans-serif',
      borderRadius: '1.5rem', 
      backgroundColor: state.isFocused ? '#ededed' : 'white', 
      paddingLeft: '12px',
      paddingRight: '2px', 
      boxShadow: state.isFocused ? '0 0 0 2px rgba(79, 70, 229, 0.5)' : 'none', 
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      paddingRight: '8px', 
    }),
    indicatorSeparator: () => ({
      display: 'none', 
    }),
    option: (provided, state) => ({
      ...provided,
      fontFamily: 'prompt, sans-serif',
      backgroundColor: state.isSelected ? '#ededed' : 'white',
      color: state.isSelected ? '#13293e' : '#1d405d', 
    })
  };

  
  const filteredBillboards = oldBillboards
    .filter(billboard =>
      billboard.billboard_status   !== 'ยกเลิกแล้ว' && 
      billboard.moo === selectedMoo 
    )
    .sort((a, b) => new Date(a.modified_date) - new Date(b.modified_date));
  
  const displayedBillboards = showAllCards ? filteredBillboards : filteredBillboards.slice(0, 4);

  const displayedBillboard = oldBillboards
  .filter(billboard => 
    billboard.billboard_status !== 'ยกเลิกแล้ว'
  )
  .sort((a, b) => new Date(a.modified_date) - new Date(b.modified_date))
  



  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className="flex-grow overflow-auto">
      <div className="relative m-6 flex justify-center items-center ">
        <Select
          value={options.find(option => option.value === selectedMoo) || null}
          onChange={handleSelectChange}
          classNamePrefix="tailwind"
          className="w-11/12 h-10 text-base text-black font-prompt rounded-lg text-curious-blue-900"
          styles={customStyles}
          options={options}
          defaultValue={options[0]}
          isDisabled={false}
          isLoading={false}
          isClearable={true}
          isRtl={false}
          isSearchable={true}
          placeholder='โปรดเลือกหมู่...'
        >
        </Select>
      </div>

      {selectedMoo ? (
        <>
        <Chart selectedMoo={selectedMoo}/>

        <div className='p-5 text-left text-sky-950 '>
          <div
            className='underline text-xl font-prompt font-semibold text-sky-950'><p>ผลการสำรวจ</p></div>
            {sortedYears.map((year, index) => (
              <div key={year}>
                <h3 className='text-center font-semibold font-prompt'>ปี {year}</h3>
                <div className=''>
                  {displayedBillboards
                  .filter(billboard => new Date(billboard.modified_date).getFullYear() === year 
                  )
                  .sort((a, b) => new Date(a.modified_date) - new Date(b.modified_date))
                  .map(billboard => (
                      <div key={billboard.name} onClick={() => handleCardClick(billboard)}>
                      <Card
                          landCode={billboard.land_id}
                          ownerName={billboard.owner_name}
                          signCount={billboard.data_billboards.length}
                          Lastupdate={billboard.modified_date}
                      />
                  </div>
                    ))}
                    {displayedBillboards.length > 2 && (
                      <p onClick={handleToggleShowAll} className='underline text-center font-prompt font-semibold text-sky-950'>
                        {showAllCards ? 'ปิด' : 'ดูเพิ่มเติม'}
                      </p>
                    )}
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
      ) : null
      }
      </div>
      <Manu />
        
    </div>
  )
}
