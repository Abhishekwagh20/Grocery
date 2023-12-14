import React, { useState } from "react";
import logo from "../assets/logo.jpeg";
import { Link } from 'react-router-dom';
import { HiOutlineUserCircle } from "react-icons/hi";
import { BsCartFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { logoutRedux } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const userData = useSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShowMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logoutRedux());
    toast("Logout successfully");
  };

  const productData = useSelector((state) => state.product.productList);

  const onChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filterProducts = (searchterm) => {
    const filter = productData.filter(
      (el) => el.name.toLowerCase().startsWith(searchterm.toLowerCase())
    );
    navigate(`/menu/${filter[0]._id}`);
    console.log(filter[0]._id);
  };

  const cartItemNumber = useSelector((state) => state.product.cartItem);

  return (
    <header className="fixed shadow-md w-full h-16 px-2 md:px-4 z-50 bg-red-600">
      <div className="flex items-center h-full justify-between">
        <Link to={""} style={{ textDecoration: 'none' }}>
          <div className="h-16 flex text-white items-center ">
            <img src={logo} className="h-full" alt="logo" />
            <h1 className="font-bold text-xl ml-2">GroceryHub</h1>
          </div>
        </Link>
        <div className="flex items-center gap-4 md:gap-7">
          <nav className="gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
            <div className="search-container">
              <div className="search-inner">
                <input type="text" value={searchValue} placeholder="Search here" onChange={onChange} style={{ padding: '8px', borderRadius: '4px', outline: 'none' }} />
              </div>
              <div className="dropdown">
                {productData.filter(item => {
                  const searchTerm = searchValue.toLowerCase();
                  const productName = item.name.toLowerCase();
                  return searchTerm && productName.startsWith(searchTerm) && productName !== searchTerm;
                })
                  .map((item) => (
                    <div key={item.id}>
                      <Link to={`/menu/${item._id}`} className="dropdown-row">{item.name}</Link>
                      <br></br>
                    </div>
                  ))}
              </div>
            </div>
            <Link to={""} style={{ textDecoration: 'none' }}>Home</Link>
            <Link to={"trending"} style={{ textDecoration: 'none' }}>Trending Items</Link>
          </nav>
          <div className="text-2xl text-black-600 relative">
            <Link to={"cart"} style={{ textDecoration: 'none' }}>
              <BsCartFill />
              <div className="absolute -top-1 -right-1 text-white bg-black-600 h-4 w-4 rounded-full m-0 p-0 text-sm text-center">
                {cartItemNumber.length}
              </div>
            </Link>
          </div>
          <div
            className="bg-black-600 cursor-pointer"
            onClick={handleShowMenu}
            style={{ padding: '10px', borderRadius: '50%' }}
          >
            <div className="text-3xl text-white w-8 h-8 rounded-full overflow-hidden drop-shadow-md">
              {userData.image ? (
                <img src={userData.image} className="h-full w-full" alt="user-avatar" />
              ) : (
                <HiOutlineUserCircle />
              )}
            </div>
            {showMenu && (
              <div className="absolute right-2 bg-white py-2 shadow drop-shadow-md flex flex-col min-w-[120px] text-center rounded-md">
                {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
                  <Link to={"newproduct"} className="menu-link">
                    <span className="icon">🌟</span>
                    New Product
                  </Link>
                )}
                {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
                  <Link to={"manageuser"} className="menu-link">
                    <span className="icon">👤</span>
                    Manage User
                  </Link>
                )}
                {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
                  <Link to={"payment-analytics"} className="menu-link">
                    <span className="icon">💳</span>
                    Analytics
                  </Link>
                )}
                {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
                  <Link to={"signup"} className="menu-link">
                    <span className="icon">👥</span>
                    New User
                  </Link>
                )}
                {/* {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
                  <Link to={"productanalysis"} className="menu-link">
                    <span className="icon">📊</span>
                    Product Analysis
                  </Link>
                )} */}
                {userData.email ? (
                  <p className="menu-link logout" onClick={handleLogout}>
                    <span className="icon">🚪</span>
                    Logout ({userData.firstName})
                  </p>
                ) : (
                  <Link to={"login"} className="menu-link">
                    <span className="icon">🔐</span>
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
