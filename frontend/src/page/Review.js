import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { submitReview } from "../redux/productSlice";

const Review = ({ productId }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleReviewSubmit = () => {
    dispatch(submitReview({ productId, user, rating, comment }));
    // Optionally, you can reset the state here
  };

  return (
    <div>
      <h2>Submit a Review</h2>
      <label>User:</label>
      <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />

      <label>Rating:</label>
      <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} />

      <label>Comment:</label>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} />

      <button onClick={handleReviewSubmit}>Submit Review</button>
    </div>
  );
};

export default Review;
