import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../actions/cartActions';
import Select from 'react-select'; // Import react-select for dropdown
import { getNames } from 'country-list'; // Import country-list to get countries
import CheckoutStep from '../components/shared/CheckoutStep';

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalcode, setPostalcode] = useState(
    shippingAddress?.postalcode || ''
  );
  const [country, setCountry] = useState(shippingAddress?.country || '');

  // Get all country names for the dropdown
  const countries = getNames().map((country) => ({
    label: country,
    value: country,
  }));

  const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch the shipping address
    dispatch(saveShippingAddress({ address, city, postalcode, country }));
    navigate('/payment'); // Redirect to the payment page
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <CheckoutStep step1 step2 />
      <h1 className="text-2xl font-bold text-center mb-6">Shipping Address</h1>
      <form
        onSubmit={submitHandler}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            placeholder="Enter your address"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="city"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            placeholder="Enter your city"
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="postalcode"
          >
            Postal Code
          </label>
          <input
            type="text"
            id="postalcode"
            placeholder="Enter postal code"
            value={postalcode}
            required
            onChange={(e) => setPostalcode(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="country"
          >
            Country
          </label>
          <Select
            id="country"
            options={countries}
            value={countries.find((c) => c.value === country)}
            onChange={(selectedOption) => setCountry(selectedOption.value)}
            className="shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default Shipping;
