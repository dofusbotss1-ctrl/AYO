import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  MessageSquare, 
  LogOut,
  Settings,
  Home,
  Users,
  TrendingUp,
  ShoppingBag,
  Send,
  CheckCircle,
  XCircle,
  Star,
  Eye,
  Heart,
  Menu,
  X,
  DollarSign,
  PieChart,
  Truck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DashboardPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/admin');
  };

  const sidebarItems = [
    { 
      path: '/admin/dashboard', 
      icon: LayoutDashboard, 
      label: 'Tableau de bord',
      exact: true
    },
    { 
      path: '/admin/dashboard/trips', 
      icon: Package, 
      label: 'Produit' 
    },
    { 
      path: '/admin/dashboard/categories', 
      icon: FolderOpen, 
      label: 'Catégories' 
    },
    { 
      path: '/admin/dashboard/financial', 
      icon: DollarSign, 
      label: 'Gestion Financière' 
    },
    { 
      path: '/admin/dashboard/orders', 
      icon: ShoppingBag, 
      label: 'Commandes',
      badge: state.messages.filter(m => !m.read).length
    },
    { 
      path: '/admin/dashboard/settings', 
      icon: Settings, 
      label: 'Paramètres' 
    },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const stats = [
    {
      title: 'Total Figurines',
      value: state.products ? state.products.length : 0,
      icon: Package,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Catégories',
      value: state.categories ? state.categories.length : 0,
      icon: FolderOpen,
      gradient: 'from-cyan-500 to-teal-600',
      bgGradient: 'from-cyan-50 to-teal-50'
    },
    {
      title: 'Chiffre d\'Affaires',
      value: `${state.revenues ? state.revenues.reduce((sum, r) => sum + r.amount, 0) : 0} DH`,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Bénéfice Net',
      value: `${(() => {
        const totalRevenue = state.revenues ? state.revenues.reduce((sum, r) => sum + r.amount, 0) : 0;
        const totalCharges = state.charges ? state.charges.reduce((sum, c) => sum + c.amount, 0) : 0;
        const totalInvestments = state.investments ? state.investments.reduce((sum, i) => sum + i.amount, 0) : 0;
        return totalRevenue - totalCharges - totalInvestments;
      })()} DH`,
      icon: DollarSign,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      title: 'Commandes',
      value: state.messages ? state.messages.length : 0,
      icon: ShoppingBag,
      gradient: 'from-teal-500 to-green-600',
      bgGradient: 'from-teal-50 to-green-50'
    },
  ];

  const isDashboardHome = location.pathname === '/admin/dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-30 border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 py-8 bg-gradient-to-br from-amber-900 to-orange-900">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Link
                  to="/"
                  className="p-2 text-amber-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  title="Retour à l'accueil"
                >
                  <Home className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-amber-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-300"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="lg:hidden p-2 text-amber-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="px-8 py-6 bg-gradient-to-r from-orange-600 to-amber-600 border-b border-slate-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-lg font-bold text-white">{state.user.username}</p>
                <p className="text-amber-100 font-medium">Administrateur</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8 space-y-3">
            {sidebarItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive(item.path, item.exact)
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg transform scale-105'
                    : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-amber-50 hover:text-amber-600'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className={`w-6 h-6 mr-4 ${
                    isActive(item.path, item.exact) ? 'text-white' : 'group-hover:text-amber-600'
                  }`} />
                  <span className="font-semibold text-lg">{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-sm rounded-full px-3 py-1 min-w-[1.5rem] text-center font-bold shadow-lg">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
      </div>

      {/* Main content */}
      <div className="lg:ml-72">
        <div className="px-10 py-8">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 pt-20">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-lg font-bold text-slate-800 mb-1">Optique</h1>
                  <h1 className="text-lg font-bold text-slate-800 mb-1">AYO Figurine</h1>
                  <h2 className="text-2xl font-bold text-slate-800">Administration</h2>
                  <p className="text-slate-600 mt-1">Boutique de Figurines</p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Link
                    to="/"
                    className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-300"
                    title="Retour à l'accueil"
                  >
                    <Home className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                    title="Déconnexion"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Cards */}
          <div className="lg:hidden mb-8">
            <div className="grid grid-cols-2 gap-4">
              {sidebarItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isActive(item.path, item.exact)
                      ? 'ring-2 ring-amber-500 bg-gradient-to-br from-amber-50 to-orange-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isActive(item.path, item.exact)
                        ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className={`font-semibold ${
                      isActive(item.path, item.exact) ? 'text-amber-600' : 'text-slate-700'
                    }`}>
                      {item.label}
                    </span>
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {isDashboardHome ? (
            <>
              {/* Dashboard Header */}
              <div className="mb-12 hidden lg:block">
                <h1 className="text-4xl font-bold text-slate-800 mb-4">
                  Tableau de Bord
                </h1>
                <p className="text-xl text-slate-600">
                  Vue d'ensemble de votre boutique AYO Figurine
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-12">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
                          {stat.title}
                        </p>
                        <p className="text-2xl lg:text-3xl font-bold text-slate-800">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className={`w-6 h-6 lg:w-8 lg:h-8 text-amber-600`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
                {/* Recent Products */}
                <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                  <div className="flex items-center mb-8">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <Package className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-800">
                      Figurines Récentes
                    </h3>
                  </div>
                  <div className="space-y-6">
                    {(state.products || []).slice(0, 5).map(product => (
                      <div key={product.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl hover:shadow-md transition-all duration-300">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-2xl shadow-md"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-slate-800 line-clamp-1 text-sm lg:text-lg">
                            {product.name}
                          </p>
                          <p className="text-slate-600 text-sm">
                            {product.discount ? (
                              <span>
                                <span className="line-through text-slate-400">{product.originalPrice} DH</span>
                                <span className="text-amber-600 font-bold ml-2">{product.price} DH</span>
                              </span>
                            ) : (
                              `${product.price} DH`
                            )}
                          </p>
                        </div>
                        <span className={`px-2 py-1 lg:px-3 lg:py-2 rounded-xl text-xs lg:text-sm font-bold ${
                          product.inStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'En Stock' : 'Rupture'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/admin/dashboard/trips"
                    className="block text-center bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3 lg:py-4 rounded-2xl mt-8 hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm lg:text-base"
                  >
                    Voir toutes les figurines
                  </Link>
                </div>

                {/* Recent Messages */}
                <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                  <div className="flex items-center mb-8">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-800">
                      Commandes Récentes
                    </h3>
                  </div>
                  <div className="space-y-6">
                    {(state.messages || []).slice(0, 5).map(message => (
                      <div key={message.id} className="border-l-4 border-orange-500 pl-6 p-4 bg-gradient-to-r from-slate-50 to-orange-50 rounded-r-2xl hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-slate-800 text-sm lg:text-lg">
                            {message.name}
                          </p>
                          {!message.read && (
                            <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
                          )}
                        </div>
                        <div className="text-slate-600 mb-2 text-sm">
                          {message.productName && (
                            <p className="font-medium text-emerald-600">
                              📦 {message.productName} {message.quantity && `(x${message.quantity})`}
                            </p>
                          )}
                          {message.orderPrice && (
                            <p className="font-bold text-green-600">
                              💰 {message.orderPrice} DH
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                          {message.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/admin/dashboard/orders"
                    className="block text-center bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold py-3 lg:py-4 rounded-2xl mt-8 hover:from-orange-700 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm lg:text-base"
                  >
                    Voir toutes les commandes
                  </Link>
                </div>

                {/* Order Status */}
                <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                  <div className="flex items-center mb-8">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-800">
                      Commandes de Figurines
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl hover:shadow-md transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
                        <span className="text-sm lg:text-lg font-bold text-blue-700">Confirmées</span>
                      </div>
                      <span className="text-xl lg:text-2xl font-bold text-amber-600">
                        {state.messages ? state.messages.filter(m => m.orderStatus === 'confirmed').length : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl hover:shadow-md transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <Truck className="w-5 h-5 lg:w-6 lg:h-6 text-green-500" />
                        <span className="text-sm lg:text-lg font-bold text-green-700">Livrées</span>
                      </div>
                      <span className="text-xl lg:text-2xl font-bold text-green-600">
                        {state.messages ? state.messages.filter(m => m.orderStatus === 'delivered').length : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl hover:shadow-md transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <XCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-500" />
                        <span className="text-sm lg:text-lg font-bold text-red-700">Annulées</span>
                      </div>
                      <span className="text-xl lg:text-2xl font-bold text-red-600">
                        {state.messages ? state.messages.filter(m => m.orderStatus === 'cancelled').length : 0}
                      </span>
                    </div>
                    <div className="pt-6 border-t-2 border-slate-200">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl">
                          <span className="text-sm lg:text-lg font-bold text-slate-700">Total CA : </span>
                          <span className="text-xl lg:text-2xl font-bold text-amber-600">
                            {state.messages 
                              ? state.messages.filter(m => m.orderStatus === 'delivered' && m.orderPrice)
                                .reduce((total, m) => total + (m.orderPrice || 0), 0) : 0} DH
                          </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;