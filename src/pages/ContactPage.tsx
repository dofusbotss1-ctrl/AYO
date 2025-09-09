import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, Star, Award, Shield, Truck, ShoppingCart, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ContactMessage } from '../types';

const ContactPage: React.FC = () => {
  const { state, dispatch, addMessage } = useApp();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  const selectedSize = searchParams.get('size');
  const selectedDate = searchParams.get('date');
  const quantityParam = searchParams.get('quantity');
  const isCartOrder = searchParams.get('cart') === 'true';
  const prefilledMessage = searchParams.get('message');
  
  // État pour la quantité
  const [quantity, setQuantity] = useState(quantityParam ? parseInt(quantityParam) : 1);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    message: !isCartOrder && prefilledMessage ? decodeURIComponent(prefilledMessage) : 
             !isCartOrder && productId ? `Bonjour, je suis intéressé(e) par la figurine: ${
               state.products.find(p => p.id === productId)?.name || ''
             }${selectedDate ? ` - Date: ${selectedDate}` : ''}` : '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculs du panier pour l'affichage
  const cartItemsCount = state.cart.reduce((total, item) => {
    const itemQuantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
    return total + itemQuantity;
  }, 0);

  const cartTotal = state.cart.reduce((total, item) => {
    const itemQuantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
    const itemPrice = typeof item.price === 'number' && item.price > 0 ? item.price : 0;
    return total + (itemPrice * itemQuantity);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    
    // Vérifier l'adresse de livraison pour les commandes
    if ((isCartOrder || productId) && !formData.deliveryAddress.trim()) {
      alert('Veuillez renseigner votre adresse de livraison pour finaliser votre demande');
      return;
    }

    setIsSubmitting(true);

    // Calculer les données de commande
    let totalQuantity = 0;
    let totalPrice = 0;
    let productNames = '';
    let orderMessage = '';

    if (isCartOrder && state.cart.length > 0) {
      totalQuantity = cartItemsCount;
      
      totalPrice = cartTotal;
      
      productNames = state.cart.map(item => {
        const itemQuantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
        return `${item.productName} (x${itemQuantity})`;
      }).join(', ');
      
      // Message automatique pour commande panier
      orderMessage = `COMMANDE PANIER\n\nProduits commandés:\n${state.cart.map(item => 
        {
          const itemQuantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
          return `• ${item.productName} - Quantité: ${itemQuantity} - Prix: ${(item.price * itemQuantity).toFixed(2)} DH`;
        }
      ).join('\n')}\n\nTotal: ${totalPrice.toFixed(2)} DH\n\nAdresse de livraison:\n${formData.deliveryAddress}`;
    } else if (product) {
      totalQuantity = quantity;
      totalPrice = product.price * quantity;
      productNames = product.name;
      orderMessage = formData.message;
    }
    
    const newMessage: Omit<ContactMessage, 'id'> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: orderMessage || formData.message,
      deliveryAddress: formData.deliveryAddress || undefined,
      productId: productId,
      productName: productNames,
      quantity: totalQuantity,
      orderPrice: totalPrice,
      createdAt: new Date(),
      read: false,
    };

    try {
      await addMessage(newMessage);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '', deliveryAddress: '' });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi du message');
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
  

  const product = productId ? state.products.find(p => p.id === productId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-800 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white mb-6">
              <Mail className="w-5 h-5 mr-2" />
              <span className="font-medium">
                {isCartOrder ? 'Finaliser votre commande' : 'Votre figurine, notre expertise'}
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              {isCartOrder ? 'Votre Commande' : 'Contactez-nous'}
            </h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
              {isCartOrder 
                ? 'Remplissez vos informations pour finaliser votre commande de figurines' 
                : 'Besoin d\'un conseil figurine ? Notre équipe de spécialistes est à votre disposition pour vous accompagner.'
              }
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">
              {isCartOrder ? 'Finaliser la Commande' : product ? `Demande d'information figurine` : 'Contactez votre spécialiste figurine'}
            </h2>

            {isCartOrder && (
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
                        {item.selectedVariant && (
                          <p className="text-sm text-gray-600">Variante: {item.selectedVariant}</p>
                        )}
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
                        {state.cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)} DH
                      </p>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-100 rounded-lg">
                    <span className="text-2xl font-bold text-green-600">
                      TOTAL: {state.cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)} DH
                    </span>
                  </div>
                </div>
              </div>
            )}

            {product && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                  <Star className="w-5 h-5 text-amber-500 mr-2" />
                  Figurine sélectionnée:
                </h3>
                <div className="flex items-center space-x-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl shadow-md"
                  />
                  <div>
                    <p className="font-semibold text-slate-800 text-lg">{product.name}</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {product.price} DH
                    </p>
                   <p className="text-sm text-blue-600 font-medium">
                     Quantité: {quantity}
                   </p>
                    {selectedDate && (
                      <div className="mt-2">
                        <p className="text-sm text-blue-600 font-medium">
                          Date sélectionnée: {selectedDate}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isSubmitted ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center animate-pulse">
                    <Send className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-green-600 mb-4 animate-slide-up">
                  Message envoyé avec succès !
                </h3>
                <p className="text-lg text-slate-700 mb-3 animate-slide-up-delay-1">
                  Merci pour votre demande.
                </p>
                <p className="text-slate-600 mb-10 animate-slide-up-delay-2">
                  Notre équipe vous contactera dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 animate-slide-up-delay-3 font-semibold"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations Client */}
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

                {/* Adresse de livraison */}
                {(isCartOrder || productId) && (
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
                      required={isCartOrder || productId}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300"
                      placeholder="Votre adresse complète de livraison (rue, ville, code postal)..."
                    />
                  </div>
                )}

                {/* Message seulement pour les devis produit */}
                {!isCartOrder && (
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-3">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required={!isCartOrder}
                      rows={6}
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-500 resize-none transition-all duration-300 text-base"
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white py-4 sm:py-5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-base ${
                    isCartOrder 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isCartOrder ? 'Finalisation...' : 'Envoi en cours...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>{isCartOrder ? 'Finaliser ma commande' : 'Envoyer le message'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info & Services */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                <Phone className="w-6 h-6 text-blue-600 mr-3" />
                Informations de Contact
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Adresse</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Casablanca, Maroc<br />
                      <span className="text-sm text-slate-500">Boutique de figurines</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Téléphone</h4>
                    <p className="text-slate-600">
                      +212 6XX XXX XXX<br />
                      <span className="text-sm text-slate-500">Lun-Sam 9h-19h</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Email</h4>
                    <p className="text-slate-600">
                      contact@ayofigurine.ma<br />
                      <span className="text-sm text-slate-500">Réponse sous 2h</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Horaires</h4>
                    <p className="text-slate-600">
                      Lundi - Samedi: 9h00 - 19h00<br />
                      <span className="text-sm text-slate-500">Dimanche: Sur rendez-vous</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-3xl shadow-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-8 flex items-center">
                <Award className="w-6 h-6 mr-3" />
                Nos Services Figurines
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Consultation Gratuite</h4>
                    <p className="text-amber-100">Conseil personnalisé par nos experts figurines</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Garantie Qualité</h4>
                    <p className="text-amber-100">Garantie qualité pour toutes nos figurines</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Support 24h/24</h4>
                    <p className="text-amber-100">Support client pour toutes vos commandes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-8">
                Questions Fréquentes
              </h3>
              <div className="space-y-6">
                <div className="border-l-4 border-amber-500 pl-6">
                  <h4 className="font-bold text-slate-800 mb-2">
                    Proposez-vous des figurines personnalisées ?
                  </h4>
                  <p className="text-slate-600">
                    Oui, nous créons des figurines personnalisées selon vos envies et votre budget.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-6">
                  <h4 className="font-bold text-slate-800 mb-2">
                    Quelle est votre politique de retour ?
                  </h4>
                  <p className="text-slate-600">
                    Retour gratuit sous 14 jours si la figurine ne vous convient pas.
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-6">
                  <h4 className="font-bold text-slate-800 mb-2">
                    Proposez-vous différentes finitions ?
                  </h4>
                  <p className="text-slate-600">
                    Oui, nous proposons des figurines brutes ou peintes selon vos préférences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;