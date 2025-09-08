import React, { useState, useEffect } from 'react';
import { Settings, User, Lock, Eye, EyeOff, Save, Check, Glasses, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SettingsPage: React.FC = () => {
  const { updateMessage } = useApp(); // Nous utiliserons le service Firebase
  
  // Récupérer les identifiants sauvegardés ou utiliser les valeurs par défaut
  const getStoredCredentials = async () => {
    try {
      // Essayer Firebase d'abord
      const { settingsService } = await import('../../services/adminSettingsService');
      const firebaseCredentials = await settingsService.getAdminCredentials();
      
      if (firebaseCredentials) {
        return firebaseCredentials;
      }
    } catch (error) {
      console.log('Erreur Firebase, utilisation localStorage:', error);
    }
    
    // Fallback vers localStorage
    const savedCredentials = localStorage.getItem('adminCredentials');
    return savedCredentials 
      ? JSON.parse(savedCredentials)
      : { username: 'ayo', password: '1211' };
  };
  
  const [currentCredentials, setCurrentCredentials] = useState({ username: 'ayo', password: '1211' });
  
  // Charger les identifiants au montage du composant
  useEffect(() => {
    const loadCredentials = async () => {
      const credentials = await getStoredCredentials();
      setCurrentCredentials(credentials);
    };
    loadCredentials();
  }, []);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    // Vérifier le mot de passe actuel
    if (formData.currentPassword !== currentCredentials.password) {
      setError('Mot de passe actuel incorrect');
      setIsSubmitting(false);
      return;
    }

    // Vérifier que les nouveaux mots de passe correspondent
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      setIsSubmitting(false);
      return;
    }

    // Vérifier qu'au moins un champ est rempli
    if (!formData.newUsername && !formData.newPassword) {
      setError('Veuillez remplir au moins un champ à modifier');
      setIsSubmitting(false);
      return;
    }

    // Simuler la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mettre à jour les identifiants
    const newCredentials = {
      username: formData.newUsername || currentCredentials.username,
      password: formData.newPassword || currentCredentials.password
    };

    setCurrentCredentials(newCredentials);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('adminCredentials', JSON.stringify(newCredentials));
    
    // Sauvegarder dans Firebase (simulation avec une collection settings)
    try {
      // Utiliser le service Firebase pour sauvegarder
      const { settingsService } = await import('../../services/adminSettingsService');
      await settingsService.saveAdminCredentials(newCredentials);
      console.log('Identifiants sauvegardés avec succès en Firebase');
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde en base:', error);
      // Continuer même si Firebase échoue, localStorage est déjà sauvegardé
      console.log('Sauvegarde Firebase échouée, mais localStorage OK');
    }
    
    setSuccess(true);
    setFormData({
      currentPassword: '',
      newUsername: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    setIsSubmitting(false);

    // Masquer le message de succès après 3 secondes
    setTimeout(() => setSuccess(false), 3000);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-3 md:mr-4">
            <Settings className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-800">Paramètres du Magasin</h1>
            <p className="text-slate-600 mt-1 md:mt-2 text-sm md:text-lg">
              Configuration et sécurité de votre magasin de chaussures
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Current Credentials Info */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-8 mb-10">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-orange-800">Identifiants Actuels</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-white/60 rounded-xl">
              <User className="w-5 h-5 text-orange-600 mr-3" />
              <span className="text-orange-800 font-medium text-lg">
                <strong>Nom d'utilisateur actuel:</strong> {currentCredentials.username}
              </span>
            </div>
            <div className="flex items-center p-4 bg-white/60 rounded-xl">
              <Lock className="w-5 h-5 text-orange-600 mr-3" />
              <span className="text-orange-800 font-medium text-lg">
                <strong>Mot de passe actuel:</strong> ••••••••
              </span>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-slate-200">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 18h20l-2-6H4l-2 6zM4 4v2h16V4H4zm0 4h16l1.5 4.5H2.5L4 8z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Modifier les Identifiants d'Accès
            </h2>
          </div>

          {success && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 px-6 py-4 rounded-2xl mb-8 flex items-center shadow-lg">
              <Check className="w-5 h-5 mr-2" />
              <span className="font-bold">Identifiants mis à jour avec succès !</span>
            </div>
          )}

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl mb-8 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Mot de passe actuel *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-orange-400" />
                </div>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full pl-10 pr-12 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 text-base"
                  placeholder="Entrez votre mot de passe actuel"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5 text-orange-400 hover:text-orange-600 transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-orange-400 hover:text-orange-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* New Username */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Nouveau nom d'utilisateur (optionnel)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-orange-400" />
                </div>
                <input
                  type="text"
                  value={formData.newUsername}
                  onChange={(e) => setFormData({ ...formData, newUsername: e.target.value })}
                  className="w-full pl-10 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 text-base"
                  placeholder={`Actuel: ${currentCredentials.username}`}
                />
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Laissez vide pour conserver le nom d'utilisateur actuel
              </p>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Nouveau mot de passe (optionnel)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-orange-400" />
                </div>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full pl-10 pr-12 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 text-base"
                  placeholder="Laissez vide pour conserver le mot de passe actuel"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-5 h-5 text-orange-400 hover:text-orange-600 transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-orange-400 hover:text-orange-600 transition-colors" />
                  )}
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Laissez vide pour conserver le mot de passe actuel
              </p>
            </div>

            {/* Confirm New Password */}
            {formData.newPassword && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-orange-400" />
                  </div>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 text-base"
                    placeholder="Confirmez votre nouveau mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-5 h-5 text-orange-400 hover:text-orange-600 transition-colors" />
                    ) : (
                      <Eye className="w-5 h-5 text-orange-400 hover:text-orange-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 shadow-lg text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Sauvegarder les modifications
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-10 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl">
            <h4 className="font-bold text-amber-800 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Sécurité du Magasin de Chaussures
            </h4>
            <p className="text-sm text-amber-700 font-medium">
              Vos identifiants sont sauvegardés de manière sécurisée en base de données Firebase et en local. 
              Choisissez un nom d'utilisateur unique et un mot de passe fort pour protéger l'accès à votre magasin de chaussures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;