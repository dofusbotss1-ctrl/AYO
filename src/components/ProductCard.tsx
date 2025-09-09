import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, MessageCircle, Star, ShoppingCart, Package } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Si le produit a des tailles, rediriger vers la page de détail
    if (product.sizes && product.sizes.length > 0) {
      window.location.href = `/product/${product.id}`;
      return;
    }
    
    // Sinon, ajouter directement au panier
    addToCart(product, '', 1);
    alert(`${product.name} ajouté au panier !`);
  };

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden">
        <div className="aspect-square bg-gray-100">
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Discount badge */}
        {product.discount && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{product.discount}%
          </div>
        )}

        {/* Stock status */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
          product.inStock 
            ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
            : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
        }`}>
          {product.inStock ? 'En Stock' : 'Rupture'}
        </div>

        {/* Image indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick actions overlay */}
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <Link 
              to={`/product/${product.id}`}
              className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 transform hover:scale-110"
            >
              <Eye className="w-5 h-5 text-gray-700" />
            </Link>
            <Link
              to={`/contact?product=${product.id}`}
              className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Product name and rating */}
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors group-hover:text-blue-600 flex items-center">
              <Package className="w-4 h-4 mr-1 text-blue-500" />
              {product.name}
            </h3>
          </Link>
          
          {/* Fake rating for demo */}
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-sm text-gray-500 ml-2">(4.0)</span>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {product.description.split('\n')[0]}
          </p>
        </div>

        {/* Size and finish info */}
        {product.size && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Taille: {product.size}</span>
            {product.finish && (
              <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                {product.finish === 'painted' ? 'Peinte' : 'Brute'}
              </span>
            )}
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {product.features.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-2 py-1 rounded-full font-medium"
            >
              {feature}
            </span>
          ))}
          {product.features.length > 2 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{product.features.length - 2}
            </span>
          )}
        </div>

        {/* Variants preview */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1 mb-2">
              <span className="text-xs text-gray-500 mr-2">Variantes:</span>
              {product.variants.slice(0, 2).map((variant, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    variant.available 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                      : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
                  }`}
                >
                  {variant.size} - {variant.finish === 'painted' ? 'Peinte' : 'Brute'}
                </span>
              ))}
              {product.variants.length > 2 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{product.variants.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price and action */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            {product.discount ? (
              <div>
                <div className="text-sm text-gray-500 line-through">
                  {product.originalPrice} DH
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {product.price} DH
                </div>
              </div>
            ) : (
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {product.price} DH
              </div>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={(product.stock || 0) === 0}
            className={`group/btn px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 transform shadow-lg ${
              (product.stock || 0) === 0
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:scale-105 hover:shadow-xl'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="font-medium">
              {(product.stock || 0) === 0 ? 'Rupture' : 'Ajouter'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;