import React, { useEffect, useState } from 'react';
import './UserDeposit.scss';

interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
}

interface PaymentDetails {
  orderId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: string;
}

interface Transaction {
  _id: string;
  user: User;
  type: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  processedAt?: string;
  processedBy?: string;
  paymentDetails?: PaymentDetails;
}

interface ApiResponse {
  success: boolean;
  count: number;
  message: string;
  transactions: Transaction[];
}

const UserDeposit: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9000/api/admin/testing-transactions/deposits', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data: ApiResponse = await response.json();
      setTransactions(data.transactions);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    if (statusFilter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.status === statusFilter));
    }
  };

  const handleAction = async (transactionId: string, action: 'approve' | 'reject') => {
    try {
      setActionLoading(prev => ({ ...prev, [transactionId]: true }));
      
      const response = await fetch(`http://localhost:9000/api/admin/transactions/${transactionId}/action`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          adminNotes
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} transaction`);
      }

      const result = await response.json();
      
      // Update the transaction in the state
      setTransactions(prev => 
        prev.map(t => 
          t._id === transactionId 
            ? { ...t, status: result.transaction.status, processedAt: result.transaction.processedAt }
            : t
        )
      );

      setShowModal(false);
      setSelectedTransaction(null);
      setActionType(null);
      setAdminNotes('');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setActionLoading(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  const openActionModal = (transaction: Transaction, action: 'approve' | 'reject') => {
    setSelectedTransaction(transaction);
    setActionType(action);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
    setActionType(null);
    setAdminNotes('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusClass = {
      pending: 'status-pending',
      completed: 'status-completed',
      failed: 'status-failed'
    }[status] || 'status-pending';

    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="user-deposit">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-deposit">
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={fetchTransactions} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-deposit">
      <div className="header">
        <h1>Transaction Management</h1>
        <div className="header-actions">
          <div className="filter-container">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <button onClick={fetchTransactions} className="refresh-btn">
            Refresh
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Transactions</span>
          <span className="stat-value">{filteredTransactions.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value pending">{filteredTransactions.filter(t => t.status === 'pending').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <span className="stat-value completed">{filteredTransactions.filter(t => t.status === 'completed').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Failed</span>
          <span className="stat-value failed">{filteredTransactions.filter(t => t.status === 'failed').length}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="user-cell">
                  <div className="user-info">
                    <img 
                      src={transaction.user.profileImage || '/default-avatar.png'} 
                      alt={transaction.user.username}
                      className="user-avatar"
                    />
                    <div className="user-details">
                      <span className="username">{transaction.user.username}</span>
                      <span className="email">{transaction.user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="amount-cell">
                  {formatAmount(transaction.amount)}
                </td>
                <td className="method-cell">
                  <span className="payment-method">{transaction.paymentMethod}</span>
                </td>
                <td className="status-cell">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="date-cell">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="actions-cell">
                  {transaction.status === 'pending' ? (
                    <div className="action-buttons">
                      <button 
                        onClick={() => openActionModal(transaction, 'approve')}
                        className="approve-btn"
                        disabled={actionLoading[transaction._id]}
                      >
                        {actionLoading[transaction._id] ? 'Processing...' : 'Approve'}
                      </button>
                      <button 
                        onClick={() => openActionModal(transaction, 'reject')}
                        className="reject-btn"
                        disabled={actionLoading[transaction._id]}
                      >
                        {actionLoading[transaction._id] ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  ) : (
                    <span className="processed-text">
                      {transaction.status === 'completed' ? 'Approved' : 'Rejected'}
                      {transaction.processedAt && (
                        <small>{formatDate(transaction.processedAt)}</small>
                      )}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="no-data">
            <p>No transactions found for the selected filter.</p>
          </div>
        )}
      </div>

      {showModal && selectedTransaction && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{actionType === 'approve' ? 'Approve' : 'Reject'} Transaction</h3>
              <button onClick={closeModal} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="transaction-details">
                <p><strong>User:</strong> {selectedTransaction.user.username}</p>
                <p><strong>Amount:</strong> {formatAmount(selectedTransaction.amount)}</p>
                <p><strong>Method:</strong> {selectedTransaction.paymentMethod}</p>
                <p><strong>Date:</strong> {formatDate(selectedTransaction.createdAt)}</p>
              </div>
              <div className="notes-section">
                <label htmlFor="adminNotes">Admin Notes:</label>
                <textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes for this action..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeModal} className="cancel-btn">Cancel</button>
              <button 
                onClick={() => handleAction(selectedTransaction._id, actionType!)}
                className={`confirm-btn ${actionType}`}
                disabled={actionLoading[selectedTransaction._id]}
              >
                {actionLoading[selectedTransaction._id] ? 'Processing...' : 
                 actionType === 'approve' ? 'Approve Transaction' : 'Reject Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDeposit;