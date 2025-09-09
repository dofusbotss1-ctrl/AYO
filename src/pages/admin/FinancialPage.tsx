import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Edit, 
  Trash2, 
  PieChart,
  BarChart3,
  Download,
  Calendar,
  Package,
  Wrench,
  ShoppingCart,
  Truck,
  MoreHorizontal,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Charge, Investment, Revenue } from '../../types';

const FinancialPage: React.FC = () => {
  const { 
    state, 
    addCharge, 
    updateCharge, 
    deleteCharge,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    addRevenue,
    getFinancialSummary
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'charges' | 'investments' | 'revenues'>('overview');
  const [showChargeForm, setShowChargeForm] = useState(false);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [showRevenueForm, setShowRevenueForm] = useState(false);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  const [chargeForm, setChargeForm] = useState({
    title: '',
    category: 'Materials' as 'Machine' | 'Materials' | 'Marketing' | 'Logistics' | 'Other',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [investmentForm, setInvestmentForm] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [revenueForm, setRevenueForm] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    source: 'manual' as 'order' | 'manual'
  });

  const financialSummary = getFinancialSummary();

  const handleChargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const chargeData = {
      title: chargeForm.title,
      category: chargeForm.category,
      amount: parseFloat(chargeForm.amount),
      date: new Date(chargeForm.date),
      notes: chargeForm.notes
    };

    try {
      if (editingCharge) {
        await updateCharge(editingCharge.id, chargeData);
      } else {
        await addCharge(chargeData);
      }
      resetChargeForm();
      alert('Charge sauvegardée avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleInvestmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const investmentData = {
      title: investmentForm.title,
      amount: parseFloat(investmentForm.amount),
      date: new Date(investmentForm.date),
      notes: investmentForm.notes
    };

    try {
      if (editingInvestment) {
        await updateInvestment(editingInvestment.id, investmentData);
      } else {
        await addInvestment(investmentData);
      }
      resetInvestmentForm();
      alert('Investissement sauvegardé avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleRevenueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const revenueData = {
      category: revenueForm.category,
      amount: parseFloat(revenueForm.amount),
      date: new Date(revenueForm.date),
      source: revenueForm.source
    };

    try {
      await addRevenue(revenueData);
      resetRevenueForm();
      alert('Revenu ajouté avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const resetChargeForm = () => {
    setChargeForm({
      title: '',
      category: 'Materials',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditingCharge(null);
    setShowChargeForm(false);
  };

  const resetInvestmentForm = () => {
    setInvestmentForm({
      title: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditingInvestment(null);
    setShowInvestmentForm(false);
  };

  const resetRevenueForm = () => {
    setRevenueForm({
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      source: 'manual'
    });
    setShowRevenueForm(false);
  };

  const handleEditCharge = (charge: Charge) => {
    setEditingCharge(charge);
    setChargeForm({
      title: charge.title,
      category: charge.category,
      amount: charge.amount.toString(),
      date: charge.date.toISOString().split('T')[0],
      notes: charge.notes || ''
    });
    setShowChargeForm(true);
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setInvestmentForm({
      title: investment.title,
      amount: investment.amount.toString(),
      date: investment.date.toISOString().split('T')[0],
      notes: investment.notes || ''
    });
    setShowInvestmentForm(true);
  };

  const handleDeleteCharge = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette charge ?')) {
      try {
        await deleteCharge(id);
        alert('Charge supprimée avec succès !');
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleDeleteInvestment = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet investissement ?')) {
      try {
        await deleteInvestment(id);
        alert('Investissement supprimé avec succès !');
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleDeleteRevenue = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce revenu ?')) {
      try {
        await deleteRevenue(id);
        alert('Revenu supprimé avec succès !');
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };
  const exportToCSV = () => {
    const csvData = [
      ['Type', 'Titre', 'Catégorie', 'Montant', 'Date', 'Notes'],
      ...state.charges.map(c => ['Charge', c.title, c.category, c.amount, c.date.toLocaleDateString(), c.notes || '']),
      ...state.investments.map(i => ['Investissement', i.title, 'Investment', i.amount, i.date.toLocaleDateString(), i.notes || '']),
      ...state.revenues.map(r => ['Revenu', r.category, r.source, r.amount, r.date.toLocaleDateString(), ''])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Machine': return <Wrench className="w-4 h-4" />;
      case 'Materials': return <Package className="w-4 h-4" />;
      case 'Marketing': return <Target className="w-4 h-4" />;
      case 'Logistics': return <Truck className="w-4 h-4" />;
      default: return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Machine': return 'bg-purple-100 text-purple-800';
      case 'Materials': return 'bg-blue-100 text-blue-800';
      case 'Marketing': return 'bg-green-100 text-green-800';
      case 'Logistics': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <DollarSign className="w-8 h-8 mr-3 text-green-600" />
            Gestion Financière
          </h1>
          <p className="text-gray-600 mt-2">
            Suivi des revenus, charges et investissements
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center space-x-2 shadow-lg"
        >
          <Download className="w-5 h-5" />
          <span>Exporter CSV</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg mb-8">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: PieChart },
            { id: 'charges', label: 'Charges', icon: TrendingDown },
            { id: 'investments', label: 'Investissements', icon: BarChart3 },
            { id: 'revenues', label: 'Revenus', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Revenus Totaux</p>
                  <p className="text-3xl font-bold">{financialSummary.totalRevenue.toFixed(2)} DH</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Charges Totales</p>
                  <p className="text-3xl font-bold">{financialSummary.totalCharges.toFixed(2)} DH</p>
                </div>
                <TrendingDown className="w-12 h-12 text-red-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Investissements</p>
                  <p className="text-3xl font-bold">{financialSummary.totalInvestments.toFixed(2)} DH</p>
                </div>
                <BarChart3 className="w-12 h-12 text-blue-200" />
              </div>
            </div>

            <div className={`rounded-2xl p-6 text-white ${
              financialSummary.netProfit >= 0 
                ? 'bg-gradient-to-br from-purple-500 to-indigo-600' 
                : 'bg-gradient-to-br from-orange-500 to-red-600'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Bénéfice Net</p>
                  <p className="text-3xl font-bold">{financialSummary.netProfit.toFixed(2)} DH</p>
                </div>
                <DollarSign className="w-12 h-12 text-purple-200" />
              </div>
            </div>
          </div>

          {/* Monthly Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Évolution Mensuelle</h3>
            <div className="space-y-4">
              {financialSummary.monthlyData.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-800">{month.month}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Revenus</p>
                      <p className="font-bold text-green-600">{month.revenue.toFixed(2)} DH</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Charges</p>
                      <p className="font-bold text-red-600">{month.charges.toFixed(2)} DH</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Profit</p>
                      <p className={`font-bold ${month.profit >= 0 ? 'text-purple-600' : 'text-orange-600'}`}>
                        {month.profit.toFixed(2)} DH
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Charges Tab */}
      {activeTab === 'charges' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Charges</h2>
            <button
              onClick={() => setShowChargeForm(true)}
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-pink-700 transition-colors flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter une Charge</span>
            </button>
          </div>

          {/* Charges List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {state.charges.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Titre</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Catégorie</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Montant</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {state.charges.map(charge => (
                      <tr key={charge.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-800">{charge.title}</p>
                            {charge.notes && (
                              <p className="text-sm text-gray-500">{charge.notes}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(charge.category)}`}>
                            {getCategoryIcon(charge.category)}
                            <span className="ml-2">{charge.category}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-red-600">{charge.amount.toFixed(2)} DH</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {charge.date.toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditCharge(charge)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCharge(charge.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune charge enregistrée</h3>
                <p className="text-gray-600">Commencez par ajouter vos premières charges</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Investments Tab */}
      {activeTab === 'investments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Investissements</h2>
            <button
              onClick={() => setShowInvestmentForm(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter un Investissement</span>
            </button>
          </div>

          {/* Investments List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {state.investments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Titre</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Montant</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {state.investments.map(investment => (
                      <tr key={investment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-800">{investment.title}</p>
                            {investment.notes && (
                              <p className="text-sm text-gray-500">{investment.notes}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-blue-600">{investment.amount.toFixed(2)} DH</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {investment.date.toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditInvestment(investment)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteInvestment(investment.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun investissement enregistré</h3>
                <p className="text-gray-600">Commencez par ajouter vos premiers investissements</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Revenues Tab */}
      {activeTab === 'revenues' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Revenus</h2>
            <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <span className="font-medium">ℹ️ Les revenus sont ajoutés automatiquement lors de la confirmation des commandes</span>
            </div>
          </div>

          {/* Revenues List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {state.revenues.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Catégorie</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Montant</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Source</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {state.revenues.map(revenue => (
                      <tr key={revenue.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-800">{revenue.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-green-600">{revenue.amount.toFixed(2)} DH</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            revenue.source === 'order' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {revenue.source === 'order' ? '🛒 Commande Confirmée' : 'Manuel'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {revenue.date.toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteRevenue(revenue.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer ce revenu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun revenu enregistré</h3>
                <p className="text-gray-600">Commencez par ajouter vos premiers revenus</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charge Form Modal */}
      {showChargeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {editingCharge ? 'Modifier la Charge' : 'Ajouter une Charge'}
            </h3>
            
            <form onSubmit={handleChargeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                <input
                  type="text"
                  value={chargeForm.title}
                  onChange={(e) => setChargeForm({ ...chargeForm, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="ex: Filament PLA, Électricité..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                <select
                  value={chargeForm.category}
                  onChange={(e) => setChargeForm({ ...chargeForm, category: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                >
                  <option value="Materials">Matériaux</option>
                  <option value="Machine">Machine</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Logistics">Logistique</option>
                  <option value="Other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant (DH) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={chargeForm.amount}
                  onChange={(e) => setChargeForm({ ...chargeForm, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={chargeForm.date}
                  onChange={(e) => setChargeForm({ ...chargeForm, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={chargeForm.notes}
                  onChange={(e) => setChargeForm({ ...chargeForm, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="Notes optionnelles..."
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-lg hover:from-red-700 hover:to-pink-700 transition-colors"
                >
                  {editingCharge ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={resetChargeForm}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Investment Form Modal */}
      {showInvestmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {editingInvestment ? 'Modifier l\'Investissement' : 'Ajouter un Investissement'}
            </h3>
            
            <form onSubmit={handleInvestmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                <input
                  type="text"
                  value={investmentForm.title}
                  onChange={(e) => setInvestmentForm({ ...investmentForm, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="ex: Imprimante 3D Bambu Lab A1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant (DH) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={investmentForm.amount}
                  onChange={(e) => setInvestmentForm({ ...investmentForm, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={investmentForm.date}
                  onChange={(e) => setInvestmentForm({ ...investmentForm, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={investmentForm.notes}
                  onChange={(e) => setInvestmentForm({ ...investmentForm, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Notes optionnelles..."
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors"
                >
                  {editingInvestment ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={resetInvestmentForm}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revenue Form Modal */}
      {showRevenueForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Ajouter un Revenu
            </h3>
            
            <form onSubmit={handleRevenueSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                <input
                  type="text"
                  value={revenueForm.category}
                  onChange={(e) => setRevenueForm({ ...revenueForm, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="ex: Vente produit, Service..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant (DH) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={revenueForm.amount}
                  onChange={(e) => setRevenueForm({ ...revenueForm, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source *</label>
                <select
                  value={revenueForm.source}
                  onChange={(e) => setRevenueForm({ ...revenueForm, source: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  required
                >
                  <option value="manual">Manuel</option>
                  <option value="order">Commande</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={revenueForm.date}
                  onChange={(e) => setRevenueForm({ ...revenueForm, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={resetRevenueForm}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialPage;