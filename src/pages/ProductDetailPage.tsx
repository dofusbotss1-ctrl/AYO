import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, Package, Truck, Shield, ShoppingCart, Plus, Minus, Send, X, User, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, addToCart, addMessage } = useApp();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
  });

  const product = state.products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Produit non trouvé</h2>
          <Link to="/products" className="text-pink-600 hover:text-pink-700">
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const category = state.categories.find(c => c.id === product.category);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Vérifier si une taille est requise
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Veuillez sélectionner une taille avant d\'ajouter au panier');
      return;
    }
    
    addToCart(product, selectedSize || '', quantity);
    alert(`${product.name} ajouté au panier !`);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.deliveryAddress) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);

    // Message automatique pour devis produit
    const quoteMessage = `DEMANDE DE DEVIS\n\nProduit demandé:\n• ${product?.name} - Quantité: ${quantity} - Prix unitaire: ${product?.price} DH\n\nPrix total: ${((product?.price || 0) * quantity).toFixed(2)} DH\n\n${selectedSize ? `Taille sélectionnée: ${selectedSize}\n\n` : ''}Adresse de livraison:\n${formData.deliveryAddress}`;
    
    const newMessage = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: quoteMessage,
      deliveryAddress: formData.deliveryAddress,
      productId: product?.id,
      productName: product?.name,
      quantity: quantity,
      orderPrice: (product?.price || 0) * quantity,
      orderStatus: 'pending' as const,
      createdAt: new Date(),
      read: false,
    };

    try {
      await addMessage(newMessage);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', deliveryAddress: '' });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi de la demande de devis');
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
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-pink-600">Accueil</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-pink-600">Produits</Link>
          <span>/</span>
          <span>{category?.name}</span>
          <span>/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
              <div className="aspect-square">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-pink-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-pink-600 font-medium">
                  {category?.name}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              <div className="mb-4">
                {product.discount ? (
                  <div>
                    <div className="text-lg text-gray-500 line-through mb-1">
                      Prix original: {product.originalPrice} DH
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl font-bold text-blue-600">
                        {product.price} DH
                      </div>
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{product.discount}% DE RÉDUCTION
                      </div>
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      Vous économisez {((product.originalPrice || 0) - product.price).toFixed(2)} DH
                    </div>
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-blue-600">
                    {product.price} DH
                  </div>
                )}
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? 'En stock' : 'Rupture de stock'}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
              {product.descriptionImage && (
                <div className="mt-4">
                  <img
                    src={product.descriptionImage}
                    alt="Description détaillée"
                    className="w-full max-w-md rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Détails de la Chaussure</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.weight && (
                  <div>
                    <span className="text-sm text-gray-500">Matériau:</span>
                    <p className="font-medium">{product.weight}</p>
                  </div>
                )}
                {product.type && (
                  <div>
                    <span className="text-sm text-gray-500">Style:</span>
                    <p className="font-medium">{product.type}</p>
                  </div>
                )}
                {product.packaging && (
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">Accessoires inclus:</span>
                    <p className="font-medium">{product.packaging}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sizes Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Tailles Disponibles</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => size.available && setSelectedSize(size.size)}
                      className={`p-3 text-center border-2 rounded-lg transition-all duration-300 ${
                        size.available
                          ? selectedSize === size.size
                            ? 'border-orange-500 bg-orange-500 text-white shadow-lg'
                            : 'border-orange-200 hover:border-orange-500 hover:bg-orange-50 cursor-pointer'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!size.available}
                    >
                      <div className="font-semibold">{size.size}</div>
                      {size.stock !== undefined && (
                        <div className="text-xs text-gray-500 mt-1">
                          {size.available ? `${size.stock} dispo` : 'Épuisé'}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-orange-800 font-medium">
                      Taille sélectionnée: <span className="font-bold">{selectedSize}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quantité</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold text-gray-800 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Caractéristiques</h3>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Ajouter au Panier</span>
              </button>
              <button
                onClick={() => {
                  if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                    alert('Veuillez sélectionner une taille avant de demander un devis');
                    return;
                  }
                  setShowQuoteModal(true);
                }}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:from-orange-700 hover:to-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Demander un Devis</span>
              </button>
              <button className="w-full border-2 border-orange-500 text-orange-500 py-4 rounded-xl font-medium hover:bg-orange-500 hover:text-white transition-colors">
                Ajouter aux Favoris
              </button>
            </div>

            {/* Service Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Livraison dans tout le Maroc</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Emballage soigné inclus</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Garantie qualité</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Modal */}
        {showQuoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {!isSubmitted ? (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">
                        Demander un devis
                      </h2>
                      <button
                        onClick={() => setShowQuoteModal(false)}
                        className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Product Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
                        <Package className="w-5 h-5 text-blue-600 mr-2" />
                        Produit sélectionné
                      </h3>
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-sm text-gray-600">Prix unitaire: {product.price.toFixed(2)} DH</p>
                          <p className="text-sm font-bold text-blue-600">Quantité: {quantity}</p>
                          {selectedSize && (
                            <p className="text-sm text-blue-600">Taille: {selectedSize}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">
                            Total: {(product.price * quantity).toFixed(2)} DH
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quote Form */}
                    <form onSubmit={handleQuoteSubmit} className="space-y-6">
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
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Envoi en cours...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-6 h-6" />
                            <span>Envoyer la demande de devis</span>
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
                    Demande de devis envoyée !
                  </h3>
                  <p className="text-lg text-slate-700 mb-3">
                    Merci pour votre demande de devis.
                  </p>
                  <p className="text-slate-600 mb-8">
                    Notre équipe vous contactera dans les plus brefs délais avec votre devis personnalisé.
                  </p>
                  <button
                    onClick={() => {
                      setShowQuoteModal(false);
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

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Produits Similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {state.products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="text-lg font-bold text-orange-600">
                      {relatedProduct.price} DH
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;