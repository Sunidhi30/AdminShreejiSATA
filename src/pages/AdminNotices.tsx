import React, { useEffect, useState } from 'react';
import './AdminNotices.scss';

interface Notice {
  _id: string;
  title: string;
  description: string;
  createdBy: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
}

interface CreateNoticeData {
  title: string;
  description: string;
}

const AdminNotices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState<CreateNoticeData>({
    title: '',
    description: ''
  });

  // Fetch all notices
  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://satashreejibackend.onrender.com/api/admin/notices', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotices(data.notices);
      } else {
        console.error('Failed to fetch notices');
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new notice
  const createNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://satashreejibackend.onrender.com/api/admin/notices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setNotices([data.notice, ...notices]);
        setFormData({ title: '', description: '' });
        setShowCreateForm(false);
        showSuccessMessage('Notice created successfully!');
      } else {
        console.error('Failed to create notice');
      }
    } catch (error) {
      console.error('Error creating notice:', error);
    } finally {
      setCreating(false);
    }
  };

  // Update notice
  const updateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;

    setCreating(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/notices/${editingNotice._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setNotices(notices.map(notice => 
          notice._id === editingNotice._id ? data.notice : notice
        ));
        setEditingNotice(null);
        setFormData({ title: '', description: '' });
        showSuccessMessage('Notice updated successfully!');
      } else {
        console.error('Failed to update notice');
      }
    } catch (error) {
      console.error('Error updating notice:', error);
    } finally {
      setCreating(false);
    }
  };

  // Delete notice
  const deleteNotice = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotices(notices.filter(notice => notice._id !== id));
        showSuccessMessage('Notice deleted successfully!');
      } else {
        console.error('Failed to delete notice');
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  // Start editing
  const startEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      description: notice.description
    });
    setShowCreateForm(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingNotice(null);
    setFormData({ title: '', description: '' });
    setShowCreateForm(false);
  };

  // Show success message
  const showSuccessMessage = (message: string) => {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-toast';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="admin-notices">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-notices">
      <div className="notices-header">
        <h1 className="page-title">
          <span className="icon">📢</span>
          Admin Notices
        </h1>
        <button 
          className="create-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <span className="btn-icon">+</span>
          Create New Notice
        </button>
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="create-form-modal">
            <div className="modal-header">
              <h2>{editingNotice ? 'Edit Notice' : 'Create New Notice'}</h2>
              <button className="close-btn" onClick={cancelEdit}>×</button>
            </div>
            
            <form onSubmit={editingNotice ? updateNotice : createNotice}>
              <div className="form-group">
                <label htmlFor="title">Notice Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter notice title..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter notice description..."
                  rows={5}
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={creating}
                >
                  {creating ? 'Processing...' : editingNotice ? 'Update Notice' : 'Create Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="notices-grid">
        {notices.length === 0 ? (
          <div className="no-notices">
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <h3>No notices yet</h3>
              <p>Create your first notice to get started!</p>
            </div>
          </div>
        ) : (
          notices.map((notice) => (
            <div key={notice._id} className="notice-card">
              <div className="notice-header">
                <h3 className="notice-title">{notice.title}</h3>
                <div className="notice-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => startEdit(notice)}
                    title="Edit notice"
                  >
                    ✏️
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteNotice(notice._id)}
                    title="Delete notice"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="notice-content">
                <p className="notice-description">{notice.description}</p>
              </div>
              
              <div className="notice-footer">
                <div className="created-by">
                  <span className="author-icon">👤</span>
                  <span className="author-name">{notice.createdBy.username}</span>
                </div>
                <div className="created-date">
                  <span className="date-icon">📅</span>
                  <span className="date-text">{formatDate(notice.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotices;