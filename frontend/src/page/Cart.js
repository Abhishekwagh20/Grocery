import React from "react";
import { useSelector } from "react-redux";
import CartProduct from "../component/cartProduct";
import emptyCartImage from "../assets/empty.gif"
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
const Cart = () => {
  const productCartItem = useSelector((state) => state.product.cartItem);
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const totalPrice = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.total),
    0
  );
  const totalQty = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.qty),
    0
  );

  
  

    const handlePayment = async () => {
      if (user.email) {
        const products = productCartItem.map(product => ({
          _id: product._id,
          name: product.name,
          price: product.price,
          category: product.category, 
          qty: product.qty, 
          total: product.total 
        }));
    
        const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/submit-payment`, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ products, userInfo: user })
        });
    
        if (res.status === 500) {
          // Handle server error
          console.error('Error: Internal Server Error');
          return;
        }
    
        const data = await res.json();
        console.log(data);
    
        toast("Redirect to payment Gateway...!");
        navigate("/payment")
        
      } else {
        toast("You have not logged in!");
        navigate("/login")
      }
    };

  return (
    <>
    
      <div className="p-2 md:p-4">
        <h2 className="text-lg md:text-2xl font-bold text-slate-600">
          Your Cart Items
        </h2>

        {productCartItem[0] ?
        <div className="my-4 flex gap-3">
          <div className="w-full max-w-3xl ">
            {productCartItem.map((el) => {
              return (
                <CartProduct
                  key={el._id}
                  id={el._id}
                  name={el.name}
                  image={el.image}
                  category={el.category}
                  qty={el.qty}
                  total={el.total}
                  price={el.price}
                />
              );
            })}
          </div>

          <div className="w-full max-w-md  ml-auto">
            <h2 className="bg-blue-500 text-white p-2 text-lg">Summary</h2>
            <div className="flex w-full py-2 text-lg border-b">
              <p>Total Qty :</p>
              <p className="ml-auto w-32 font-bold">{totalQty}</p>
            </div>
            <div className="flex w-full py-2 text-lg border-b">
              <p>Total Price</p>
              <p className="ml-auto w-32 font-bold">
                <span className="text-red-500">$</span> {totalPrice}
              </p>
            </div>
              <button className="bg-red-500 w-full text-lg font-bold py-2 text-white" onClick={handlePayment}>
                Payment
              </button>
          </div>
        </div>

        : 
        <>
          <div className="flex w-full justify-center items-center flex-col">
            <img src={emptyCartImage} className="w-full max-w-sm"/>
            <p className="text-slate-500 text-3xl font-bold">Empty Cart</p>
          </div>
        </>
      }
      </div>
    
    </>
  );
};

export default Cart;