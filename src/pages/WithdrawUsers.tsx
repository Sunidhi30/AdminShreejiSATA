
import React, { useEffect, useState } from 'react';
import './Withdraw.scss';

interface PaymentDetails {
  mobileNumber: string;
  upiId: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  wallet: {
    balance: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalWinnings: number;
    commission: number;
  };
}

interface Withdrawal {
  _id: string;
  user: User;
  type: string;
  amount: number;
  status: string;
  paymentMethod: string;
  description: string;
  paymentDetails: PaymentDetails;
  createdAt: string;
  updatedAt: string;
}

interface WithdrawalsResponse {
  message: string;
  withdrawals: Withdrawal[];
}

const WithdrawUser: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>(''); // 🔥 Filter state
  const [showApproveModal, setShowApproveModal] = useState(false); // 🔥 Approval Modal
  const [approveWithdrawalId, setApproveWithdrawalId] = useState<string | null>(null); // 🔥 Which withdrawal to approve
  const itemsPerPage = 10;

  useEffect(() => {
    fetchWithdrawals();
  }, [filterStatus]); // Refetch when filter changes

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);


    let url = 'https://satashreejibackend.onrender.com/api/admin/users-withdrawals-testing';

      if (filterStatus) {
        url += `?status=${filterStatus}`; // 🔥 Apply filter
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch withdrawals');
      }

      const data: WithdrawalsResponse = await response.json();
      setWithdrawals(data.withdrawals);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      alert('Error fetching withdrawals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawalId: string) => {
    try {
      setProcessingId(withdrawalId);
      const response = await fetch(`https://satashreejibackend.onrender.com/api/admin/users-withdrawalstesting/${withdrawalId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve withdrawal');
      }

      alert('Withdrawal approved successfully!');
      fetchWithdrawals(); // Refresh the list
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      alert(error instanceof Error ? error.message : 'Unexpected error during approval.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedWithdrawal || !rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessingId(selectedWithdrawal._id);
      const response = await fetch(`https://satashreejibackend.onrender.com/api/admin/users-withdrawals/${selectedWithdrawal._id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject withdrawal');
      }

      alert('Withdrawal rejected successfully!');
      setShowRejectModal(false);
      setSelectedWithdrawal(null);
      setRejectionReason('');
      fetchWithdrawals(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      alert(error instanceof Error ? error.message : 'Unexpected error during rejection.');
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowRejectModal(true);
  };

  const openApproveModal = (withdrawalId: string) => {
    setApproveWithdrawalId(withdrawalId);
    setShowApproveModal(true);
  };

  const closeApproveModal = () => {
    setApproveWithdrawalId(null);
    setShowApproveModal(false);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedWithdrawal(null);
    setRejectionReason('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Pagination logic
  const totalPages = Math.ceil(withdrawals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWithdrawals = withdrawals.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
return (
  <div className="game-result-container">
    <div className="game-result-header">
      <h1>Withdrawal Management</h1>
      <div className="actions">
        {/* 🔥 Filter Dropdown */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="admin_pending">Admin Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>

    {loading ? (
      <div className="loading">Loading withdrawal requests...</div>
    ) : (
      <>
        {/* Table */}
        <div className="results-table">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Payment Details</th>
                  <th>Wallet Balance</th>
                  <th>Request Date</th>
                  <th>Status</th> {/* 👈 Added Status column */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="no-results">
                      No withdrawal requests found
                    </td>
                  </tr>
                ) : (
                  currentWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal._id}>
                      <td>
                        <div className="user-details">
                          <div className="username">{withdrawal.user.username}</div>
                          <div className="email">{withdrawal.user.email}</div>
                          <div className="user-id">ID: {withdrawal.user._id}</div>
                        </div>
                      </td>
                      <td className="result-digit">
                        {formatCurrency(withdrawal.amount)}
                      </td>
                      <td>
                        <span className="payment-method">
                          {withdrawal.paymentMethod.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="payment-details">
                          <div>Mobile: {withdrawal.paymentDetails.mobileNumber}</div>
                          <div>UPI ID: {withdrawal.paymentDetails.upiId}</div>
                        </div>
                      </td>
                      <td>
                        <div className="wallet-info">
                          <div>Balance: {formatCurrency(withdrawal.user.wallet.balance)}</div>
                          <div className="wallet-stats">
                            <small>
                              Deposits: {formatCurrency(withdrawal.user.wallet.totalDeposits)} | 
                              Withdrawals: {formatCurrency(withdrawal.user.wallet.totalWithdrawals)}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(withdrawal.createdAt)}</td>
                      <td>
                        {/* 👇 Colored badge for status */}
                        <span
                          className={`status-badge ${withdrawal.status}`}
                        >
                          {withdrawal.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="approve-btn"
                            onClick={() => openApproveModal(withdrawal._id)}
                            disabled={processingId === withdrawal._id}
                          >
                            {processingId === withdrawal._id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => openRejectModal(withdrawal)}
                            disabled={processingId === withdrawal._id}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </>
    )}

    {/* Approve Modal */}
    {showApproveModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Approve Withdrawal</h2>
            <button className="close-btn" onClick={closeApproveModal}>×</button>
          </div>
          <div className="modal-body">
            Are you sure you want to approve this withdrawal?
          </div>
          <div className="modal-actions">
            <button className="cancel-btn" onClick={closeApproveModal}>
              Cancel
            </button>
            <button
              className="submit-btn"
              onClick={() => {
                if (approveWithdrawalId) handleApprove(approveWithdrawalId);
                closeApproveModal();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Reject Modal */}
    {showRejectModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Reject Withdrawal Request</h2>
            <button className="close-btn" onClick={closeRejectModal}>×</button>
          </div>
          <div className="declare-form">
            <div className="form-group">
              <label>User:</label>
              <input
                type="text"
                value={`${selectedWithdrawal?.user.username} (${selectedWithdrawal?.user.email})`}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Amount:</label>
              <input
                type="text"
                value={selectedWithdrawal ? formatCurrency(selectedWithdrawal.amount) : ''}
                disabled
              />
            </div>
            <div className="form-group">
              <label>
                Reason for Rejection: <span style={{ color: 'red' }}>*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this withdrawal request..."
                rows={4}
              />
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={closeRejectModal}>
                Cancel
              </button>
              <button
                className="submit-btn reject-confirm"
                onClick={handleReject}
                disabled={!rejectionReason.trim() || processingId === selectedWithdrawal?._id}
              >
                {processingId === selectedWithdrawal?._id ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);


};

export default WithdrawUser;
