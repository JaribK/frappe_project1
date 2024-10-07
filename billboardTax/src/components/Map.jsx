import React, { useState, useEffect, useMemo, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import L from 'leaflet';
import { FrappeContext, useSWR } from 'frappe-react-sdk';
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
  const { call } = useContext(FrappeContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [billboards, setBillboards] = useState([]);

  
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
  console.log(inputLat)
  console.log(inputLng)

  useEffect(() => {
    if (inputLat && inputLng) {
      console.log("Input Latitude:", inputLat);
      console.log("Input Longitude:", inputLng);
      setLoading(true);
      call.get("maechan.api.get_all_billboard_documents")
      .then(response => {
        console.log("Response Data:", response.message);
        if (response.message && Array.isArray(response.message)) {
          const matchingBillboards = response.message.filter(billboard => 
            Number(billboard.lat) === Number(inputLat) && Number(billboard.lng) === Number(inputLng)
          );
          console.log(response.message)
          setBillboards(matchingBillboards);
        } else {
          console.error("Invalid data structure:", response.data);
        }
      })
      .catch(error => {
        console.error("Error fetching billboards:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
}, [inputLat, inputLng]);


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

  const handleCurrentPositionSubmit = async (e) => {
    e.preventDefault();
    const latitude = inputLat;
    const longitude = inputLng;
    
    const landId = billboards.length > 0 ? billboards[0].land_id : null; 

    if (landId) {
        navigate('/explorefrom', { state: { landNumber: landId } });
    } else {
        navigate('/explorefrom', { state: { latitude, longitude } });
    } };
  

  const handleLandSubmit = async (e) => {
    e.preventDefault();
    navigate('/explorefrom',{ state: { landNumber } });

  };


  return (
    <div className='font-prompt min-h-screen'>
      <button onClick={onClose} className='absolute top-4 right-6 text-3xl z-[1000]'>
          <i className="fa fa-times" aria-hidden="true"></i>
      </button>
      <button className="fixed bottom-1 left-1/2 transform -translate-x-1/2 z-[1000]  p-2  bg-sky-700 text-white border-none rounded  w-12 h-9" onClick={handleShowForm}>
        <i className="fa fa-angle-up text-lg  relative top-[-2px] " aria-hidden="true"></i>
      </button>
      <div 
        className={`fixed h-1/3 mb-0 w-full rounded-t-3xl bg-curious-blue-700 px-5 pt-5 shadow-[0_-2px_10px_rgba(0,0,0,0.2)]  z-[1001] transition-[bottom] duration-100 ease-in-out  
          ${showForm ? 'bottom-0 ' : 'bottom-[-100%]'
        } `}
      >
        <form className='flex flex-col items-center my-8'>      
          <button onClick={onClose} className='absolute top-5 right-7'>
            <i className="fa fa-times text-2xl text-white" aria-hidden="true"></i>
          </button>
          <button 
            type="Current_Position" 
            onClick={handleCurrentPositionSubmit}
            className='h-14 bg-white p-2.5 m-8 mb-3 text-curious-blue-950 rounded-xl w-8/12 font-normal text-2xl'           
          >เลือกตำแหน่งปัจจุบัน</button>
          <button 
            type="Land_Location" 
            className='h-14 bg-white p-2.5 m-8 text-curious-blue-950 rounded-xl w-8/12 font-normal text-2xl' onClick={handleShowFormLand}>เลือกตำแหน่งที่ดิน</button>
        </form>
      </div>
      
      {showFormLand &&(
        <div className='fixed h-1/3 w-full bottom-0 rounded-t-3xl bg-curious-blue-700 p-5 shadow-[0_-2px_10px_rgba(0,0,0,0.2)]  z-[1001] transition-[bottom] duration-100 ease-in-out'>
          <div className='flex flex-col items-center'>
            <button  onClick={OnClose} className='absolute top-5 right-7'>
              <i className="fa fa-times text-2xl text-white" aria-hidden="true"></i>
            </button>
            <p className='text-white font-medium text-2xl m-8'>เลือกจากตำแหน่งที่ดิน</p>
            <input 
              type="text" 
              value={landNumber}
              placeholder='เลขที่โฉนด'
              onChange={(e)=>setLandNumber(e.target.value)} 
              className='h-12 w-3/4 p-2 mt-4 m-8 rounded-md text-lg bg-linen-50' />
            <button className='h-12 w-1/3 text-xl m-4 rounded-lg bg-linen-50' onClick={handleLandSubmit} >ยืนยัน</button>
          </div>
        </div>
      )}

      

      {currentPosition && ( 
        <MapContainer
          center={currentPosition}
          zoom={13}
          className="map-container h-screen"
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
      html: `<i class="fa-solid fa-location-dot custom-iconI " style="font-size: ${iconSize}px; color: red;"></i>`,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize],
      popupAnchor: [0, -iconSize],
    });
  }, [zoomLevel]);

  return <Marker position={position} icon={customIcon} />;
}

export default Map;
