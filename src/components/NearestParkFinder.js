import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NearestParkFinder.css';

const NearestParkFinder = ({ onNearestParkFound }) => {
  const [postalCode, setPostalCode] = useState('');
  const [parks, setParks] = useState([]);

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

  const handlePostalCodeChange = (event) => {
    setPostalCode(event.target.value);
  };

  const findNearestPark = async () => {
    if (!postalCode) {
      alert('Please enter a postal code.');
      return;
    }

    try {
      const response = await axios.get(`http://api.openweathermap.org/geo/1.0/zip?zip=${postalCode},CA&appid=b4e2bfdb5f6ef4f79e998e42f1bb1ec8`);
      const { lat, lon } = response.data;

      let minDistance = Infinity;
      let nearestPark = null;

      for (const park of parks) {
        const address = park.data.properties.ADDRESS;
        const addressLatLongResponse = await axios.get(`https://geocode.maps.co/search?q=${address}&api_key=6649f5a815e57437542345wji08677f`);
        const parkLatitude = addressLatLongResponse.data[0].lat;
        const parkLongitude = addressLatLongResponse.data[0].lon;

        const distance = calculateDistance(lat, lon, parkLatitude, parkLongitude);

        if (distance < minDistance) {
          minDistance = distance;
          nearestPark = park;
        }
      }

      onNearestParkFound(nearestPark);
    } catch (error) {
      console.error('Error fetching postal code data:', error);
      alert('Error fetching postal code data. Please try again.');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const radLat1 = Math.PI * lat1 / 180;
    const radLon1 = Math.PI * lon1 / 180;
    const radLat2 = Math.PI * lat2 / 180;
    const radLon2 = Math.PI * lon2 / 180;
    const dLon = radLon2 - radLon1;
    const dLat = radLat2 - radLat1;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(radLat1) * Math.cos(radLat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c; // Radius of Earth in kilometers
    return distance;
  };

  return (
    <div className="nearest-park-finder">
      <div className="input-container">
        <input
          type="text"
          value={postalCode}
          onChange={handlePostalCodeChange}
          placeholder="Enter postal code"
          className="postal-code-input"
        />
        <button className="nearest-park-button" onClick={findNearestPark}>Find Nearest Park</button>
      </div>
    </div>
  );
};

export default NearestParkFinder;
