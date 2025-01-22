import { Facebook, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import MaxWidthWrapper from './MaxWidthWrapper';

const Footer = () => {
  const currentYear = new Date().getFullYear();  // To get the current year dynamically

  return (
    <>
    <MaxWidthWrapper>
    <footer className="bg-red-800 text-gray-300 py-12 rounded-xl px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Column 1: Company Info */}
        <div>
          <h3 className="text-lg font-semibold text-white">VedEats</h3>
          <p className="mt-2 text-sm">
            The easiest way to get food delivered right to your doorstep.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-4 text-sm space-y-2">
            <li><a href="/about" className="hover:text-red-600">About Us</a></li>
            <li><a href="/contact" className="hover:text-red-600">Contact</a></li>
            <li><a href="/privacy-policy" className="hover:text-red-600">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-red-600">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Column 3: Email Updates */}
        <div>
          <h3 className="text-lg font-semibold text-white">Get Updates</h3>
          <p className="mt-2 text-sm">Sign up for email updates on new offers and products.</p>
          <div className="mt-4 flex">
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 text-sm border border-gray-600 rounded-l-md"
            />
            <Button className="bg-red-600 text-white px-4 py-2 rounded-r-md">Subscribe</Button>
          </div>
        </div>

        {/* Column 4: Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="mt-4 flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="text-white hover:text-red-600" size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="text-white hover:text-red-600" size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="text-white hover:text-red-600" size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin className="text-white hover:text-red-600" size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm">
          &copy; {currentYear} VedEats. All rights reserved.
        </p>
      </div>
    </footer> 
    </MaxWidthWrapper>
   
    </>
    
  );
};

export default Footer;
