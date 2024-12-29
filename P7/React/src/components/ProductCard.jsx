import React from "react";
import "../App.css"


const ProductCard = ({ product }) =>{
  return (
    <div className="card w-64 bg-white shadow-lg rounded-lg overflow-hidden">    
     <div className="overflow">
       <img src={product.image} alt="Image1" className="card-img-top"></img>
     </div>
     <div className="card-body text-dark">
       <h4 className="card-title">{product.title}</h4>
       <p className="card-text text-dark">
        {product.description}    
        </p>
        <button
          onClick={() => window.location.href = `/react/product/${product.id}`}
          className="w-full text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
          Buy Now
        </button>
      </div> 
   </div>
  );
}

export default ProductCard;
