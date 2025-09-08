import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-pink-50 to-white mt-20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              AYO Figurine
            </h3>
            <p className="text-gray-600 leading-relaxed text-base">
             Votre boutique de figurines premium avec plus de 5 ans d'expérience.
             Découvrez nos collections Football, Anime et Gadgets pour enrichir votre collection.
            </p>
            <div className="flex space-x-4 pt-2">
  {/* Instagram */}
  <a
    href="https://www.instagram.com/ayofigurine/"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full hover:from-blue-200 hover:to-cyan-200 transition-colors flex items-center justify-center"
  >
    <svg
      className="w-5 h-5 text-blue-600"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.75 2a5.75 5.75 0 0 0-5.75 5.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5Zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5a4.25 4.25 0 0 1-4.25 4.25h-8.5a4.25 4.25 0 0 1-4.25-4.25v-8.5A4.25 4.25 0 0 1 7.75 3.5Zm8.25 2a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-4.25 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
    </svg>
  </a>

  {/* Facebook */}
  <a
    href="https://www.facebook.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full hover:from-blue-200 hover:to-blue-300 transition-colors flex items-center justify-center"
  >
    <svg
      className="w-5 h-5 text-blue-700"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5v-2c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.7-1.6 1.5v1.8H18l-.5 3h-2.7v7A10 10 0 0022 12z" />
    </svg>
  </a>
</div>

          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-6">Liens Rapides</h4>
            <ul className="space-y-4">
              <li>
                <a href="/" className="text-gray-600 hover:text-indigo-600 transition-colors text-base font-medium">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-600 hover:text-blue-600 transition-colors text-base font-medium">
                  Nos Figurines
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors text-base font-medium">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-6">Contact</h4>
            <div className="space-y-5">
              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <span className="text-gray-600 text-base">Casablanca, Maroc</span>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <span className="text-gray-600 text-base">+212 6XX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <span className="text-gray-600 text-base">contact@ayofigurine.ma</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-base">
              © 2024 AYO Figurine. Tous droits réservés.
            </p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-blue-600 text-base transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-base transition-colors">
                Conditions d'utilisation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;