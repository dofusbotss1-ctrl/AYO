import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, Calendar, MapPin, Clock, ShoppingCart, Plus, Minus, Users, Plane, Star, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, addToCart } = useApp();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const trip = state.trips.find(p => p.id === id);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Voyage non trouvé</h2>
          <Link to="/trips" className="text-blue-600 hover:text-blue-700">
            Retour aux voyages
          </Link>
        </div>
      </div>
    );
  }

  const category = state.categories.find(c => c.id === trip.category);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === trip.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? trip.images.length - 1 : prev - 1
    );
  };

  const handleAddToCart = () => {
    if (!trip) return;
    
    // Vérifier si une date est requise et sélectionnée
    if (trip.availableDates && trip.availableDates.length > 0 && !selectedDate) {
      alert('Veuillez sélectionner une date de départ avant d\'ajouter au panier');
      return;
    }
    
    addToCart(trip, selectedDate, quantity);
    alert(`${trip.destination} ajouté au panier !`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600">Accueil</Link>
          <span>/</span>
          <Link to="/trips" className="hover:text-blue-600">Voyages</Link>
          <span>/</span>
          <span>{category?.name}</span>
          <span>/</span>
          <span className="text-gray-800">{trip.destination}</span>
        </nav>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
              <div className="aspect-[4/3]">
                <img
                  src={trip.images[currentImageIndex]}
                  alt={trip.destination}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {trip.images.length > 1 && (
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
            {trip.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {trip.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${trip.destination} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Trip Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-600 font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
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
                {trip.destination}
              </h1>
              <div className="mb-4">
                {trip.discount ? (
                  <div>
                    <div className="text-lg text-gray-500 line-through mb-1">
                      Prix original: {trip.originalPrice} DH
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl font-bold text-blue-600">
                        {trip.price} DH
                      </div>
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{trip.discount}% DE RÉDUCTION
                      </div>
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      Vous économisez {((trip.originalPrice || 0) - trip.price).toFixed(2)} DH
                    </div>
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-blue-600">
                    {trip.price} DH
                  </div>
                )}
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                trip.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {trip.available ? 'Disponible' : 'Complet'}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed space-y-4"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {trip.description.split('\n').map((paragraph, index) => {
                      if (paragraph.trim() === '') return null;
                      
                      // Détecter les titres (lignes qui commencent par des majuscules et se terminent par :)
                      if (paragraph.match(/^[A-Z][^:]*:$/)) {
                        return (
                          <h4 key={index} className="text-xl font-bold text-blue-800 mt-6 mb-3 flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            {paragraph.replace(':', '')}
                          </h4>
                        );
                      }
                      
                      // Détecter les listes (lignes qui commencent par - ou •)
                      if (paragraph.match(/^[-•]\s/)) {
                        return (
                          <div key={index} className="flex items-start space-x-3 ml-4">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-700">{paragraph.replace(/^[-•]\s/, '')}</p>
                          </div>
                        );
                      }
                      
                      // Paragraphes normaux
                      return (
                        <p key={index} className="text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
              {trip.descriptionImage && (
                <div className="mt-4">
                  <img
                    src={trip.descriptionImage}
                    alt="Description détaillée"
                    className="w-full max-w-2xl rounded-2xl shadow-xl border-4 border-white"
                  />
                </div>
              )}
            </div>

            {/* Trip Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Détails du Voyage</h3>
              <div className="grid grid-cols-2 gap-4">
                {trip.duration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                      <span className="text-sm text-gray-500">Durée:</span>
                      <p className="font-medium">{trip.duration}</p>
                    </div>
                  </div>
                )}
                {trip.type && (
                  <div className="flex items-center space-x-2">
                    <Plane className="w-5 h-5 text-blue-500" />
                    <div>
                      <span className="text-sm text-gray-500">Type:</span>
                      <p className="font-medium">{trip.type}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Inclus dans le prix */}
            {trip.includes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Users className="w-5 h-5 text-green-500 mr-2" />
                  Inclus dans le prix
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <ul className="space-y-2">
                    {trip.includes.split(',').map((item, index) => {
                      const trimmedItem = item.trim();
                      if (!trimmedItem) return null;
                      return (
                        <li key={index} className="flex items-center text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                          <span className="font-medium">{trimmedItem}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            {/* Activités en option */}
            {trip.optionalActivities && trip.optionalActivities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Star className="w-5 h-5 text-blue-500 mr-2" />
                  Activités en option
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <ul className="space-y-2">
                    {trip.optionalActivities.map((activity, index) => (
                      <li key={index} className="flex items-center text-blue-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="font-medium">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Le tarif ne comprend pas */}
            {trip.notIncluded && trip.notIncluded.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <X className="w-5 h-5 text-red-500 mr-2" />
                  Le tarif ne comprend pas
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <ul className="space-y-2">
                    {trip.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-center text-red-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Available Dates Selection */}
            {trip.availableDates && trip.availableDates.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Dates Disponibles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {trip.availableDates.map((dateOption, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (dateOption.available) {
                          setSelectedDate(`${dateOption.departureDate} - ${dateOption.returnDate}`);
                        }
                      }}
                      className={`p-4 text-left border-2 rounded-lg transition-all duration-300 ${
                        dateOption.available
                          ? selectedDate === `${dateOption.departureDate} - ${dateOption.returnDate}`
                            ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                            : 'border-blue-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                          : 'border-red-200 bg-red-50 text-red-600 cursor-not-allowed relative overflow-hidden'
                      }`}
                      disabled={!dateOption.available}
                    >
                      {/* Badge COMPLET pour les dates non disponibles */}
                      {!dateOption.available && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          COMPLET
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Départ: {new Date(dateOption.departureDate).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-sm mt-1">
                            Retour: {new Date(dateOption.returnDate).toLocaleDateString('fr-FR')}
                          </div>
                          {!dateOption.available && (
                            <div className="text-xs mt-2 font-medium">
                              ❌ Plus de places disponibles
                            </div>
                          )}
                        </div>
                        {dateOption.spotsLeft !== undefined && (
                          <div className="text-xs">
                            {dateOption.available ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                {dateOption.spotsLeft} places
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                                0 places
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedDate && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 font-medium">
                      Date sélectionnée: <span className="font-bold">{selectedDate}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Nombre de voyageurs</h3>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Points Forts</h3>
              <div className="flex flex-wrap gap-2">
                {trip.features.map((feature, index) => (
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
              <Link
                to={`/contact?trip=${trip.id}${selectedDate ? `&date=${encodeURIComponent(selectedDate)}` : ''}`}
                onClick={(e) => {
                  if (trip.availableDates && trip.availableDates.length > 0 && !selectedDate) {
                    e.preventDefault();
                    alert('Veuillez sélectionner une date avant de demander un devis');
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Demander un Devis</span>
              </Link>
              <button className="w-full border-2 border-blue-500 text-blue-500 py-4 rounded-xl font-medium hover:bg-blue-500 hover:text-white transition-colors">
                Ajouter aux Favoris
              </button>
            </div>

            {/* Service Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Plane className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Vols inclus dans le prix</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Annulation gratuite jusqu'à 7 jours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Guide francophone inclus</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Trips */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Voyages Similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {state.trips
              .filter(p => p.category === trip.category && p.id !== trip.id)
              .slice(0, 4)
              .map(relatedTrip => (
                <Link
                  key={relatedTrip.id}
                  to={`/trip/${relatedTrip.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={relatedTrip.images[0]}
                      alt={relatedTrip.destination}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                      {relatedTrip.destination}
                    </h3>
                    <div className="text-lg font-bold text-blue-600">
                      {relatedTrip.price} DH
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

export default TripDetailPage;