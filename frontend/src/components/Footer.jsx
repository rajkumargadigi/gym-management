import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gymBlack-dark border-t border-white/5 pt-16 pb-8 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Gym Branding */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-gymRed" />
              <span className="text-2xl font-black tracking-wider text-white">
                METAL<span className="text-gymRed">DEN</span>
              </span>
            </Link>
            <p className="text-sm font-light leading-relaxed">
              We provide state-of-the-art facilities, certified personal trainers, and structured group workouts designed to push you beyond your limits.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wider uppercase">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-gymRed transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/membership" className="hover:text-gymRed transition-colors">Membership Plans</Link>
              </li>
              <li>
                <Link to="/amenities" className="hover:text-gymRed transition-colors">Amenities</Link>
              </li>
              <li>
                <Link to="/trainers" className="hover:text-gymRed transition-colors">Trainers</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gymRed transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Gym Hours */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wider uppercase">Opening Hours</h3>
            <ul className="space-y-3 text-sm font-light">
              <li className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gymRed shrink-0" />
                <span>Monday - Friday: 5:00 AM - 11:00 PM</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gymRed shrink-0" />
                <span>Saturday: 6:00 AM - 9:00 PM</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gymRed shrink-0" />
                <span>Sunday: 6:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wider uppercase">Contact Info</h3>
            <ul className="space-y-3.5 text-sm font-light">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-5 w-5 text-gymRed shrink-0 mt-0.5" />
                <span>Lane No:02, 100 ft Road, Madhapur, Hyderabad</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-gymRed shrink-0" />
                <span>+91 9988989898</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-gymRed shrink-0" />
                <span>support@metaldengym.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-white/5 pt-8 text-center text-xs text-gray-600 flex flex-col sm:flex-row items-center justify-between">
          <p>© 2026 MetalDen Gym. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
