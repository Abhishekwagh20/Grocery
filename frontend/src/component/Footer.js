import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between">
        <div className="mb-8 md:mb-0">
          <h3 className="text-2xl mb-4">Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="mb-8 md:mb-0">
          <h3 className="text-2xl mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>

        <div>
          <h3 className="text-2xl mb-4">Contact Us</h3>
          <p>Email: info@groceryhub.com</p>
          <p>Phone: +1 123 456 7890</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p>&copy; 2023 GroceryHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;