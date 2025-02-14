import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Mail, ArrowRight, MapPin, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent-charcoal lg:px-10 mt-40">
        <div className="relative">
          {/* Newsletter Section - Elevated Card */}
          <div className="absolute -top-16 left-4 right-4 bg-restaurant-500 rounded-xl p-6 md:p-8 shadow-xl mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white md:w-1/2">
                <h3 className="text-2xl font-bold">Get the Fresh Food Updates</h3>
                <p className="mt-2 text-restaurant-100">Subscribe to our newsletter for exclusive deals and updates</p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 flex-1"
                  />
                  <Button className="bg-white text-restaurant-500 hover:bg-restaurant-100 px-6">
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="pt-32 pb-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Brand Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">VedEats</h2>
                <p className="text-gray-400 leading-relaxed">
                  Bringing the finest cuisines right to your doorstep. Experience the joy of hassle-free food delivery.
                </p>
                <div className="flex items-center space-x-4 text-gray-400">
                  <MapPin size={20} className="text-restaurant-400" />
                  <span className="text-sm">123 Foodie Street, Cuisine City</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-400">
                  <Phone size={20} className="text-restaurant-400" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                <ul className="space-y-3">
                  {['About Us', 'Our Menu', 'Special Offers', 'Delivery Areas'].map((item) => (
                    <li key={item}>
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-restaurant-300 transition-colors duration-200 flex items-center gap-2"
                      >
                        <ArrowRight size={16} className="text-restaurant-400" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Support</h3>
                <ul className="space-y-3">
                  {['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map((item) => (
                    <li key={item}>
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-restaurant-300 transition-colors duration-200 flex items-center gap-2"
                      >
                        <ArrowRight size={16} className="text-restaurant-400" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Connect With Us</h3>
                <p className="text-gray-400">Follow us on social media for updates and special offers</p>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, link: 'https://facebook.com' },
                    { icon: Instagram, link: 'https://instagram.com' },
                    { icon: Twitter, link: 'https://twitter.com' },
                    { icon: Linkedin, link: 'https://linkedin.com' }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-2 rounded-lg hover:bg-restaurant-500 transition-colors duration-200"
                    >
                      <social.icon className="h-5 w-5 text-white" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 text-sm">
                  © {currentYear} VedEats. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  {['Privacy Policy', 'Terms of Service', 'Cookies Settings'].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-gray-400 hover:text-restaurant-300 text-sm transition-colors duration-200"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;