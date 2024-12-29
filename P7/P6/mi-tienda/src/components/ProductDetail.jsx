import useSWR from "swr";
import { useParams } from "react-router-dom";

const fetcher = url => fetch(url).then(res => res.json());

const ProductDetail = () => {
  const { id } = useParams();
  const { data, error } = useSWR(`https://fakestoreapi.com/products/${id}`, fetcher);

  if (error) return <div>Error al cargar el producto.</div>;
  if (!data) return <div>Cargando...</div>;

  return (
    <div className="card flex-center">
      <h1>{data.title}</h1>
      <img src={data.image} alt="Image1" className="card-img-top"></img>
      <p className="mt-4">{data.description}</p>
      <p className="text-xl font-semibold mt-4">Price: ${data.price}</p>
    </div>
  );
};

export default ProductDetail;
