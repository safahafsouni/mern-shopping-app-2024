import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import Loader from '../components/shared/Loader';
import Message from '../components/shared/Message';
import HeroImage from '../assets/images/hero-page.png';
import InfoSection from '../components/InfoSection';
import ProductCard from '../components/ProductCard';
import Shop from './Shop';
import { Link } from 'react-router-dom';

function Home() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state?.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <div>
      <div className="bg-white mt-2 px-4 md:px-16 lg:px-24">
        <div className="container mx-auto py-4 flex flex-col md:flex-row space-x-2">
          <div className="w-full mt-8 md:mt-0 h-96 relative">
            <img src={HeroImage} alt="Hero" className="w-full h-full" />
            <div className="absolute top-16 left-8">
              <p className="text-gray-600 mb-4">Code with Safa</p>
              <h2 className="text-3xl font-bold">Welcome to E-SHOP</h2>
              <p className="text-xl mt-2.5 font-bold text-gray-800">
                MILLIONS+ PRODUCTS
              </p>
              <Link to="/shop">
                <button
                  className="bg-red-600 px-8 py-3 text-white mt-4 hover:bg-red-700 
              transform transition-transform duration-300 hover:scale-105"
                >
                  SHOP NOW
                </button>
              </Link>
            </div>
          </div>
        </div>

        <InfoSection />

        <div className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Top products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 cursor-pointer">
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : (
              products
                .slice(0, 5)
                .map((product) => (
                  <ProductCard product={product} key={product._id} />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
