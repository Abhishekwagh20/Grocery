import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const containerStyle = {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  };

  const labelStyle = {
    fontSize: '1.2rem',
    marginBottom: '8px',
    color: '#555',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  };

  const textareaStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  };

  const buttonStyle = {
    background: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.2rem',
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send the contact form data to the backend
      const response = await fetch('http://localhost:8080/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      // Check the result and show a success toast
      if (result.message === 'Contact form submitted successfully') {
        toast.success(result.message);
  
        // Reset form data
        setFormData({
          name: '',
          email: '',
          message: '',
        });
  
        // Redirect to the home page
        navigate('/');
      } else {
        // Handle error scenarios
        toast.error('Failed to submit contact form');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Internal server error');
    }
  };
  
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle} htmlFor="name">
          Your Name:
        </label>
        <input
          style={inputStyle}
          type="text"
          id="name"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleInputChange}
        />

        <label style={labelStyle} htmlFor="email">
          Your Email:
        </label>
        <input
          style={inputStyle}
          type="email"
          id="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleInputChange}
        />

        <label style={labelStyle} htmlFor="message">
          Your Message:
        </label>
        <textarea
          style={textareaStyle}
          id="message"
          name="message"
          rows="4"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleInputChange}
        ></textarea>

        <button style={buttonStyle} type="submit">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;