import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-hot-toast';
import { BsTrash } from 'react-icons/bs'; // Import the delete icon
import CardFeature from "./CardFeature";
import FilterProduct from "./FilterProduct";

const AllProduct = ({ heading }) => {
  const productData = useSelector((state) => state.product.productList);
  const categoryList = [...new Set(productData.map((el) => el.category))];
  const userData = useSelector((state) => state.user);

  // filter data display
  const [filterby, setFilterBy] = useState("");
  const [dataFilter, setDataFilter] = useState([]);

  useEffect(() => {
    setDataFilter(productData);
  }, [productData]);

  const handleFilterProduct = (category) => {
    setFilterBy(category);
    const filter = productData.filter(
      (el) => el.category.toLowerCase() === category.toLowerCase()
    );
    setDataFilter(() => {
      return [...filter];
    });
  };

  const handleDeleteProduct = async (productName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/deleteProductByName/${encodeURIComponent(productName)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (data.alert) {
        // Product deleted successfully
        toast.success(data.message);
        setDataFilter((prevData) => prevData.filter((el) => el.name !== productName));
      } else {
        // Error deleting product
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Internal server error');
    }
  };

  const loadingArrayFeature = new Array(10).fill(null);

  return (
    <div className="my-5">
      <h2 className="font-bold text-2xl text-slate-800 mb-4">{heading}</h2>

      <div className="flex gap-4 justify-center overflow-scroll scrollbar-none">
        {categoryList[0] ? (
          categoryList.map((el) => {
            return (
              <FilterProduct
                category={el}
                key={el}
                isActive={el.toLowerCase() === filterby.toLowerCase()}
                onClick={() => handleFilterProduct(el)}
              />
            );
          })
        ) : (
          <div className="min-h-[150px] flex justify-center items-center">
            <p>Loading...</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 my-4">
        {dataFilter[0] ? (
          dataFilter.map((el) => (
            <div key={el._id} className="relative">
              <CardFeature
                id={el._id}
                image={el.image}
                name={el.name}
                category={el.category}
                price={el.price}
              />
               {
                  userData.email === process.env.REACT_APP_ADMIN_EMAIL &&

                
              <button
                onClick={() => handleDeleteProduct(el.name)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
              >
                <BsTrash />
              </button>}
            </div>
          ))
        ) : (
          loadingArrayFeature.map((el, index) => (
            <CardFeature loading="Loading..." key={index + "allProduct"} />
          ))
        )}
      </div>
    </div>
  );
};

export default AllProduct;
