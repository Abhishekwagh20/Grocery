import React from "react";
import GoogleMapReact from 'google-map-react';
import { useLocation } from "react-router-dom";

const MapComponent = ({ coordinates }) => {
  const location = useLocation();
  const coordinates2 = location.state?.coordinates || [];
  const updatedCoordinates = coordinates2.map(cood => ({
    name: cood.name,
    latitude: cood.coordinates[0],
    longitude: cood.coordinates[1]
  }));

  const defaultProps = {
    center: {
      lat: updatedCoordinates[0]?.latitude || 0,
      lng: updatedCoordinates[0]?.longitude || 0
    },
    zoom: 11
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyBuw_qnqqQnzVTBJnQiLMu7zhJWGRPybQM" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        {updatedCoordinates.map((value, index) => (
          <Marker
            key={index}
            lat={value.latitude}
            lng={value.longitude}
            text={value.name}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};

const Marker = ({ text }) => (
  <div style={{
    color: 'white',
    background: 'red',
    padding: '10px 15px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transform: 'translate(-40%, -50%)'
  }}>
    {text}
  </div>
);

export default MapComponent;