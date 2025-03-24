import { FaRegUserCircle } from 'react-icons/fa';
import logo from '../assets/Gsynergy Logo V2 Long Description.svg';

const Navbar = () => {
  return (
    <div className="bg-white p-4 h-20 shadow-md flex items-center justify-between relative">
      {/* Logo with responsive width */}
      <img src={logo} alt="Logo" className="h-10 sm:h-12 md:h-14 lg:h-15" />

      {/* Responsive Title */}
      <h1
        className="nav-heading text-gray-700
       text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mx-auto">
        Data Viewer App
      </h1>

      {/* Profile Icon with spacing */}
      <FaRegUserCircle
        size={24}
        className="text-gray-600 ml-2 sm:ml-4 md:ml-6 lg:ml-8"
      />
    </div>
  );
};

export default Navbar;
