import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Dumbbell, Menu, X, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-gymRed' : 'text-gray-300 hover:text-white';
  };

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Membership', path: '/membership' },
    { name: 'Amenities', path: '/amenities' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-gymRed" />
              <span className="text-2xl font-black tracking-wider text-white">
                IRON<span className="text-gymRed">HOUSE</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold tracking-wide transition-colors ${isActive(
                  link.path
                )}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center space-x-1.5 text-sm font-semibold text-gray-300 hover:text-white bg-white/5 border border-white/10 px-4 py-2 rounded-xl transition-all"
                >
                  <User className="h-4 w-4 text-gymRed" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-bold text-white bg-gymRed hover:bg-gymRed-dark px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-300 hover:text-white px-3 py-2 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold text-white bg-gymRed hover:bg-gymRed-dark px-5 py-2.5 rounded-xl transition-all shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gymBlack-dark/95 border-b border-white/5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  location.pathname === link.path ? 'bg-gymRed/10 text-gymRed' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="border-t border-white/5 pt-4 pb-2 mt-4 space-y-2">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-base font-semibold text-gray-300 hover:text-white bg-white/5 border border-white/10"
                >
                  <User className="h-5 w-5 text-gymRed" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-base font-bold text-white bg-gymRed hover:bg-gymRed-dark shadow-md cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-white/5 pt-4 pb-2 mt-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-3 py-2.5 rounded-xl text-base font-semibold text-gray-300 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-3 py-2.5 rounded-xl text-base font-bold text-white bg-gymRed hover:bg-gymRed-dark shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
