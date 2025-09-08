import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, MessageCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CartPage: React.FC = () => {
  const { state, removeFromCart, updateCartQuantity, clearCart, getCartTotal } = useApp();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartQuantity(itemId, newQuantity);
    }
  };

  const generateCartMessage = () => {
    if (state.cart.length === 0) return '';
    
    let message = 'Bonjour, je souhaite réserver les voyages suivants :\n\n';
    
    state.cart.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}`;
      if (item.selectedVariant) {
        message += ` - Variante: ${item.selectedVariant.size || ''} ${item.selectedVariant.finish || ''}`;
      }
      message += ` - Quantité: ${item.quantity} - Prix: ${item.product.price * item.quantity} DH\n`;
    });
    
    message += `\nTotal: ${getCartTotal()} DH\n\nMerci de me contacter pour finaliser la commande.`;
    
    return encodeURIComponent(message);
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-16">
              <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-8" />
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Votre panier est vide
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Découvrez nos figurines et ajoutez vos préférées
              </p>
              <Link
                to="/products"
                className="inline-flex items-center bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-colors font-semibold space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Découvrir nos figurines</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/products"
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continuer mes achats</span>
            </Link>
          </div>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Vider le panier
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">
                  Mon Panier ({state.cart.length} figurine{state.cart.length > 1 ? 's' : ''})
                </h1>
              </div>
              
              <div className="divide-y divide-gray-200">
                {state.cart.map(item => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      {/* Trip Image */}
                      <Link to={`/product/${item.product.id}`}>
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
                        />
                      </Link>
                      
                      {/* Trip Info */}
                      <div className="flex-1">
                        <Link 
                          to={`/product/${item.product.id}`}
                          className="block hover:text-orange-600 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {item.product.name}
                          </h3>
                        </Link>
                        
                        {item.selectedVariant && (
                          <p className="text-sm text-gray-600 mb-2">
                            Variante: <span className="font-medium">
                              {item.selectedVariant.size && `${item.selectedVariant.size}`}
                              {item.selectedVariant.finish && ` - ${item.selectedVariant.finish}`}
                            </span>
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-md transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-md transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-orange-600">
                              {(item.product.price * item.quantity).toFixed(2)} DH
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.product.price.toFixed(2)} DH × {item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Résumé de la commande
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{getCartTotal().toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de service</span>
                  <span className="font-medium text-green-600">Inclus</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {getCartTotal().toFixed(2)} DH
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Reservation Button */}
              <Link
                to={`/contact?cart=true&message=${generateCartMessage()}`}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-colors flex items-center justify-center space-x-2 font-semibold mb-4"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Commander maintenant</span>
              </Link>
              
              <p className="text-sm text-gray-600 text-center">
                Vous serez redirigé vers notre formulaire de contact avec le détail de votre commande
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;