import React, { useEffect, useState } from 'react';
import './AdminProfile.scss';

interface Admin {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  earnings?: number;
  
}

interface EarningsData {
  totalUserInvestments?: number; // make it optional with `?`
  adminEarnings: number;
  bidAmount?: number; // <-- added

}

const Profile: React.FC = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    isActive: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [messages, setMessages] = useState({
    success: '',
    error: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchEarnings();
  }, []);

  
  const fetchProfile = async () => {
    try {
      const response = await fetch('https://satashreejibackend.onrender.com/api/admin/profiles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const adminData = data.data[0]; // Assuming first admin is current user
        setAdmin(adminData);
        setFormData({
          username: adminData.username,
          email: adminData.email,
          isActive: adminData.isActive
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessages({ ...messages, error: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };
  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
  
      const [earningsRes, bidAmountRes] = await Promise.all([
        fetch('https://satashreejibackend.onrender.com/api/admin/admin-earnings', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:9000/api/admin/total-bid-amount', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
  
      const earningsData = await earningsRes.json();
      const bidAmountData = await bidAmountRes.json();
  
      setEarnings({
        adminEarnings: earningsData.adminEarnings,
        bidAmount: bidAmountData.bidAmount
      });
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('isActive', formData.isActive.toString());
      
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      const response = await fetch('https://satashreejibackend.onrender.com/api/admin/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages({ success: 'Profile updated successfully!', error: '' });
        setAdmin(data.admin);
        setEditMode(false);
        setProfileImage(null);
        setPreviewImage(null);
      } else {
        setMessages({ error: data.message || 'Failed to update profile', success: '' });
      }
    } catch (error) {
      setMessages({ error: 'Server error occurred', success: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessages({ error: 'New passwords do not match', success: '' });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('https://satashreejibackend.onrender.com/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages({ success: 'Password changed successfully!', error: '' });
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessages({ error: data.message || 'Failed to change password', success: '' });
      }
    } catch (error) {
      setMessages({ error: 'Server error occurred', success: '' });
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setTimeout(() => {
      setMessages({ success: '', error: '' });
    }, 3000);
  };

  useEffect(() => {
    if (messages.success || messages.error) {
      clearMessages();
    }
  }, [messages]);

  if (loading && !admin) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Admin Profile</h1>
        <div className="profile-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {messages.success && (
        <div className="message success-message">
          <i className="fas fa-check-circle"></i>
          {messages.success}
        </div>
      )}
      {messages.error && (
        <div className="message error-message">
          <i className="fas fa-exclamation-circle"></i>
          {messages.error}
        </div>
      )}

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-image-section">
            <div className="profile-image-container">
              <img 
                src={previewImage || admin?.profileImage || '/default-avatar.png'} 
                alt="Profile" 
                className="profile-image"
              />
              {editMode && (
                <div className="image-upload-overlay">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-upload-input"
                    id="profile-image"
                  />
                  <label htmlFor="profile-image" className="image-upload-label">
                    <i className="fas fa-camera"></i>
                  </label>
                </div>
              )}
            </div>
            <div className="profile-status">
              <span className={`status-badge ${admin?.isActive ? 'active' : 'inactive'}`}>
                {admin?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="profile-details">
            {editMode ? (
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span className="checkbox-custom"></span>
                    Active Status
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <label>Username</label>
                  <p>{admin?.username}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{admin?.email}</p>
                </div>
                <div className="info-item">
                  <label>Member Since</label>
                  <p>{admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Earnings Card */}
        <div className="earnings-card">
          <div className="earnings-header">
            <h3>Financial Overview</h3>
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="earnings-content">
          <div className="earning-item">
  <div className="earning-icon">
    <i className="fas fa-coins"></i>
  </div>
  <div className="earning-details">
    <label>Total Bid Amount</label>
    <p className="amount">
      {earnings?.bidAmount?.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
      }) || '₹0.00'}
    </p>
  </div>
</div>

            <div className="earning-item">
              <div className="earning-icon">
                <i className="fas fa-wallet"></i>
              </div>
              <div className="earning-details">
                <label>Admin Earnings</label>
<p className="amount primary">
  {earnings?.adminEarnings?.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  }) || '₹0.00'}
</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button 
                className="close-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;