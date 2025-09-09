import React, { useState } from 'react';
import { Package, Eye, Trash2, Mail, User, Calendar, Phone, MapPin, CheckCircle, XCircle, Send, Truck, ArrowLeft, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContactMessage } from '../../types';

const OrdersPage: React.FC = () => {
  const { state, dispatch, updateMessage, deleteMessage } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'sent' | 'delivered' | 'returned' | 'cancelled'>('all');

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

  const [orderPrice, setOrderPrice] = useState('');

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

  const getProductName = (productId?: string) => {
    if (!productId) return null;
    const product = state.products.find(p => p.id === productId);
    return product ? product.name : 'Produit supprimé';
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {filteredOrders.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedOrder?.id === order.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-800">{order.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="ml-1">{getStatusLabel(order.orderStatus)}</span>
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {order.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3" />
                        <span>{order.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3" />
                        <span>{order.phone}</span>
                      </div>
                      {order.productName && (
                        <div className="flex items-center space-x-2">
                          <Package className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-600 font-medium">
                            {order.productName} {order.quantity && `(x${order.quantity})`}
                          </span>
                        </div>
                      )}
                      {order.orderPrice && (
                        <div className="text-lg font-bold text-green-600">
                          {order.orderPrice} DH
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {filter === 'all' ? 'Aucune commande' : `Aucune commande ${getStatusLabel(filter)?.toLowerCase()}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Detail */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="bg-white rounded-xl shadow-md">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Commande #{selectedOrder.id.slice(-8)}
                    </h2>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                        {getStatusIcon(selectedOrder.orderStatus)}
                        <span className="ml-2">{getStatusLabel(selectedOrder.orderStatus)}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        {selectedOrder.createdAt.toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(selectedOrder.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Client</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium text-gray-800">{selectedOrder.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{selectedOrder.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium text-gray-800">{selectedOrder.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedOrder.deliveryAddress && (
                    <div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Adresse de livraison</p>
                          <p className="font-medium text-gray-800 whitespace-pre-line">
                            {selectedOrder.deliveryAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Information */}
              {selectedOrder.productName && (
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Produit Commandé</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Package className="w-8 h-8 text-emerald-500" />
                        <div>
                          <p className="font-medium text-gray-800">{selectedOrder.productName}</p>
                          {selectedOrder.quantity && (
                            <p className="text-sm text-gray-600">Quantité: {selectedOrder.quantity}</p>
                          )}
                        </div>
                      </div>
                      {selectedOrder.orderPrice && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{selectedOrder.orderPrice} DH</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Message du client</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedOrder.message}
                  </p>
                </div>
              </div>

              {/* Order Actions */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions sur la commande</h3>
                
                {/* Pending Status Actions */}
                {selectedOrder.orderStatus === 'pending' && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-3">Commande en attente - Actions:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="number"
                          value={orderPrice}
                          onChange={(e) => setOrderPrice(e.target.value)}
                          placeholder="Prix de la commande (DH)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => {
                            const price = parseFloat(orderPrice);
                            if (!price || price <= 0) {
                              alert('Veuillez entrer un prix valide');
                              return;
                            }
                            handleStatusChange(selectedOrder.id, 'confirmed', price);
                            setOrderPrice('');
                          }}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Confirmer commande</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Refuser commande</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Confirmed Status Actions */}
                {selectedOrder.orderStatus === 'confirmed' && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-3">Commande confirmée ({selectedOrder.orderPrice} DH) - Actions:</h4>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleStatusChange(selectedOrder.id, 'sent')}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Envoyer commande</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Annuler commande</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Sent Status Actions */}
                {selectedOrder.orderStatus === 'sent' && (
                  <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-3">Commande envoyée ({selectedOrder.orderPrice} DH) - Actions:</h4>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleStatusChange(selectedOrder.id, 'delivered')}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Marquer comme livrée</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedOrder.id, 'returned')}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Marquer comme retournée</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Delivered Status */}
                {selectedOrder.orderStatus === 'delivered' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-3">✅ Commande livrée avec succès ({selectedOrder.orderPrice} DH)</h4>
                    <p className="text-green-700">Cette commande a été livrée et le revenu a été automatiquement ajouté.</p>
                  </div>
                )}
                
                {/* Contact Actions */}
                <div className="flex space-x-4">
                  <a
                    href={`mailto:${selectedOrder.email}?subject=Re: Votre commande chez AYO Figurine`}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors flex items-center space-x-2 shadow-lg"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Contacter par email</span>
                  </a>
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center space-x-2 shadow-lg"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Appeler</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Sélectionnez une commande
              </h3>
              <p className="text-gray-600">
                Cliquez sur une commande dans la liste pour voir les détails
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;