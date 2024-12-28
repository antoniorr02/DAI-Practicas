import React from "react";
import ProductCard from "../components/ProductCard";
import useSWR from 'swr';
import "../index.css"
import "../App.css"

const fetcher = (url) => fetch(url).then((res) => res.json());

export const useFetch = (url) => {
  const { data, error } = useSWR(url, fetcher);

  return {
    data,
    error,
    isLoading: !data && !error,
  };
};

const Home = () => {
  const { data: products, error, isLoading } = useFetch('https://fakestoreapi.com/products');

  if (isLoading) return <p>Cargando productos...</p>;
  if (error) return <p>Error al cargar los productos</p>;

  return (
    <div className="flex justify-center flex-wrap gap-6 p-4 ">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Home;
