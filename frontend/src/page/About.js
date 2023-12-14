import React from 'react';

const About = () => {
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

  const paragraphStyle = {
    marginBottom: '15px',
    lineHeight: '1.6',
    color: '#555',
  };

  const subHeadingStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>About Us</h1>
      <p style={paragraphStyle}>
        Welcome to our online grocery store! At GroceryHub, we are
        dedicated to providing you with high-quality products and a seamless
        shopping experience. Our mission is to make grocery shopping
        convenient, affordable, and enjoyable for our customers.
      </p>

      <p style={paragraphStyle}>
        GroceryHub was founded with the idea of making fresh and
        quality groceries accessible to everyone. We source our products from
        local farmers and trusted suppliers to ensure that you receive only the
        best items for you and your family.
      </p>

      <h2 style={subHeadingStyle}>Our Commitment</h2>
      <p style={paragraphStyle}>
        We are committed to providing a wide range of products to meet your
        everyday needs. From fresh produce to pantry staples, we have it all.
        Our user-friendly website and mobile app make it easy for you to browse
        and order your favorite items from the comfort of your home.
      </p>

      <p style={paragraphStyle}>
        Customer satisfaction is our top priority. If you have any questions or
        concerns, our customer support team is here to assist you. We value
        your feedback and strive to continuously improve our services to better
        serve you.
      </p>

      <h2 style={subHeadingStyle}>Contact Us</h2>
      <p style={paragraphStyle}>
        If you have any inquiries or need assistance, please feel free to
        contact us. You can reach us via email at info@groceryhub.com or by phone
        at +1 123 456 7890.
      </p>

      <p style={paragraphStyle}>
        Thank you for choosing GroceryHub. We look forward to
        providing you with a delightful shopping experience!
      </p>
    </div>
  );
};

export default About;