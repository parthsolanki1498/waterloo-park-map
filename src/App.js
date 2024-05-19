import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ParksMap from './components/ParksMap';
import ParksNav from './components/ParksNav';
import './App.css';
import NearestParkFinder from './components/NearestParkFinder';

function App() {
  const [selectedPark, setSelectedPark] = useState(null);
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

  const handleParkSelect = (park) => {
    setSelectedPark(park);
  };

  const handleNearestParkFound = (nearestPark) => {
    setSelectedPark(nearestPark);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Newhbourhood Parks</h1>
        <NearestParkFinder onNearestParkFound={handleNearestParkFound} />
      </header>
      <main>
        <ParksNav parks={parks} onParkSelect={handleParkSelect} />
        <ParksMap selectedPark={selectedPark} />
      </main>
    </div>
  );
}

export default App;
