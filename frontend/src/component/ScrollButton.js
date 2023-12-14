import React from 'react';

const ScrollButton = () => {
  const handleScrollDown = () => {
    // Scroll to a specific position or element on the page
    window.scrollTo({
      top: 360,
      behavior: 'smooth', 
    });
  };

  return (
    <div>
      
      <button className="font-bold bg-red-500 text-slate-200 px-4 py-2 rounded-md" onClick={handleScrollDown}>Order now</button>
    </div>
  );
};

export default ScrollButton;
