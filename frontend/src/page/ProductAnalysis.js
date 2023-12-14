import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductAnalysis = () => {
  const [popularItems, setPopularItems] = useState([]);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/popular-items`);
        const data = response.data;
        setPopularItems(data);
      } catch (error) {
        console.error('Error fetching popular items:', error);
      }
    };

    fetchPopularItems();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Popular Items Analysis</h2>
      <ul>
        {popularItems.map((item, index) => (
          <li key={index} style={styles.item}>
            <p>{item.name}</p>
            <p>Category: {item.category}</p>
            <p>Quantity Sold: {item.quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  item: {
    marginBottom: '20px',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    background: '#f7f7f7',
  },
};

export default ProductAnalysis;
