import React, { useState } from 'react';
import { Package, Eye, Trash2, Mail, User, Calendar, Phone, MapPin, CheckCircle, XCircle, Send, Truck, ArrowLeft, Clock, Edit } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContactMessage } from '../../types';

const OrdersPage: React.FC = () => {
  const { state, dispatch, updateMessage, deleteMessage } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'sent' | 'delivered' | 'returned' | 'cancelled'>('all');
  const [orderPrice, setOrderPrice] = useState('');
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState('');

  const filteredOrders = state.messages.filter(order => {
    if (filter === 'all') return true;
    return order.orderStatus === filter;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = async (orderId: string, status: 'confirmed' | 'sent' | 'delivered' | 'returned' | 'cancelled', price?: number) => {
    try {
      const updateData: Partial<ContactMessage> = { 
        orderStatus: status,
        ...(price && { orderPrice: price })
      };
      await updateMessage(orderId, updateData);
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          orderStatus: status,
          ...(price && { orderPrice: price })
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut de commande');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      try {
        await deleteMessage(orderId);
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la commande');
      }
    }
  };

  const handlePriceEdit = async (orderId: string) => {
    const price = parseFloat(tempPrice);
    if (!price || price <= 0) {
      alert('Veuillez entrer un prix valide');
      return;
    }
    
    try {
      await updateMessage(orderId, { orderPrice: price });
      setEditingPrice(null);
      setTempPrice('');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du prix:', error);
      alert('Erreur lors de la mise à jour du prix');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'returned': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'sent': return <Send className="w-4 h-4" />;
      case 'delivered': return <Truck className="w-4 h-4" />;
      case 'returned': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'sent': return 'Envoyée';
      case 'delivered': return 'Livrée';
      case 'returned': return 'Retournée';
      case 'cancelled': return 'Annulée';
      default: return 'Inconnue';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des Commandes</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            {state.messages.length} commande{state.messages.length > 1 ? 's' : ''} au total
          </p>
        </div>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Toutes', count: state.messages.length },
            { id: 'pending', label: 'En attente', count: state.messages.filter(m => m.orderStatus === 'pending').length },
            { id: 'confirmed', label: 'Confirmées', count: state.messages.filter(m => m.orderStatus === 'confirmed').length },
            { id: 'sent', label: 'Envoyées', count: state.messages.filter(m => m.orderStatus === 'sent').length },
            { id: 'delivered', label: 'Livrées', count: state.messages.filter(m => m.orderStatus === 'delivered').length }
          ].map(filterOption => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as any)}
              className={`px-3 md:px-4 py-1 md:py-2 rounded-lg transition-colors text-sm md:text-base ${
                filter === filterOption.id 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">ID Commande</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Adresse Livraison</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Produit</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Prix</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    {/* ID Commande */}
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-bold text-blue-600">
                        #{order.id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.createdAt.toLocaleDateString('fr-FR')}
                      </div>
                    </td>

                    {/* Client */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{order.name}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{order.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{order.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Adresse Livraison */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {order.deliveryAddress ? (
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 line-clamp-3">
                              {order.deliveryAddress}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">Non spécifiée</span>
                        )}
                      </div>
                    </td>

                    {/* Produit */}
                    <td className="px-6 py-4">
                      {order.productName ? (
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-emerald-500" />
                          <div>
                            <div className="font-medium text-gray-800 text-sm">
                              {order.productName}
                            </div>
                            {order.quantity && (
                              <div className="text-xs text-gray-500">
                                Quantité: {order.quantity}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Demande générale</span>
                      )}
                    </td>

                    {/* Prix */}
                    <td className="px-6 py-4">
                      {editingPrice === order.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Prix"
                          />
                          <button
                            onClick={() => handlePriceEdit(order.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingPrice(null);
                              setTempPrice('');
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          {order.orderPrice ? (
                            <span className="font-bold text-green-600">
                              {order.orderPrice} DH
                            </span>
                          ) : (
                            <span className="text-gray-400 italic text-sm">Non défini</span>
                          )}
                          <button
                            onClick={() => {
                              setEditingPrice(order.id);
                              setTempPrice(order.orderPrice?.toString() || '');
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="ml-1">{getStatusLabel(order.orderStatus)}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {/* Actions selon le statut */}
                        {order.orderStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                if (!order.orderPrice) {
                                  alert('Veuillez d\'abord définir un prix pour cette commande');
                                  return;
                                }
                                handleStatusChange(order.id, 'confirmed');
                              }}
                              className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors flex items-center space-x-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Confirmer</span>
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'cancelled')}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors flex items-center space-x-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Refuser</span>
                            </button>
                          </>
                        )}

                        {order.orderStatus === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'sent')}
                            className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600 transition-colors flex items-center space-x-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Envoyer</span>
                          </button>
                        )}

                        {order.orderStatus === 'sent' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'delivered')}
                              className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors flex items-center space-x-1"
                            >
                              <Truck className="w-3 h-3" />
                              <span>Livré</span>
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'returned')}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors flex items-center space-x-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Retour</span>
                            </button>
                          </>
                        )}

                        {/* Actions communes */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Supprimer"
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
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aucune commande
            </h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'Aucune commande trouvée' : `Aucune commande ${getStatusLabel(filter)?.toLowerCase()}`}
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Détails Commande #{selectedOrder.id.slice(-8).toUpperCase()}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informations client */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Client</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Nom</label>
                    <p className="font-medium">{selectedOrder.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Téléphone</label>
                    <p className="font-medium">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Date</label>
                    <p className="font-medium">{selectedOrder.createdAt.toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                
                {selectedOrder.deliveryAddress && (
                  <div className="mt-4">
                    <label className="text-sm text-gray-500">Adresse de livraison</label>
                    <p className="font-medium whitespace-pre-line">{selectedOrder.deliveryAddress}</p>
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Message</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedOrder.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <a
                  href={`mailto:${selectedOrder.email}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
                <a
                  href={`tel:${selectedOrder.phone}`}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appeler</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;