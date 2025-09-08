import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Package, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

const ProductsPage: React.FC = () => {
  const { state, dispatch, addProduct, updateProduct, deleteProduct } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    category: '',
    features: '',
    images: [''],
    descriptionImage: '',
    useImageDescription: false,
    inStock: true,
    size: '',
    finish: 'raw' as 'raw' | 'painted',
    baseStyle: '',
    variants: [] as any[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des données
    if (!formData.name.trim() || !formData.description.trim() || !formData.price || !formData.category) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (parseFloat(formData.price) <= 0) {
      alert('Le prix doit être supérieur à 0');
      return;
    }
    
    const validImages = formData.images.filter(img => img.trim());
    if (validImages.length === 0) {
      alert('Veuillez ajouter au moins une image');
      return;
    }
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      discount: formData.discount ? parseFloat(formData.discount) : null,
      category: formData.category,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      images: validImages,
      inStock: formData.inStock,
      createdAt: editingProduct?.createdAt || new Date(),
      size: formData.size,
      finish: formData.finish,
      baseStyle: formData.baseStyle,
      variants: formData.variants,
    };

    // Ajouter descriptionImage seulement si nécessaire
    if (formData.useImageDescription && formData.descriptionImage) {
      productData.descriptionImage = formData.descriptionImage;
    }

    const saveProduct = async () => {
      try {
        console.log('Tentative de sauvegarde de la figurine:', productData);
        if (editingProduct) {
          await updateProduct(editingProduct.id, productData);
          console.log('Figurine mise à jour avec succès');
        } else {
          await addProduct(productData);
          console.log('Figurine ajoutée avec succès');
        }
        resetForm();
        alert('Figurine sauvegardée avec succès !');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde de la figurine: ' + (error as Error).message);
      }
    };

    saveProduct();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discount: '',
      category: '',
      features: '',
      images: [''],
      descriptionImage: '',
      useImageDescription: false,
      inStock: true,
      size: '',
      finish: 'raw' as 'raw' | 'painted',
      baseStyle: '',
      variants: [],
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discount: product.discount?.toString() || '',
      category: product.category,
      features: product.features.join(', '),
      images: product.images,
      descriptionImage: product.descriptionImage || '',
      useImageDescription: !!product.descriptionImage,
      inStock: product.inStock,
      size: product.size || '',
      finish: product.finish || 'raw',
      baseStyle: product.baseStyle || '',
      variants: product.variants || [],
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette figurine ?')) {
      const performDelete = async () => {
        try {
          console.log('Tentative de suppression de la figurine:', id);
          await deleteProduct(id);
          console.log('Figurine supprimée avec succès depuis l\'interface');
          alert('Figurine supprimée avec succès !');
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de la figurine: ' + (error as Error).message);
        }
      };
      
      performDelete();
    }
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ''],
    });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const getCategoryName = (categoryId: string) => {
    const category = state.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Catégorie inconnue';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-slate-800">Gestion des Figurines</h1>
          <p className="text-slate-600 mt-2 md:mt-3 text-sm md:text-lg">
            {state.products ? state.products.length : 0} figurine{(state.products?.length || 0) > 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 flex items-center space-x-2 md:space-x-3 transform hover:scale-105 shadow-lg text-sm md:text-base"
        >
          <Plus className="w-4 h-4 md:w-6 md:h-6" />
          <span className="font-semibold hidden sm:inline">Ajouter une Figurine</span>
          <span className="font-semibold sm:hidden">Ajouter</span>
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">
                {editingProduct ? 'Modifier la Figurine' : 'Ajouter une Figurine'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Nom de la figurine *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                      placeholder="ex: Figurine Ronaldo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Prix (DH) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    Réduction (%)
                  </label>
                  <select
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                  >
                    <option value="">Aucune réduction</option>
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                    <option value="15">15%</option>
                    <option value="20">20%</option>
                    <option value="25">25%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                  </select>
                  {formData.discount && (
                    <p className="text-sm text-green-600 mt-2 font-semibold">
                      Prix après réduction: {(parseFloat(formData.price) * (1 - parseFloat(formData.discount) / 100)).toFixed(2)} DH
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                    placeholder="Description détaillée de la figurine, ses caractéristiques, matériaux, etc."
                    required
                  />
                </div>

                {/* Description Image Option */}
                <div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="useImageDescription"
                      checked={formData.useImageDescription}
                      onChange={(e) => setFormData({ ...formData, useImageDescription: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="useImageDescription" className="ml-3 text-sm font-bold text-slate-700">
                      Ajouter une image de description
                    </label>
                  </div>
                  
                  {formData.useImageDescription && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">
                        URL de l'image de description
                      </label>
                      <input
                        type="url"
                        value={formData.descriptionImage}
                        onChange={(e) => setFormData({ ...formData, descriptionImage: e.target.value })}
                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                        placeholder="https://example.com/description-image.jpg"
                      />
                      {formData.descriptionImage && (
                        <div className="mt-4">
                          <img
                            src={formData.descriptionImage}
                            alt="Aperçu description"
                            className="w-full max-w-xs h-40 object-cover rounded-xl border-2 border-slate-200"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Catégorie *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                      required
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {state.categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Taille
                    </label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                      placeholder="ex: 15cm, 20cm, 30cm"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Finition
                    </label>
                    <select
                      value={formData.finish}
                      onChange={(e) => setFormData({ ...formData, finish: e.target.value as 'raw' | 'painted' })}
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                    >
                      <option value="raw">Brute (non peinte)</option>
                      <option value="painted">Peinte</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Style de base
                    </label>
                    <input
                      type="text"
                      value={formData.baseStyle}
                      onChange={(e) => setFormData({ ...formData, baseStyle: e.target.value })}
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                      placeholder="ex: Pose dynamique, Statique, Action"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    Caractéristiques (séparées par des virgules)
                  </label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                    placeholder="ex: Haute qualité, Détails fins, Matériau PLA, Impression 3D"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    Images (URLs)
                  </label>
                  <div className="space-y-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex space-x-3">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => updateImage(index, e.target.value)}
                          className="flex-1 px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                          placeholder="https://example.com/image.jpg"
                        />
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="px-4 py-4 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImageField}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      + Ajouter une image
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="inStock" className="ml-3 text-sm font-bold text-slate-700">
                    Figurine disponible
                  </label>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold"
                  >
                    {editingProduct ? 'Mettre à jour' : 'Ajouter la figurine'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 border-2 border-slate-300 text-slate-700 py-4 rounded-xl hover:bg-slate-50 transition-all duration-300 font-semibold"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      {state.products && state.products.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Figurine</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Catégorie</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Prix</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Taille</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Disponibilité</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {state.products.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-2xl shadow-md"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-lg">{product.name}</p>
                          <p className="text-sm text-slate-600 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-600 font-medium">
                      {getCategoryName(product.category)}
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-800">
                      <div>
                        {product.discount ? (
                          <div>
                            <span className="line-through text-slate-400 text-sm">{product.originalPrice} DH</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-amber-600 font-bold text-lg">{product.price} DH</span>
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
                                -{product.discount}%
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-lg">{product.price} DH</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-slate-600">
                        {product.size || 'Non spécifiée'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-full ${
                        product.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'En stock' : 'Rupture'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`/product/${product.id}`, '_blank')}
                          className="p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-300"
                          title="Voir"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
          <Package className="w-20 h-20 text-slate-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Aucune figurine
          </h3>
          <p className="text-slate-600 mb-8 text-lg">
            Commencez par ajouter votre première figurine
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-2xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold"
          >
            Ajouter une Figurine
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;