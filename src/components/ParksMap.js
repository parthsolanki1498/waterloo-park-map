import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ParksMap.css';
import { CompareArrows, Grass, Home, Park } from '@mui/icons-material';

const ParksMap = ({ selectedPark }) => {
  const [parks, setParks] = useState([]);
  const mapRef = useRef(null); // Initialize mapRef with null 

  useEffect(() => {
    const fetchParks = async () => {
      try {
        const response = await axios.get('https://us-west-2.aws.neurelo.com/rest/geojson', {
          headers: {
            'X-API-KEY': process.env.REACT_APP_NEURELO_API_KEY
          }
        });
        setParks(response.data.data);
      } catch (error) {
        console.error('Error fetching the park data:', error);
      }
    };

    fetchParks();
  }, []);

  useEffect(() => {
  if (selectedPark && mapRef.current) {
    const map = mapRef.current;
    try {
      const coordinates = JSON.parse(selectedPark.data.geometry.coordinates)[0].map(coord => [coord[1], coord[0]]);
      if (coordinates.length > 0) {
        const latLngBounds = L.latLngBounds(coordinates);
        map.fitBounds(latLngBounds);
        console.log('Map fit to bounds:', latLngBounds);
      } else {
        console.error('No coordinates found for selected park.');
      }
    } catch (error) {
      console.error('Error parsing coordinates:', error);
    }
  }
}, [selectedPark]);


  const highlightStyle = {
    color: 'red',
    fillColor: 'orange',
    fillOpacity: 0.5,
  };

  const normalStyle = {
    color: 'blue',
    fillColor: 'lightblue',
    fillOpacity: 0.5,
  };

  return (
    <MapContainer
      center={[43.47, -80.60]}
      zoom={13}
      style={{ height: '100vh', width: 'calc(100% - 250px)', marginLeft: '250px' }}
      ref={(mapInstance) => { mapRef.current = mapInstance }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {parks.map(park => {
        const coordinates = JSON.parse(park.data.geometry.coordinates)[0].map(coord => [coord[1], coord[0]]);

        // const { PARK_NAME, ADDRESS, PARK_TYPE, HECTARES, PLAYGROUND } = park.data.properties;

        return (
          <Polygon
            key={park.id}
            positions={coordinates}
            pathOptions={selectedPark && selectedPark.id === park.id ? highlightStyle : normalStyle}
          >
           <Popup>
  <div className="popup-content">
    <h3>{park.data.properties.PARK_NAME}</h3>
    <div className="info">
      <span><Home /></span>
      <p><strong>Address:</strong> {park.data.properties.ADDRESS}</p>
    </div>
    <div className="info">
      <span><Park /></span>
      <p><strong>Type:</strong> {park.data.properties.PARK_TYPE}</p>
    </div>
    <div className="info">
      <span><CompareArrows /></span>
      <p><strong>Size:</strong> {park.data.properties.HECTARES} hectares</p>
    </div>
    <div className="info">
      <span><Grass /></span>
      <p><strong>Playground:</strong> {park.data.properties.PLAYGROUND ? 'Yes' : 'No'}</p>
    </div>
    {/* Add more data and icons as needed */}
  </div>
</Popup>


          </Polygon>
        );
      })}
    </MapContainer>
  );
};

export default ParksMap;
