import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Pagination, Radio } from 'antd';
import { listProducts } from '../actions/productActions';
import Loader from '../components/shared/Loader';
import Message from '../components/shared/Message';
import ProductCard from '../components/ProductCard';
import { listCategories } from '../actions/categoryActions';
import { Prices } from '../components/Prices';

const Shop = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state?.productList);
  const { loading, error, products, total } = productList;

  const categoryList = useSelector((state) => state?.categoryList);
  const { categories } = categoryList;

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [page, setPage] = useState(1); // Current page state

  useEffect(() => {
    dispatch(listProducts(page));
  }, [dispatch, page]);

  const onPageChange = (pageNumber) => {
    setPage(pageNumber);
    dispatch(listProducts(pageNumber));
  };

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  // Category select handler
  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(categoryId)) {
        return prevCategories.filter((id) => id !== categoryId);
      } else {
        return [...prevCategories, categoryId];
      }
    });
  };

  // Filter products based on the selected categories
  const displayedProducts = products?.filter((product) => {
    const isCategoryMatched = selectedCategories.length
      ? selectedCategories.includes(product.category._id)
      : true;

    const isPriceMatched = selectedPrice
      ? product.price >= selectedPrice[0] && product.price <= selectedPrice[1]
      : true;

    // Combine both conditions
    return isCategoryMatched && isPriceMatched;
  });

  // Handle price selection
  const handlePriceChange = (e) => {
    setSelectedPrice(e.target.value);
  };

  return (
    <div className="mx-auto py-12 px-4 md:px-16 lg:px-24">
      <h2 className="text-2xl font-bold mb-6 text-center">Shop</h2>
      <div className="grid grid-cols-12 gap-8">
        {' '}
        {/* Increased gap to 8 */}
        {/* Filters Section (Checkboxes and Price Radios) */}
        <div className="col-span-12 md:col-span-3">
          {/* Category Checkboxes */}
          <h3 className="text-xl font-bold mb-4">Filter By Category</h3>
          <div className="flex flex-col space-y-4">
            {categories?.map((cat) => (
              <Checkbox
                key={cat._id}
                onChange={(e) => handleCategorySelect(cat._id)}
              >
                {cat.name}
              </Checkbox>
            ))}
          </div>

          {/* Price Radios */}
          <h3 className="text-xl font-bold mb-4 mt-6">Filter By Price</h3>
          <div className="flex flex-col space-y-4">
            <Radio.Group onChange={handlePriceChange}>
              {Prices.map((price) => (
                <Radio
                  key={price._id}
                  value={price.array}
                  className="flex items-center"
                >
                  {price.name}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>
        {/* Products Section */}
        <div className="col-span-12 md:col-span-9">
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error}</Message>
          ) : displayedProducts.length === 0 ? (
            <Message variant="info">No products found.</Message>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {displayedProducts.map((product) => (
                  <ProductCard product={product} key={product._id} />
                ))}
              </div>
              <Pagination
                className="mt-8 justify-end"
                current={page}
                total={total}
                pageSize={9} // Set the number of items per page
                onChange={onPageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
