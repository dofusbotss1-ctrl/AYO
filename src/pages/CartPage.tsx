import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, MessageCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Send, X, User, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CartPage: React.FC = () => {
  const { state, removeFromCart, updateCartQuantity, clearCart, getCartTotal, addMessage } = useApp();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
  });

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartQuantity(itemId, newQuantity);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.deliveryAddress) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);

    // Calculer les données de commande
    const totalQuantity = state.cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = getCartTotal();
    const productNames = state.cart.map(item => `${item.productName} (x${item.quantity})`).join(', ');
    
    // Message automatique pour commande panier
    const orderMessage = `COMMANDE PANIER\n\nProduits commandés:\n${state.cart.map(item => 
      `• ${item.productName} - Quantité: ${item.quantity} - Prix: ${(item.price * item.quantity).toFixed(2)} DH`
    ).join('\n')}\n\nTotal: ${totalPrice.toFixed(2)} DH\n\nAdresse de livraison:\n${formData.deliveryAddress}`;
    
    const newMessage = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: orderMessage,
      deliveryAddress: formData.deliveryAddress,
      productName: productNames,
      quantity: totalQuantity,
      orderPrice: totalPrice,
      orderStatus: 'pending' as const,
      createdAt: new Date(),
      read: false,
    };

    try {
      await addMessage(newMessage);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', deliveryAddress: '' });
      // Vider le panier après commande réussie
      setTimeout(() => {
        clearCart();
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
                      {/* Product Image */}
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
                      />
                      
                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {item.productName}
                        </h3>
                        
                        {item.selectedVariant && (
                          <p className="text-sm text-gray-600 mb-2">
                            Variante: <span className="font-medium">{item.selectedVariant}</span>
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
                              {(item.price * item.quantity).toFixed(2)} DH
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.price.toFixed(2)} DH × {item.quantity}
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
              
              {/* Order Button */}
              <button
                onClick={() => setShowOrderModal(true)}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-colors flex items-center justify-center space-x-2 font-semibold mb-4"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Commander maintenant</span>
              </button>
              
              <p className="text-sm text-gray-600 text-center">
                Remplissez vos informations pour finaliser votre commande
              </p>
            </div>
          </div>
        </div>

        {/* Order Modal */}
        {showOrderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {!isSubmitted ? (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">
                        Finaliser votre commande
                      </h2>
                      <button
                        onClick={() => setShowOrderModal(false)}
                        className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Order Summary */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-4 flex items-center">
                        <ShoppingCart className="w-5 h-5 text-green-600 mr-2" />
                        Récapitulatif de votre commande
                      </h3>
                      <div className="space-y-3 mb-4">
                        {state.cart.map(item => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{item.productName}</p>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">Prix unitaire: {item.price.toFixed(2)} DH</p>
                                <p className="text-sm font-bold text-green-600">Qté: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-bold text-green-600">
                                Sous-total: {(item.price * item.quantity).toFixed(2)} DH
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-green-200 pt-3 mt-3">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="text-center p-2 bg-white rounded-lg">
                            <p className="text-sm text-gray-600">Nombre d'articles</p>
                            <p className="text-lg font-bold text-green-600">
                              {state.cart.reduce((total, item) => total + item.quantity, 0)}
                            </p>
                          </div>
                          <div className="text-center p-2 bg-white rounded-lg">
                            <p className="text-sm text-gray-600">Total à payer</p>
                            <p className="text-lg font-bold text-green-600">
                              {getCartTotal().toFixed(2)} DH
                            </p>
                          </div>
                        </div>
                        <div className="text-center p-3 bg-green-100 rounded-lg">
                          <span className="text-2xl font-bold text-green-600">
                            TOTAL: {getCartTotal().toFixed(2)} DH
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Form */}
                    <form onSubmit={handleOrderSubmit} className="space-y-6">
                      {/* Customer Information */}
                      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                        <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2" />
                          Vos informations
                        </h3>
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                              Nom complet *
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                              placeholder="Votre nom complet"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                              Email *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                              placeholder="votre@email.com"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                            Numéro de téléphone *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                            placeholder="+212 6XX XXX XXX"
                          />
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                        <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center">
                          <MapPin className="w-5 h-5 mr-2" />
                          Adresse de livraison
                        </h3>
                        <textarea
                          id="deliveryAddress"
                          name="deliveryAddress"
                          value={formData.deliveryAddress}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300"
                          placeholder="Votre adresse complète de livraison (rue, ville, code postal)..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Finalisation...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-6 h-6" />
                            <span>Finaliser ma commande</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                /* Success Message */
                <div className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <Send className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-green-600 mb-4">
                    Commande envoyée avec succès !
                  </h3>
                  <p className="text-lg text-slate-700 mb-3">
                    Merci pour votre commande.
                  </p>
                  <p className="text-slate-600 mb-8">
                    Notre équipe vous contactera dans les plus brefs délais pour confirmer votre commande.
                  </p>
                  <button
                    onClick={() => {
                      setShowOrderModal(false);
                      setIsSubmitted(false);
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;