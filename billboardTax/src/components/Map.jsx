import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import L from 'leaflet';
import axios from 'axios';

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null); 
  const [showForm,setShowForm] = useState(false);
  const [showFormLand,setShowFormLand] = useState(false);
  const [inputLat,setInputLat] = useState(''); 
  const [inputLng,setInputLng] = useState(''); 
  const [landNumber, setLandNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const position = [latitude, longitude];
        setCurrentPosition([latitude, longitude]);
        setMarkerPosition(position);
      },
      (err) => {
        console.error(err);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setMarkerPosition([lat, lng]);
    setInputLat(lat);
    setInputLng(lng);
  };

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   if (inputLat && inputLng) {
  //     setInputLat([parseFloat(inputLat), parseFloat(inputLng)]);
  //     setShowForm(false); 
  //   }
  // };

  const handleShowForm = () => {
    setShowForm(true);
    setShowFormLand(false);  
  };

  const onClose = (event) => {
    event.preventDefault();
    setShowForm(false);
  };
  
  const handleShowFormLand = (e) => {
    e.preventDefault();
    setShowFormLand(true);
    setShowForm(false);
  };
  
  const OnClose = (e) => {
    e.preventDefault();
    setShowFormLand(false)
  }

  const handleCurrentPositionSubmit = async () => {
    // if (inputLat && inputLng) {
    //   try {
    //     const response = await axios.post('/api/save-location', {
    //       latitude: inputLat,
    //       longitude: inputLng,
    //     });

    //     console.log('ตำแหน่งถูกส่งไปยังฐานข้อมูลแล้ว', response.data);

    //     const landResponse = await axios.get(`/api/get-land-number?lat=${inputLat}&lng=${inputLng}`);
    //     const landNumber = landResponse.data;

    //     navigate('/explore/:landNumber', { state: { landNumber } });


    //   } catch (error) {
    //     console.error('เกิดข้อผิดพลาดในการส่งตำแหน่งหรือดึงเลขที่ดิน:', error);
    //   }
    // }
    navigate('/explorefrom');
  };

  const handleLandSubmit = async () => {
    // if (landNumber) {
    //   try {
    //     const landResponse = await axios.get(`/api/get-land-number?lat=${inputLat}&lng=${inputLng}`);
        
    //     const landNumber = landResponse.data;

    //     navigate('/explore/:landNumber', { state: { landNumber } });


    //   } catch (error) {
    //     console.error('เกิดข้อผิดพลาดในการค้นหาข้อมูลโฉนด:', error);
    //   }
    // }
    navigate('/explorefrom');

  };
  return (
    <div className='font-prompt'>
      <button className="fixed bottom-1 left-1/2 transform -translate-x-1/2 z-[1000]  p-2  bg-sky-700 text-white border-none rounded  w-12 h-9" onClick={handleShowForm}>
        <i className="fa fa-angle-up text-lg  relative top-[-2px] " aria-hidden="true"></i>
      </button>
      <div 
        className={`fixed h-1/4 w-full rounded-t-3xl bg-curious-blue-700 p-5 shadow-[0_-2px_10px_rgba(0,0,0,0.2)]  z-[1001] transition-[bottom] duration-100 ease-in-out  
          ${showForm ? 'bottom-0' : 'bottom-[-100%]'
        } `}
      >
        <form className='flex flex-col items-center j'>      
          <button onClick={onClose} className='absolute top-5 right-7'>
            <i className="fa fa-times text-2xl text-white" aria-hidden="true"></i>
          </button>
          <button 
            type="Current_Position" 
            onClick={handleCurrentPositionSubmit}
            className='bg-white p-2.5 m-7 mb-3 text-sky-950 rounded-xl w-7/12 font-normal text-xl'           
          >เลือกตำแหน่งปัจจุบัน</button>
          <button type="Land_Location" className='bg-white p-2.5 m-7  text-sky-950 rounded-xl w-7/12 font-normal text-xl' onClick={handleShowFormLand}>เลือกตำแหน่งที่ดิน</button>
        </form>
      </div>
      
      {showFormLand &&(
        <div className='fixed h-1/4 w-full bottom-0 rounded-t-3xl bg-curious-blue-700 p-5 shadow-[0_-2px_10px_rgba(0,0,0,0.2)]  z-[1001] transition-[bottom] duration-100 ease-in-out'>
          <div className='flex flex-col items-center'>
            <button  onClick={OnClose} className='absolute top-5 right-7'>
              <i className="fa fa-times text-2xl text-white" aria-hidden="true"></i>
            </button>
            <p className='text-white font-medium text-2xl m-4'>เลือกจากตำแหน่งที่ดิน</p>
            <input 
              type="text" 
              value={landNumber}
              readOnly
              placeholder='เลขที่โฉนด' 
              className='h-12 w-3/4 p-2 mt-2 m-4 rounded-md text-lg bg-linen-50' />
            <button className='h-12 w-1/3 text-xl rounded-lg bg-linen-50' onClick={handleLandSubmit} >ยืนยัน</button>
          </div>
        </div>
      )}

      

      {currentPosition && ( 
        <MapContainer
          center={currentPosition}
          zoom={13}
          className="map-container"
          maxBounds={[[5.5, 97.3], [20.5, 105.9]]}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onClick={handleMapClick} />
          {markerPosition && <CustomMarker position={markerPosition} />}
        </MapContainer>
      )}
    </div>
  );
};

function MapClickHandler({ onClick }) {
  useMapEvent('click', onClick);
  return null;
}

function CustomMarker({ position }) {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  useEffect(() => {
    const handleZoom = () => {
      setZoomLevel(map.getZoom());
    };

    map.on('zoom', handleZoom);
    return () => {
      map.off('zoom', handleZoom);
    };
  }, [map]);

  const customIcon = useMemo(() => {
    const baseSize = 32;
    const zoomFactor = zoomLevel > 13 ? 1 : zoomLevel / 13;
    const iconSize = Math.max(baseSize, baseSize * zoomFactor);
    return new L.DivIcon({
      className: 'custom-icon',
      html: `<i class="fa-solid fa-location-dot custom-iconI" style="font-size: ${iconSize}px;"></i>`,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize],
      popupAnchor: [0, -iconSize],
    });
  }, [zoomLevel]);

  return <Marker position={position} icon={customIcon} />;
}

export default Map;
