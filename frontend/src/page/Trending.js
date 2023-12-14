// Trending.js

import React from 'react';
import AllProduct from '../component/TrendingProducts';

const trendingContainerStyle = {
  maxWidth: '800px',
  margin: 'auto',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  textAlign: 'center', // Center-align content
};

const trendingHeadingStyle = {
  color: '#4285f4', // Google blue color
  fontSize: '32px',
  marginBottom: '10px',
};

const trendingDescriptionStyle = {
  color: '#666',
  fontSize: '16px',
  marginBottom: '20px',
};

const Trending = () => {
  return (
    <div style={trendingContainerStyle}>
      <h2 style={trendingHeadingStyle}>Explore the Trending Products</h2>
      <p style={trendingDescriptionStyle}>
        Discover our curated collection of trending products that are making waves in the market.
      </p>
      <AllProduct />
    </div>
  );
};

export default Trending;
