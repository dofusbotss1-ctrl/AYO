import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, MessageCircle, ArrowLeft, Send, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CartPage: React.FC = () => {
  const { state, removeFromCart, updateCartQuantity, clearCart, getCartTotal, addMessage } = useApp();
  const [showOrderForm, setShowOrderForm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [orderFormData, setOrderFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
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
    if (!orderFormData.name || !orderFormData.email || !orderFormData.phone || !orderFormData.address) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    // Générer le message de commande
    let orderMessage = `NOUVELLE COMMANDE\n\n`;
    orderMessage += `Client: ${orderFormData.name}\n`;
    orderMessage += `Email: ${orderFormData.email}\n`;
    orderMessage += `Téléphone: ${orderFormData.phone}\n`;
    orderMessage += `Adresse de livraison: ${orderFormData.address}\n\n`;
    orderMessage += `DÉTAILS DE LA COMMANDE:\n`;
    orderMessage += `========================\n\n`;
    
    state.cart.forEach((item, index) => {
      orderMessage += `${index + 1}. ${item.product.name}\n`;
      if (item.selectedVariant) {
        orderMessage += `   - Variante: ${item.selectedVariant.size || ''} ${item.selectedVariant.finish || ''}\n`;
      }
      orderMessage += `   - Quantité: ${item.quantity}\n`;
      orderMessage += `   - Prix unitaire: ${item.product.price} DH\n`;
      orderMessage += `   - Sous-total: ${(item.product.price * item.quantity).toFixed(2)} DH\n\n`;
    });
    
    orderMessage += `TOTAL DE LA COMMANDE: ${getCartTotal().toFixed(2)} DH\n\n`;
    
    if (orderFormData.message) {
      orderMessage += `Message du client:\n${orderFormData.message}\n\n`;
    }
    
    orderMessage += `Cette commande a été passée automatiquement depuis le panier.`;

    const newMessage = {
      name: orderFormData.name,
      email: orderFormData.email,
      phone: orderFormData.phone,
      message: orderMessage,
      createdAt: new Date(),
      read: false,
      orderStatus: 'pending' as const,
      orderPrice: getCartTotal()
    };

    try {
      await addMessage(newMessage);
      
      // Vider le panier après commande réussie
      clearCart();
      
      // Réinitialiser le formulaire
      setOrderFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        message: ''
      });
      
      setShowOrderForm(false);
      alert('Commande envoyée avec succès ! Nous vous contacterons bientôt pour confirmer votre commande.');
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la commande:', error);
      alert('Erreur lors de l\'envoi de la commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
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
              <button
                onClick={() => setShowOrderForm(true)}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-colors flex items-center justify-center space-x-2 font-semibold mb-4"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Commander maintenant</span>
              </button>
              
              <p className="text-sm text-gray-600 text-center">
                Remplissez vos informations pour finaliser votre commande
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Finaliser ma Commande</h2>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-orange-800 mb-3">Résumé de votre commande</h3>
                <div className="space-y-2">
                  {state.cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product.name} x{item.quantity}</span>
                      <span className="font-medium">{(item.product.price * item.quantity).toFixed(2)} DH</span>
                    </div>
                  ))}
                  <div className="border-t border-orange-300 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-orange-800">
                      <span>Total:</span>
                      <span>{getCartTotal().toFixed(2)} DH</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={orderFormData.name}
                      onChange={(e) => setOrderFormData({ ...orderFormData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={orderFormData.email}
                      onChange={(e) => setOrderFormData({ ...orderFormData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={orderFormData.phone}
                    onChange={(e) => setOrderFormData({ ...orderFormData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                    placeholder="+212 6XX XXX XXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse de livraison *
                  </label>
                  <textarea
                    value={orderFormData.address}
                    onChange={(e) => setOrderFormData({ ...orderFormData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                    placeholder="Adresse complète de livraison..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (optionnel)
                  </label>
                  <textarea
                    value={orderFormData.message}
                    onChange={(e) => setOrderFormData({ ...orderFormData, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                    placeholder="Instructions spéciales, questions..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Confirmer la Commande</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;