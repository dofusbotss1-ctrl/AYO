import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Glasses, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { settingsService } from '../../services/firebaseService';

const LoginPage: React.FC = () => {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Essayer de récupérer depuis Firebase d'abord
      const { settingsService } = await import('../../services/firebaseService');
      let adminCredentials = await settingsService.getAdminCredentials();
      
      if (!adminCredentials) {
        console.log('Utilisation des identifiants localStorage');
        const savedCredentials = localStorage.getItem('adminCredentials');
        adminCredentials = savedCredentials 
          ? JSON.parse(savedCredentials)
          : { username: 'ayo', password: '1211' };
      }

      if (credentials.username === adminCredentials.username && credentials.password === adminCredentials.password) {
        dispatch({ type: 'LOGIN', payload: credentials.username });
        navigate('/admin/dashboard');
      } else {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des identifiants:', error);
      setError('Erreur de connexion, veuillez réessayer');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      {/* Bouton Home */}
      <div className="fixed top-6 left-6 z-10">
        <a
          href="/"
          className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm text-blue-600 px-4 py-3 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 font-medium shadow-md"
        >
          <Home className="w-5 h-5" />
          <span className="hidden sm:inline">Accueil</span>
        </a>
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 18h20l-2-6H4l-2 6zM4 4v2h16V4H4zm0 4h16l1.5 4.5H2.5L4 8z"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Administration VoyagePro</h1>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-3">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300"
                    placeholder="Entrez votre nom d'utilisateur"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-3">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300"
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-blue-400 hover:text-blue-600 transition-colors" />
                    ) : (
                      <Eye className="w-5 h-5 text-blue-400 hover:text-blue-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Se connecter
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;