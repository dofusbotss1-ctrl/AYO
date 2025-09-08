import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Shield, Headphones, ArrowRight, Award, Heart, Package, Users, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
  const { state } = useApp();

  const featuredProducts = state.products ? state.products.slice(0, 8) : [];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Figurine Style */}
      <section className="relative bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-white">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                  <Package className="w-4 h-4 mr-2 text-amber-400" />
                  Nouvelles Collections 2024
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="block">AYO</span>
                  <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    Figurine
                  </span>
                  <span className="block text-3xl lg:text-4xl font-normal text-gray-300">
                    Premium Collectibles
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-lg">
                  From the pitch to anime worlds, your collection starts here. 
                  Découvrez nos figurines Football, Anime et Gadgets premium.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="group bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center transform hover:scale-105"
                >
                  Découvrir la Collection
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/custom-order"
                  className="group border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 text-center"
                >
                  Commande Personnalisée
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400">500+</div>
                  <div className="text-sm text-gray-300">Figurines</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400">1K+</div>
                  <div className="text-sm text-gray-300">Collectionneurs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400">99%</div>
                  <div className="text-sm text-gray-300">Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="relative group">
                    <img
                      src="https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg"
                      alt="Figurines collection"
                      className="w-full h-64 object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl"></div>
                  </div>
                  <div className="relative group">
                    <img
                      src="https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg"
                      alt="Figurines anime"
                      className="w-full h-48 object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl"></div>
                  </div>
                </div>
                <div className="space-y-6 mt-12">
                  <div className="relative group">
                    <img
                      src="https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg"
                      alt="Figurines football"
                      className="w-full h-48 object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl"></div>
                  </div>
                  <div className="relative group">
                    <img
                      src="https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg"
                      alt="Gadgets collection"
                      className="w-full h-64 object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir AYO Figurine ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une expertise figurine reconnue avec des services professionnels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Qualité Premium</h3>
              <p className="text-gray-600">Figurines haute qualité avec finitions exceptionnelles</p>
            </div>

            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Livraison Sécurisée</h3>
              <p className="text-gray-600">Emballage soigné pour protéger vos figurines</p>
            </div>

            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Support Client</h3>
              <p className="text-gray-600">Accompagnement personnalisé pour vos commandes</p>
            </div>

            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Commandes Personnalisées</h3>
              <p className="text-gray-600">Créez vos figurines sur mesure selon vos envies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nos Catégories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez toutes nos catégories de figurines premium
            </p>
          </div>
          
          {state.categories && state.categories.length > 0 ? (
            <div className={`grid gap-8 ${
              state.categories.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
              state.categories.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {state.categories.map((category, index) => {
                // Couleurs alternées pour chaque catégorie
                const colorVariants = [
                  {
                    bg: 'from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200',
                    overlay: 'from-amber-500/10 to-orange-600/10',
                    text: 'text-amber-600'
                  },
                  {
                    bg: 'from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200',
                    overlay: 'from-orange-500/10 to-red-600/10',
                    text: 'text-orange-600'
                  },
                  {
                    bg: 'from-yellow-100 to-amber-100 hover:from-yellow-200 hover:to-amber-200',
                    overlay: 'from-yellow-500/10 to-amber-600/10',
                    text: 'text-yellow-600'
                  }
                ];
                const colors = colorVariants[index % colorVariants.length];
                
                return (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${colors.bg} transition-all duration-300 hover:scale-105 p-8 h-80`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.overlay}`}></div>
                    <div className="relative h-full flex flex-col justify-between">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white rounded-full shadow-lg group-hover:shadow-xl transition-shadow mx-auto mb-6 flex items-center justify-center">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-16 h-16 object-cover rounded-full"
                            />
                          ) : (
                            <div className="text-3xl">📦</div>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{category.name}</h3>
                        <p className="text-gray-700">
                          {category.description || `Découvrez notre collection ${category.name.toLowerCase()}`}
                        </p>
                      </div>
                      <div className="text-center">
                        <span className={`inline-flex items-center ${colors.text} font-semibold`}>
                          Découvrir <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-8 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Aucune catégorie disponible
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Les catégories seront bientôt disponibles
              </p>
              <Link
                to="/trips"
                className="inline-flex items-center bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Voir toutes les figurines
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="w-4 h-4 mr-2" />
              Sélection Premium
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nos Figurines Vedettes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre sélection de figurines les plus populaires et exceptionnelles
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link
              to="/trips"
              className="inline-flex items-center bg-gradient-to-r from-amber-600 to-orange-600 text-white px-10 py-4 rounded-full font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Voir Toute la Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Star className="w-4 h-4 mr-2" />
                  Notre Histoire
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Bienvenue chez AYO Figurine
                </h2>
              </div>
              
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900">AYO Figurine</strong> est votre boutique spécialisée depuis plus de 
                  <span className="font-semibold text-amber-600"> 5 ans d'expérience</span>. Nous nous engageons 
                  à vous offrir des figurines de qualité exceptionnelle avec un service premium.
                </p>
                <p>
                  Notre gamme complète comprend des 
                  <span className="font-semibold text-orange-600"> figurines Football, Anime, et Gadgets</span> pour 
                  tous les collectionneurs. Chaque pièce est sélectionnée pour sa qualité et son authenticité.
                </p>
                <p>
                  Chez AYO Figurine, nous croyons que les figurines doivent être 
                  <span className="font-semibold text-amber-600"> authentiques, détaillées et mémorables</span>. 
                  Notre mission est de vous accompagner pour créer la collection de vos rêves.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8">
                <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                  <div className="text-3xl font-bold text-amber-600 mb-2">5+</div>
                  <div className="text-sm font-medium text-gray-700">Années d'expérience</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
                  <div className="text-3xl font-bold text-orange-600 mb-2">99%</div>
                  <div className="text-sm font-medium text-gray-700">Clients satisfaits</div>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  to="/contact"
                  className="inline-flex items-center bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
                >
                  Nous Contacter
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <img
                    src="https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg"
                    alt="Collection figurines"
                    className="w-full h-64 object-cover rounded-2xl shadow-xl"
                  />
                  <img
                    src="https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg"
                    alt="Figurines anime"
                    className="w-full h-48 object-cover rounded-2xl shadow-xl"
                  />
                </div>
                <div className="space-y-6 mt-12">
                  <img
                    src="https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg"
                    alt="Figurines premium"
                    className="w-full h-48 object-cover rounded-2xl shadow-xl"
                  />
                  <img
                    src="https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg"
                    alt="Gadgets collection"
                    className="w-full h-64 object-cover rounded-2xl shadow-xl"
                  />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;