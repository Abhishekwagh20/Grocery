import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./page/Home";
import Menu from "./page/Menu";
import About from "./page/About";
import Contact from "./page/Contact";
import Login from "./page/login";
import Newproduct from "./page/Newproduct";
import Signup from "./page/Signup";
import { store } from "./redux/index";
import { Provider } from "react-redux";
import Cart from './page/Cart';
import Payment from './page/Payment';
import PaymentAnalytics from './page/PaymentAnalytics';
import Trending from "./page/Trending";
import ProductAnalysis from "./page/ProductAnalysis";
import ManageUser from "./page/ManageUser";
import Review from "./page/Review";
import MapComponent from "./page/MapComponent";



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="menu" element={<Menu />} />
      <Route path="menu/:filterby" element={<Menu />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="login" element={<Login />} />
      <Route path="newproduct" element={<Newproduct />} />
      <Route path="signup" element={<Signup />} />
      <Route path="cart" element={<Cart />} />
      <Route path="payment" element={<Payment />} />
      <Route path="payment-analytics" element={<PaymentAnalytics/>}/>
      <Route path="trending" element={<Trending />} />
      <Route path="productanalysis" element={<ProductAnalysis />} />
      <Route path="manageuser" element={<ManageUser />} />
      <Route path="review" element={<Review />} />
      <Route path="map" element={<MapComponent/>}></Route>


    </Route>
  )
);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);


reportWebVitals();
