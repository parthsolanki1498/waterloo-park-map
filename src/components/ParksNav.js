import React, { useState } from 'react';
import './ParksNav.css';

const ParksNav = ({ parks, onParkSelect }) => {
  const [selectedParkId, setSelectedParkId] = useState(null);

  const handleParkClick = (park) => {
    setSelectedParkId(park.id);
    onParkSelect(park);
  };

  return (
    <div className="parks-nav-container">
      <div className="parks-nav">
        <h2 className="nav-title">Park List</h2>
        <ul className="nav-list">
          {parks.map((park) => (
            <li
              key={park.id}
              onClick={() => handleParkClick(park)}
              className={`nav-item ${park.id === selectedParkId ? 'selected' : ''}`}
            >
              {park.data.properties.PARK_NAME}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ParksNav;
