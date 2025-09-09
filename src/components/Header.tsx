import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ShoppingBag, Heart, User, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const { state, dispatch, getCartItemsCount, getCartTotal } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartPreview, setShowCartPreview] = useState(false);
  const location = useLocation();

  // Recherche automatique en temps réel
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Recherche automatique si on est sur la page trips
    if (location.pathname === '/trips') {
      dispatch({ type: 'SET_SEARCH', payload: value });
      
      // Mettre à jour l'URL en temps réel
      const newUrl = new URL(window.location.href);
      if (value.trim()) {
        newUrl.searchParams.set('search', value);
      } else {
        newUrl.searchParams.delete('search');
      }
      window.history.replaceState({}, '', newUrl.toString());
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Si on n'est pas sur la page trips, y aller
      if (location.pathname !== '/trips') {
        navigate(`/trips?search=${encodeURIComponent(searchQuery)}`);
      } else {
        // Si on est déjà sur trips, juste mettre à jour la recherche
        dispatch({ type: 'SET_SEARCH', payload: searchQuery });
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('search', searchQuery);
        window.history.replaceState({}, '', newUrl.toString());
      }
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm border-b border-gray-100">
          <div className="text-gray-600">
            
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <span>Suivez-nous:</span>
            <a href="https://www.instagram.com/rahma_store/" className="hover:text-indigo-600 transition-colors">
              Instagram
            </a>
            <a href="https://www.facebook.com/" className="hover:text-indigo-600 transition-colors">
              Facebook
            </a>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center">
              <div className="text-white font-bold text-lg">A</div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                AYO Figurine
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Premium Collectibles</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors relative ${
                isActive('/') 
                  ? 'text-amber-600' 
                  : 'text-gray-700 hover:text-amber-600'
              }`}
            >
              Accueil
              {isActive('/') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600"></div>
              )}
            </Link>
            <Link
              to="/products"
              className={`font-medium transition-colors relative ${
                isActive('/trips') 
                  ? 'text-orange-600' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Figurines
              {isActive('/trips') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-600 to-amber-600"></div>
              )}
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="font-medium text-gray-700 hover:text-amber-600 transition-colors flex items-center">
                Catégories
                <svg className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-4 space-y-2">
                  {state.categories.map(category => (
                    <Link
                      key={category.id}
                      to={`/products?category=${category.id}`}
                      className="block px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/contact"
              className={`font-medium transition-colors relative ${
                isActive('/contact') 
                  ? 'text-orange-600' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Contact
              {isActive('/contact') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-600 to-amber-600"></div>
              )}
            </Link>
      
            
        
           
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Rechercher une figurine..."
                className="w-full px-4 py-2 pl-10 pr-20 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 text-white px-4 py-1.5 rounded-full hover:bg-amber-700 transition-colors text-sm"
              >
                Rechercher
              </button>
            </form>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <div className="relative sm:static">
              <button 
                onClick={() => setShowCartPreview(!showCartPreview)}
                className="relative p-2 hover:bg-orange-50 rounded-full transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
              
              {/* Cart Preview Dropdown */}
              {showCartPreview && (
                <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(80vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-100 z-50 mx-4 sm:mx-0">
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-4">Mon Panier</h3>
                    {state.cart.length > 0 ? (
                      <>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                          {state.cart.map(item => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-800 truncate">
                                  {item.productName}
                                </p>
                                {item.selectedVariant && (
                                  <p className="text-xs text-gray-600 truncate">
                                    {item.selectedVariant}
                                  </p>
                                )}
                                <p className="text-sm font-bold text-blue-600 truncate">
                                  {item.price} DH x {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-gray-800">Total:</span>
                            <span className="font-bold text-lg sm:text-xl text-blue-600">
                              {getCartTotal().toFixed(2)} DH
                            </span>
                          </div>
                          <Link
                            to="/cart"
                            onClick={() => setShowCartPreview(false)}
                            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-colors text-center block font-medium text-sm sm:text-base"
                          >
                            Voir le panier
                          </Link>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600 text-center py-6 text-sm">Votre panier est vide</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account */}
    
            <Link to="/admin" className="p-2 hover:bg-pink-50 rounded-full transition-colors hidden sm:flex">
              <User className="w-5 h-5 text-gray-600" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Rechercher une figurine..."
              className="w-full px-4 py-3 pl-10 pr-20 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors text-sm"
            >
              Rechercher
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-amber-50 text-amber-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/products"
              
              onClick={() => setIsMenuOpen(false)}
              className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                isActive('/trips') 
                  ? 'bg-orange-50 text-orange-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Figurines
            </Link>
            
            {/* Mobile Categories */}
            <div className="space-y-2">
              <div className="py-3 px-4 font-medium text-gray-900">Catégories</div>
              {state.categories.map(category => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 px-8 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                isActive('/contact') 
                  ? 'bg-orange-50 text-orange-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Contact
            </Link>
                <Link
              to="/cart"
              className={`font-medium transition-colors relative ${
                isActive('/cart') 
                  ? 'text-orange-600' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Panier ({getCartItemsCount()})
              {isActive('/cart') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-600 to-amber-600"></div>
              )}
            </Link>
              <Link
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                isActive('/products') 
                  ? 'bg-orange-50 text-orange-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Admin
            </Link>

            
            
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;