import React, { useState } from 'react';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';

const CategoriesPage: React.FC = () => {
  const { state, addCategory, updateCategory, deleteCategory } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
    };

    const saveCategory = async () => {
      try {
        if (editingCategory) {
          await updateCategory(editingCategory.id, categoryData);
        } else {
          await addCategory(categoryData);
        }
        resetForm();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde de la catégorie');
      }
    };

    saveCategory();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const productsInCategory = state.products.filter(p => p.category === id);
    
    if (productsInCategory.length > 0) {
      alert(`Impossible de supprimer cette catégorie car elle contient ${productsInCategory.length} produit(s).`);
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      deleteCategory(id).catch(error => {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la catégorie');
      });
    }
  };

  const getProductCount = (categoryId: string) => {
    return state.products.filter(p => p.category === categoryId).length;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des Catégories</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            {state.categories.length} catégorie{state.categories.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors flex items-center space-x-1 md:space-x-2 shadow-lg text-sm md:text-base"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Ajouter une Catégorie</span>
          <span className="sm:hidden">Ajouter</span>
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingCategory ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la catégorie *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    placeholder="ex: Robes"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    placeholder="Description de la catégorie..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image de la catégorie
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    placeholder="https://example.com/category-image.jpg"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Aperçu catégorie"
                        className="w-16 h-16 object-cover rounded-full border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors shadow-lg"
                  >
                    {editingCategory ? 'Mettre à jour' : 'Ajouter la catégorie'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {state.categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.categories.map(category => (
            <div key={category.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <FolderOpen className="w-6 h-6 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                    <p className="text-sm text-gray-600">
                      {getProductCount(category.id)} produit{getProductCount(category.id) > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {category.description && (
                <p className="text-gray-600 text-sm">{category.description}</p>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <a
                  href={`/products?category=${category.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Voir les produits →
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Aucune catégorie
          </h3>
          <p className="text-gray-600 mb-6">
            Commencez par créer votre première catégorie
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors shadow-lg"
          >
            Ajouter une Catégorie
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;