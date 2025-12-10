import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl font-bold">🎓</span>
            </div>
            <span className="font-heading font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CareerPredict
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-1">
            <NavLink to="/" active={isActive('/')}>
              Home
            </NavLink>
            <NavLink to="/dashboard" active={isActive('/dashboard')}>
              Dashboard
            </NavLink>
            <NavLink to="/predict" active={isActive('/predict')}>
              Predict
            </NavLink>
            <NavLink to="/history" active={isActive('/history')}>
              History
            </NavLink>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-2 rounded-lg font-body font-medium transition-all duration-300 ${
          active
            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        {children}
      </motion.div>
    </Link>
  );
};

export default Navbar;
