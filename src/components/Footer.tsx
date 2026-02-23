import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <h3 className="text-xl font-semibold text-white mb-4">Cosmic Oracle</h3>
          <p className="text-sm leading-relaxed">
            "Unlocking the secrets of the cosmos, one personalized insight at a time." Cosmic Oracle is your AI-powered guide to astrological wisdom.
          </p>
        </div>

        <div className="col-span-1">
          <h4 className="text-lg font-semibold text-white mb-4">Discover</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white transition-colors duration-200">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors duration-200">About</Link></li>
            <li><Link to="/how-to" className="hover:text-white transition-colors duration-200">How To</Link></li>

          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link to="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
        © 2026 Cosmic Oracle • Handcrafted Wisdom
      </div>
    </footer>
  );
};

export default Footer;
