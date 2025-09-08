import React, { useState } from 'react';
import { MessageSquare, Eye, Trash2, Mail, User, Calendar, Package, Phone, Send, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContactMessage } from '../../types';

const MessagesPage: React.FC = () => {
  const { state, dispatch, updateMessage, deleteMessage } = useApp();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredMessages = state.messages.filter(message => {
    if (filter === 'unread') return !message.read;
    if (filter === 'read') return message.read;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await updateMessage(messageId, { read: true });
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      alert('Erreur lors du marquage du message comme lu');
    }
  };

  const handleDelete = async (messageId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        await deleteMessage(messageId);
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du message');
      }
    }
  };

  const handleOrderStatusChange = async (messageId: string, status: 'sent' | 'received' | 'cancelled', price?: number) => {
    try {
      const updateData: Partial<ContactMessage> = { 
        orderStatus: status,
        ...(price && { orderPrice: price })
      };
      await updateMessage(messageId, updateData);
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({
          ...selectedMessage,
          orderStatus: status,
          ...(price && { orderPrice: price })
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut de commande');
    }
  };

  const [orderPrice, setOrderPrice] = useState('');
  const [showPriceInput, setShowPriceInput] = useState(false);
  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.read) {
      await handleMarkAsRead(message.id);
    }
  };

  const getProductName = (productId?: string) => {
    if (!productId) return null;
    const product = state.products.find(p => p.id === productId);
    return product ? product.name : 'Figurine supprimée';
  };

  const unreadCount = state.messages.filter(m => !m.read).length;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Messages de Contact</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            {state.messages.length} message{state.messages.length > 1 ? 's' : ''} au total
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        
        {/* Filter buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 md:px-4 py-1 md:py-2 rounded-lg transition-colors text-sm md:text-base ${
              filter === 'all' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 md:px-4 py-1 md:py-2 rounded-lg transition-colors text-sm md:text-base ${
              filter === 'unread' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="hidden sm:inline">Non lus ({unreadCount})</span>
            <span className="sm:hidden">Non lus</span>
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 md:px-4 py-1 md:py-2 rounded-lg transition-colors text-sm md:text-base ${
              filter === 'read' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Lus
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {filteredMessages.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredMessages.map(message => (
                  <div
                    key={message.id}
                    onClick={() => handleViewMessage(message)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''
                    } ${!message.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-800">{message.name}</h3>
                        {!message.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {message.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{message.email}</p>
                    
                    <p className="text-sm text-gray-600 mb-2">{message.phone}</p>
                    
                    {message.productId && (
                      <div className="flex items-center space-x-1 mb-2">
                        <Package className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs text-emerald-600">
                          {getProductName(message.productId)}
                        </span>
                      </div>
                    )}
                    
                    {message.orderStatus && (
                      <div className="flex items-center space-x-1 mb-2">
                        {message.orderStatus === 'sent' && <Send className="w-3 h-3 text-blue-500" />}
                        {message.orderStatus === 'received' && <CheckCircle className="w-3 h-3 text-green-500" />}
                        {message.orderStatus === 'cancelled' && <XCircle className="w-3 h-3 text-red-500" />}
                        <span className={`text-xs ${
                          message.orderStatus === 'sent' ? 'text-blue-600' :
                          message.orderStatus === 'received' ? 'text-green-600' :
                          'text-red-600'
                        }`}>
                          {message.orderStatus === 'sent' ? 'Devis envoyé' :
                           message.orderStatus === 'received' ? 'Commande reçue' :
                           'Commande annulée'}
                        </span>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {message.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {filter === 'unread' ? 'Aucun message non lu' : 
                   filter === 'read' ? 'Aucun message lu' : 'Aucun message'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-xl shadow-md">
              {/* Message Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Message de {selectedMessage.name}
                    </h2>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{selectedMessage.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{selectedMessage.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {selectedMessage.createdAt.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {selectedMessage.productId && (
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4" />
                          <span>Figurine: {getProductName(selectedMessage.productId)}</span>
                        </div>
                      )}
                      {selectedMessage.orderStatus && (
                        <div className="flex items-center space-x-2">
                          {selectedMessage.orderStatus === 'sent' && <Send className="w-4 h-4 text-blue-500" />}
                          {selectedMessage.orderStatus === 'received' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {selectedMessage.orderStatus === 'cancelled' && <XCircle className="w-4 h-4 text-red-500" />}
                          <span className={`${
                            selectedMessage.orderStatus === 'sent' ? 'text-blue-600' :
                            selectedMessage.orderStatus === 'received' ? 'text-green-600' :
                            'text-red-600'
                          }`}>
                            Statut: {selectedMessage.orderStatus === 'sent' ? 'Devis envoyé' :
                                   selectedMessage.orderStatus === 'received' ? 'Commande reçue' :
                                   'Commande annulée'}
                            {selectedMessage.orderPrice && ` - ${selectedMessage.orderPrice} DH`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!selectedMessage.read && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleMarkAsRead(selectedMessage.id);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Marquer comme lu"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(selectedMessage.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Message:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Product Info if applicable */}
                {selectedMessage.productId && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Figurine concernée:</h3>
                    {(() => {
                      const product = state.products.find(p => p.id === selectedMessage.productId);
                      if (product) {
                        return (
                          <div className="bg-emerald-50 rounded-lg p-4 flex items-center space-x-4">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-medium text-gray-800">{product.name}</h4>
                              <p className="text-emerald-600 font-semibold">{product.price} DH</p>
                              <a
                                href={`/product/${product.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-emerald-600 hover:text-emerald-700"
                              >
                                Voir la figurine →
                              </a>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-600">Figurine supprimée ou introuvable</p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}

                {/* Trip Info if applicable */}
                {selectedMessage.tripId && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Voyage concerné:</h3>
                    {(() => {
                      const trip = state.trips.find(t => t.id === selectedMessage.tripId);
                      if (trip) {
                        return (
                          <div className="bg-emerald-50 rounded-lg p-4 flex items-center space-x-4">
                            <img
                              src={trip.images[0]}
                              alt={trip.destination}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-medium text-gray-800">{trip.destination}</h4>
                              <p className="text-emerald-600 font-semibold">{trip.price} DH</p>
                              <a
                                href={`/trip/${trip.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-emerald-600 hover:text-emerald-700"
                              >
                                Voir le voyage →
                              </a>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-600">Voyage supprimé ou introuvable</p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}

                {/* Response Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions:</h3>
                  
                  {/* Order Management */}
                  {!selectedMessage.orderStatus && (
                    <div className="mb-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                      <h4 className="font-medium text-cyan-800 mb-3">Gestion de la commande:</h4>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setShowPriceInput(true)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>Envoyer devis</span>
                        </button>
                        <button
                          onClick={() => handleOrderStatusChange(selectedMessage.id, 'cancelled')}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Client refuse</span>
                        </button>
                      </div>
                      
                      {showPriceInput && (
                        <div className="mt-4 p-3 bg-white border rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prix de la commande (DH):
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              value={orderPrice}
                              onChange={(e) => setOrderPrice(e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                              placeholder="Prix en DH"
                            />
                            <button
                              onClick={() => {
                                if (orderPrice) {
                                  handleOrderStatusChange(selectedMessage.id, 'sent', parseFloat(orderPrice));
                                  setOrderPrice('');
                                  setShowPriceInput(false);
                                }
                              }}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => {
                                setShowPriceInput(false);
                                setOrderPrice('');
                              }}
                              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Order Status Actions */}
                  {selectedMessage.orderStatus === 'sent' && (
                    <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                      <h4 className="font-medium text-teal-800 mb-3">Devis envoyé - Actions:</h4>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleOrderStatusChange(selectedMessage.id, 'received')}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Commande confirmée</span>
                        </button>
                        <button
                          onClick={() => handleOrderStatusChange(selectedMessage.id, 'cancelled')}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Commande annulée</span>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-4">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: Votre demande chez AYO Figurine`}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors flex items-center space-x-2 shadow-lg"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Répondre par email</span>
                    </a>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center space-x-2 shadow-lg"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Appeler</span>
                    </a>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Sélectionnez un message
              </h3>
              <p className="text-gray-600">
                Cliquez sur un message dans la liste pour voir les détails
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;