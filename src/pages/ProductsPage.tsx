import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const ProductsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const categoryFilter = searchParams.get('category') || '';
  const searchFilter = searchParams.get('search') || '';

  useEffect(() => {
    if (categoryFilter) {
      dispatch({ type: 'SET_CATEGORY_FILTER', payload: categoryFilter });
    }
    if (searchFilter) {
      dispatch({ type: 'SET_SEARCH', payload: searchFilter });
      setLocalSearch(searchFilter);
    }
  }, [categoryFilter, searchFilter, dispatch]);

  // Filter and sort products
  const filteredProducts = state.products
    .filter(product => {
      const matchesCategory = !state.selectedCategory || product.category === state.selectedCategory;
      const searchQuery = localSearch || state.searchQuery;
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const getCategoryName = (categoryId: string) => {
    const category = state.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Toutes les catégories';
  };

  const handleSearch = () => {
    dispatch({ type: 'SET_SEARCH', payload: localSearch });
  };

  const clearFilters = () => {
    dispatch({ type: 'SET_CATEGORY_FILTER', payload: '' });
    dispatch({ type: 'SET_SEARCH', payload: '' });
    setLocalSearch('');
    setPriceRange([0, 1000]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold">
              {state.selectedCategory ? getCategoryName(state.selectedCategory) : 'Nos Figurines'}
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Découvrez {filteredProducts.length} figurine{filteredProducts.length > 1 ? 's' : ''} 
              {state.selectedCategory ? ` dans la catégorie ${getCategoryName(state.selectedCategory)}` : ' dans notre collection'}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Rechercher des figurines..."
                  className="w-full px-6 py-4 pl-12 pr-16 rounded-full text-gray-900 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-amber-200/50 text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition-colors font-medium"
                >
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filtres
                </h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              <div className={`space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Categories */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Catégories</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => dispatch({ type: 'SET_CATEGORY_FILTER', payload: '' })}
                      className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                        !state.selectedCategory 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                          : 'hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      Toutes les catégories
                    </button>
                    {state.categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => dispatch({ type: 'SET_CATEGORY_FILTER', payload: category.id })}
                        className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                          state.selectedCategory === category.id 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                            : 'hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Prix (DH)</h4>
                  <div className="space-y-4">
                    <div className="px-4">
                      <input
                        type="range"
                        min="0"
                        max="3000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #d97706 0%, #d97706 ${(priceRange[1]/3000)*100}%, #e5e7eb ${(priceRange[1]/3000)*100}%, #e5e7eb 100%)`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm font-medium text-gray-600 px-4">
                      <span>{priceRange[0]} DH</span>
                      <span>{priceRange[1]} DH</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 3000])}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full py-3 text-amber-600 hover:text-amber-700 font-semibold border border-amber-200 hover:border-amber-300 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Effacer les filtres</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-semibold text-gray-700">Trier par:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'newest')}
                    className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
                  >
                    <option value="newest">Plus récents</option>
                    <option value="name">Nom A-Z</option>
                    <option value="price">Prix croissant</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-700 mr-2">Vue:</span>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-amber-100 text-amber-600 shadow-md' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-amber-100 text-amber-600 shadow-md' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-8 flex items-center justify-center">
                  <Filter className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Aucune figurine trouvée
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Essayez de modifier vos critères de recherche ou de filtrage
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold transform hover:scale-105"
                >
                  Voir toutes les figurines
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;