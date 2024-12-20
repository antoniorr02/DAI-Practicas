import useSWR from "swr";
import ProductCard from "./ProductCard";
import "../App.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductList = () => {
  const { data, error } = useSWR("https://fakestoreapi.com/products", fetcher);

  if (error) return <div>Error al cargar productos.</div>;
  if (!data) return <div>Cargando...</div>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
      {data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
