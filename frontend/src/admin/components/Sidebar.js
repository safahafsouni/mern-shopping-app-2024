import { Link, NavLink } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiUsers, FiHome } from 'react-icons/fi'; // Import FiHome for home icon
import { FaChartBar, FaListAlt } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white h-full min-h-screen shadow-md">
      {/* Admin Panel Title */}
      <div className="px-6 py-4 flex items-center space-x-3">
        {/* Admin panel icon */}
        <div className="p-2 rounded">
          <FaChartBar size={24} />
        </div>
        <Link to="/admin">
          <span className="text-2xl font-bold italic">Admin Panel</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="mt-10">
        <ul>
          {/* Home Link */}
          <li className="mb-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center space-x-2 p-2 bg-gray-100 text-black'
                  : 'flex items-center space-x-2 p-2 hover:bg-gray-100 text-black'
              }
            >
              <span className="p-2 rounded">
                <FiHome className="text-gray-700" size={20} /> {/* Home icon */}
              </span>
              <span>Home</span>
            </NavLink>
          </li>

          {/* Dashboard Link */}
          <li className="mb-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center space-x-2 p-2 bg-gray-100 text-black'
                  : 'flex items-center space-x-2 p-2 hover:bg-gray-100 text-black'
              }
            >
              <span className="p-2 rounded">
                <MdDashboard className="text-gray-700" size={20} />
              </span>
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Orders Link */}
          <li className="mb-2">
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center space-x-2 p-2 bg-gray-100 text-black'
                  : 'flex items-center space-x-2 p-2 hover:bg-gray-100 text-black'
              }
            >
              <span className="p-2 rounded">
                <FiShoppingCart className="text-gray-700" size={20} />
              </span>
              <span>Orders</span>
            </NavLink>
          </li>

          {/* Categories Link */}
          <li className="mb-2">
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center space-x-2 p-2 bg-gray-100 text-black'
                  : 'flex items-center space-x-2 p-2 hover:bg-gray-100 text-black'
              }
            >
              <span className="p-2 rounded">
                <FaListAlt className="text-gray-700" size={20} />
              </span>
              <span>Categories</span>
            </NavLink>
          </li>

          {/* Products Link */}
          <li className="mb-2">
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center space-x-2 p-2 bg-gray-100 text-black'
                  : 'flex items-center space-x-2 p-2 hover:bg-gray-100 text-black'
              }
            >
              <span className="p-2 rounded">
                <FiPackage className="text-gray-700" size={20} />
              </span>
              <span>Products</span>
            </NavLink>
          </li>

          {/* Users Link */}
          <li className="mb-2">
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center space-x-2 p-2 bg-gray-100 text-black'
                  : 'flex items-center space-x-2 p-2 hover:bg-gray-100 text-black'
              }
            >
              <span className="p-2 rounded">
                <FiUsers className="text-gray-700" size={20} />
              </span>
              <span>Users</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
