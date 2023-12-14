import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import axios from 'axios';
import MapComponent from './MapComponent';
const submitPayment = async (paymentData) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/submit-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    console.log(result);

    if (result.message === 'Payment information saved successfully') {
      toast.success('Payment successful! Redirecting to the home page.');
    } else {
      toast.error('Payment failed. Please try again.');
    }
  } catch (error) {
    console.error('Error submitting payment:', error);
    toast.error('Error submitting payment. Please try again.');
  }
};

const Payment = () => {
  const productCartItem = useSelector((state) => state.product.cartItem);
  const userData = useSelector((state) => state.user);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: userData.email,
    phone: '',
    address: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    products: productCartItem,
    orderType: 'pickup', // Default order type
    pickupLocation: 'location1', // Default pickup location
  });
 
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types accordingly
    if (type === 'radio') {
      setFormData({ ...formData, [name]: value });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNearMeSearch = async (e) => {
    e.preventDefault();
  
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
  
      const userLocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        radius: 10000,
      };
  
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/api/locations/nearme`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userLocationData),
      });
  
      const responseJson = await response.json();
      console.log(responseJson);
  
      setNearbyLocations(responseJson);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    const navigateToMap = async () => {
      await navigate('/map', { state: { coordinates: nearbyLocations } });
    };
  
    if (nearbyLocations.length > 0) {
      navigateToMap();
    }
  }, [nearbyLocations]);
  
  
  // useEffect(() => {
  //   // Use the browser's Geolocation API to get user's location
  //   console.log("nearbyLocations");
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       setUserLocation({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //       });
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled before submitting
    for (const key in formData) {
      if (!formData[key]) {
        toast.error('Please fill in all fields.');
        return;
      }
    }

    // Call the submitPayment function with the form data
    await submitPayment(formData);

    // Redirect to the home page immediately
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Payment Details</h2>
      <form className='items-center' style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone:</label>
          <input
            style={styles.input}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Address:</label>
          <input
            style={styles.input}
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Card Number:</label>
          <input
            style={styles.input}
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Expiration Date (mm/yyyy):</label>
          <input
            style={styles.input}
            type="text"
            name="expirationDate"
            placeholder="mm/yyyy"
            value={formData.expirationDate}
            onChange={handleChange}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>CVV:</label>
          <input
            style={styles.input}
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
          />
        </div>
        <div style={styles.formGroup} className=''>
          <label style={styles.label}>Order Type:</label>
          <div className='flex'>
            <label>
              <input
                type="radio"
                name="orderType"
                value="pickup"
                checked={formData.orderType === 'pickup'}
                onChange={handleChange}
              />
              Pickup
            </label>
            <label style={{ marginLeft: '10px' }}>
              <input
                type="radio"
                name="orderType"
                value="delivery"
                checked={formData.orderType === 'delivery'}
                onChange={handleChange}
              />
              Delivery
            </label>
          </div>

        </div>

        {formData.orderType === 'pickup' && (
          <div style={styles.formGroup} className=''>
            <div>
              <button style={styles.submitButton} onClick={handleNearMeSearch}>Search Near Me</button>

              {/* <ul>
        {nearbyLocations.map((location) => (
          <li key={location._id}>{location.name}</li>
        ))} 
      </ul> */}
            </div>
            <label style={styles.label}>Pickup Location:</label>
            <select
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="location1">Location 1</option>
              <option value="location2">Location 2</option>
            </select>
          </div>
        )}

        <button style={styles.submitButton} type="submit">
          Submit Payment
        </button>
      </form>
    </div>
    
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontSize: '16px',
    display: 'block', // Ensures labels are on top of input fields
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  submitButton: {
    background: '#4CAF50',
    color: 'white',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Payment;