import React, { useEffect, useState } from 'react';
import './PaymentSettings.scss';

interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branch: string;
}

interface PaymentMethod {
  upiId?: string;
  mobileNumber?: string;
  upiQr?: string;
  paytmQr?: string;
  gpayQr?: string;
}

interface AdminPaymentDetails {
  bankDetails: BankDetails;
  upiDetails: PaymentMethod;
  paytmDetails: PaymentMethod;
  googlePayDetails: PaymentMethod;
}

interface Settings {
  adminPaymentDetails: AdminPaymentDetails;
  minimumDeposit: number;
  minimumWithdrawal: number;
  withdrawalTimings: {
    isActive: boolean;
    startTime: string;
    endTime: string;
  };
}

const AdminPaymentSettings: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<{
    upiQr?: File;
    paytmQr?: File;
    gpayQr?: File;
  }>({});

  // Form state
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branch: ''
  });

  const [upiDetails, setUpiDetails] = useState<PaymentMethod>({
    upiId: '',
    upiQr: ''
  });

  const [paytmDetails, setPaytmDetails] = useState<PaymentMethod>({
    mobileNumber: '',
    paytmQr: ''
  });

  const [googlePayDetails, setGooglePayDetails] = useState<PaymentMethod>({
    mobileNumber: '',
    gpayQr: ''
  });

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/admin/admin-settings/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        
        // Populate form with existing data
        if (data.settings.adminPaymentDetails) {
          setBankDetails(data.settings.adminPaymentDetails.bankDetails);
          setUpiDetails(data.settings.adminPaymentDetails.upiDetails);
          setPaytmDetails(data.settings.adminPaymentDetails.paytmDetails);
          setGooglePayDetails(data.settings.adminPaymentDetails.googlePayDetails);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (type: 'upiQr' | 'paytmQr' | 'gpayQr', file: File | null) => {
    setFiles(prev => ({
      ...prev,
      [type]: file || undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const formData = new FormData();
      
      // Add JSON data
      formData.append('bankDetails', JSON.stringify(bankDetails));
      formData.append('upiDetails', JSON.stringify({ upiId: upiDetails.upiId }));
      formData.append('paytmDetails', JSON.stringify({ mobileNumber: paytmDetails.mobileNumber }));
      formData.append('googlePayDetails', JSON.stringify({ mobileNumber: googlePayDetails.mobileNumber }));

      // Add files
      if (files.upiQr) formData.append('upiQr', files.upiQr);
      if (files.paytmQr) formData.append('paytmQr', files.paytmQr);
      if (files.gpayQr) formData.append('gpayQr', files.gpayQr);

      const response = await fetch('http://localhost:9000/api/admin/admin-settings/settings/payment-details', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Payment details updated successfully!');
        fetchSettings(); // Refresh data
      } else {
        setMessage(data.message || 'Error updating payment details');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Error updating payment details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-settings">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading payment settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-settings">
      <div className="settings-container">
        <div className="header">
          <h1 className="title">Admin Payment Settings</h1>
          <p className="subtitle">Manage your payment methods and bank details</p>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="settings-form">
          {/* Bank Details Section */}
          <div className="section">
            <div className="section-header">
              <h2>Bank Details</h2>
              <div className="icon">🏦</div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="accountHolderName">Account Holder Name</label>
                <input
                  type="text"
                  id="accountHolderName"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => setBankDetails(prev => ({
                    ...prev,
                    accountHolderName: e.target.value
                  }))}
                  placeholder="Enter account holder name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="accountNumber">Account Number</label>
                <input
                  type="text"
                  id="accountNumber"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails(prev => ({
                    ...prev,
                    accountNumber: e.target.value
                  }))}
                  placeholder="Enter account number"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="ifscCode">IFSC Code</label>
                <input
                  type="text"
                  id="ifscCode"
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails(prev => ({
                    ...prev,
                    ifscCode: e.target.value.toUpperCase()
                  }))}
                  placeholder="Enter IFSC code"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bankName">Bank Name</label>
                <input
                  type="text"
                  id="bankName"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails(prev => ({
                    ...prev,
                    bankName: e.target.value
                  }))}
                  placeholder="Enter bank name"
                  required
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="branch">Branch</label>
                <input
                  type="text"
                  id="branch"
                  value={bankDetails.branch}
                  onChange={(e) => setBankDetails(prev => ({
                    ...prev,
                    branch: e.target.value
                  }))}
                  placeholder="Enter branch name"
                  required
                />
              </div>
            </div>
          </div>

          {/* UPI Details Section */}
          <div className="section">
            <div className="section-header">
              <h2>UPI Details</h2>
              <div className="icon">📱</div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="upiId">UPI ID</label>
                <input
                  type="text"
                  id="upiId"
                  value={upiDetails.upiId || ''}
                  onChange={(e) => setUpiDetails(prev => ({
                    ...prev,
                    upiId: e.target.value
                  }))}
                  placeholder="yourname@paytm"
                />
              </div>
              <div className="form-group">
                <label htmlFor="upiQr">UPI QR Code</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    id="upiQr"
                    accept="image/*"
                    onChange={(e) => handleFileChange('upiQr', e.target.files?.[0] || null)}
                  />
                  {upiDetails.upiQr && (
                    <div className="current-image">
                      <img src={upiDetails.upiQr} alt="Current UPI QR" />
                      <span>Current QR Code</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Paytm Details Section */}
          <div className="section">
            <div className="section-header">
              <h2>Paytm Details</h2>
              <div className="icon">💳</div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="paytmMobile">Mobile Number</label>
                <input
                  type="tel"
                  id="paytmMobile"
                  value={paytmDetails.mobileNumber || ''}
                  onChange={(e) => setPaytmDetails(prev => ({
                    ...prev,
                    mobileNumber: e.target.value
                  }))}
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="paytmQr">Paytm QR Code</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    id="paytmQr"
                    accept="image/*"
                    onChange={(e) => handleFileChange('paytmQr', e.target.files?.[0] || null)}
                  />
                  {paytmDetails.paytmQr && (
                    <div className="current-image">
                      <img src={paytmDetails.paytmQr} alt="Current Paytm QR" />
                      <span>Current QR Code</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Google Pay Details Section */}
          <div className="section">
            <div className="section-header">
              <h2>Google Pay Details</h2>
              <div className="icon">🟢</div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="gpayMobile">Mobile Number</label>
                <input
                  type="tel"
                  id="gpayMobile"
                  value={googlePayDetails.mobileNumber || ''}
                  onChange={(e) => setGooglePayDetails(prev => ({
                    ...prev,
                    mobileNumber: e.target.value
                  }))}
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="gpayQr">Google Pay QR Code</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    id="gpayQr"
                    accept="image/*"
                    onChange={(e) => handleFileChange('gpayQr', e.target.files?.[0] || null)}
                  />
                  {googlePayDetails.gpayQr && (
                    <div className="current-image">
                      <img src={googlePayDetails.gpayQr} alt="Current Google Pay QR" />
                      <span>Current QR Code</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? (
                <>
                  <div className="btn-spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Save Payment Details
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPaymentSettings;