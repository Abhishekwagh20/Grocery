import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import AllProduct from "../component/AllProduct";
import { addCartItem, submitReview } from "../redux/productSlice";

const Menu = () => {
  const { filterby } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product.productList);
  const productDisplay = productData.filter((el) => el._id === filterby)[0];
  const [review, setReview] = useState({ user: "", rating: 0, comment: "" });
  const [showReviews, setShowReviews] = useState(false);

  const handleAddCartProduct = () => {
    dispatch(addCartItem(productDisplay));
  };

  const handleBuy = () => {
    dispatch(addCartItem(productDisplay));
    navigate("/cart");
  };

  const handleReviewSubmit = () => {
    dispatch(
      submitReview({
        productId: filterby,
        user: review.user,
        rating: review.rating,
        comment: review.comment,
      })
    );

    setReview({ user: "", rating: 0, comment: "" });
    setShowReviews(true);
  };

  const renderStars = (count) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          size={20}
          color={i < count ? "#FFD700" : "#CCCCCC"}
          style={{ cursor: "pointer" }}
          onClick={() => setReview({ ...review, rating: i + 1 })}
        />
      );
    }
    return stars;
  };

  return (
    <div className="p-2 md:p-4">
      <div className="w-full max-w-4xl m-auto md:flex bg-white">
        <div className="max-w-sm  overflow-hidden w-full p-5">
          <img
            src={productDisplay.image}
            className="hover:scale-105 transition-all h-full"
            alt={productDisplay.name}
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-slate-600 capitalize text-2xl md:text-4xl">
            {productDisplay.name}
          </h3>
          <p className="text-slate-500 font-medium text-2xl">{productDisplay.category}</p>
          <p className="font-bold md:text-2xl">
            <span className="text-red-500 ">$</span>
            <span>{productDisplay.price}</span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleBuy}
              className="bg-yellow-500 py-1 mt-2 rounded hover:bg-yellow-600 min-w-[100px]"
            >
              Buy
            </button>
            <button
              onClick={handleAddCartProduct}
              className="bg-yellow-500 py-1 mt-2 rounded hover:bg-yellow-600 min-w-[100px]"
            >
              Add Cart
            </button>
            <button
  onClick={() => setShowReviews(!showReviews)}
  className="bg-yellow-500 py-1 mt-2 rounded hover:bg-yellow-600 min-w-[100px]"

>
  {showReviews ? "Hide Reviews" : "Review"}
</button>
          </div>
          <div>
            <p className="text-slate-600 font-medium">Description : </p>
            <p>{productDisplay.description}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
      


  {showReviews && (
    <div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginTop: '1rem' }}>Write a Review</h3>
      <input
        type="text"
        placeholder="Your Name"
        value={review.user}
        onChange={(e) => setReview({ ...review, user: e.target.value })}
        style={{
          border: '1px solid #e2e8f0',
          padding: '0.5rem',
          marginTop: '0.5rem',
          width: '100%',
          borderRadius: '0.375rem',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
        <span style={{ marginRight: '0.5rem', fontSize: '0.875rem' }}>Rating:</span>
        {renderStars(review.rating)}
      </div>
      <textarea
        placeholder="Write your review..."
        value={review.comment}
        onChange={(e) => setReview({ ...review, comment: e.target.value })}
        style={{
          border: '1px solid #e2e8f0',
          padding: '0.5rem',
          marginTop: '0.5rem',
          width: '100%',
          borderRadius: '0.375rem',
        }}
      />
      <button
        onClick={handleReviewSubmit}
        style={{
          backgroundColor: '#48bb78',
          padding: '0.5rem 1rem',
          marginTop: '0.5rem',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          border: 'none',
          outline: 'none',
          fontWeight: '600',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          letterSpacing: '-0.01em',
          textDecoration: 'none',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          verticalAlign: 'middle',
          userSelect: 'none',
          appearance: 'none',
          overflow: 'visible',
          margin: 0,
        }}
      >
        Submit Review
      </button>
    </div>
  )}

  {showReviews && (
   <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }}>
   <h3 style={{ fontSize: '1.875rem', fontWeight: '700', margin: '0 0 1.5rem', color: '#333' }}>Customer Reviews</h3>
   {productDisplay.reviews.length > 0 ? (
     productDisplay.reviews.map((review, index) => (
       <div key={index} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
         <p style={{ fontSize: '1.125rem', fontWeight: '700', margin: '0 0 0.5rem', color: '#333' }}>{review.user}</p>
         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
           <div style={{ marginRight: '0.5rem', display: 'flex', alignItems: 'center' }}>
             {renderStars(review.rating)}
           </div>
           <p style={{ fontSize: '1rem', color: '#4a5568' }}>{`Rating: ${review.rating.toFixed(1)}`}</p>
         </div>
         <p style={{ fontSize: '1.125rem', color: '#333' }}>{review.comment}</p>
       </div>
     ))
   ) : (
     <p style={{ fontSize: '1.125rem', marginTop: '1.5rem', color: '#4a5568' }}>No reviews yet.</p>
   )}
 </div>
 
 
  )}
</div>


      <AllProduct heading={"Related Product"} />
    </div>
  );
};

export default Menu;
