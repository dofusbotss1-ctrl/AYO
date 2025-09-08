import React, { useState } from 'react';
import { Upload, Send, Package, Star, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CustomOrderPage: React.FC = () => {
  const { addCustomOrder } = useApp();
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    referenceImages: ['', '', '']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.description || !formData.customerName || !formData.customerEmail) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    const customOrder = {
      category: formData.category,
      description: formData.description,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      referenceImages: formData.referenceImages.filter(img => img.trim()),
      status: 'pending' as const,
      createdAt: new Date()
    };

    try {
      await addCustomOrder(customOrder);
      setIsSubmitted(true);
      setFormData({
        category: '',
        description: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        referenceImages: ['', '', '']
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi de la commande personnalisée');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.referenceImages];
    newImages[index] = value;
    setFormData({ ...formData, referenceImages: newImages });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-black py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white mb-6">
              <Package className="w-5 h-5 mr-2" />
              <span className="font-medium">Commande sur mesure</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Créez Votre Figurine Unique
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Donnez vie à vos idées avec nos figurines personnalisées. 
              Football, Anime ou tout autre univers, nous créons la figurine de vos rêves.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {isSubmitted ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-green-600 mb-6">
                Commande Reçue !
              </h2>
              <p className="text-xl text-gray-700 mb-4">
                Merci pour votre commande personnalisée.
              </p>
              <p className="text-gray-600 mb-8">
                Notre équipe va étudier votre demande et vous contacter sous 24h pour discuter des détails et du devis.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Nouvelle Commande
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-10">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Formulaire de Commande Personnalisée
                  </h2>
                  <p className="text-blue-100">
                    Décrivez votre figurine idéale et nous la créerons pour vous
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="px-8 py-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      Catégorie *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'football', name: 'Football', icon: '⚽', desc: 'Joueurs, équipes, trophées' },
                        { id: 'anime', name: 'Anime', icon: '🎌', desc: 'Personnages, scènes iconiques' },
                        { id: 'other', name: 'Autre', icon: '🎨', desc: 'Votre idée personnalisée' }
                      ].map(category => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: category.id })}
                          className={`p-6 border-2 rounded-xl transition-all duration-300 text-left ${
                            formData.category === category.id
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <div className="text-3xl mb-3">{category.icon}</div>
                          <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Description détaillée *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                      placeholder="Décrivez votre figurine en détail : personnage, pose, taille souhaitée, couleurs, accessoires, etc."
                      required
                    />
                  </div>

                  {/* Reference Images */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Images de référence (optionnel)
                    </label>
                    <p className="text-sm text-gray-600 mb-4">
                      Ajoutez jusqu'à 3 images pour nous aider à mieux comprendre votre vision
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {formData.referenceImages.map((image, index) => (
                        <div key={index} className="space-y-3">
                          <input
                            type="url"
                            value={image}
                            onChange={(e) => updateImage(index, e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                            placeholder={`URL image ${index + 1}`}
                          />
                          {image && (
                            <img
                              src={image}
                              alt={`Référence ${index + 1}`}
                              className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                      placeholder="+212 6XX XXX XXX"
                    />
                  </div>

                  {/* Process Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-bold text-blue-800 mb-4 flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      Processus de Commande
                    </h3>
                    <div className="space-y-3 text-sm text-blue-700">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                        <p><strong>Étude :</strong> Nous analysons votre demande sous 24h</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                        <p><strong>Devis :</strong> Nous vous envoyons un devis détaillé</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                        <p><strong>Production :</strong> Création de votre figurine (7-14 jours)</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                        <p><strong>Livraison :</strong> Réception de votre figurine unique</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transform hover:scale-105 shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        <span>Envoyer ma Commande Personnalisée</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomOrderPage;