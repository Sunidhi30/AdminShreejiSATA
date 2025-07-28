
import axios from "axios";
import { Clock, Edit, IndianRupee, Pause, Play, Plus, Target, Trash2, TrendingUp, Trophy, X } from "lucide-react";
import React, { useState } from "react";
import "./GamesTable.scss";

interface Game {
  _id: string; // Made mandatory since we'll always have ID
  name: string;
  openTime: string;
  closeTime: string;
  resultTime: string;
  status: string;
  type: string;
  gameType?: string;
  singleDigit: number;
  jodiDigit: number;
  openDateTime?: string;
  closeDateTime?: string;
  resultDateTime?: string;
}

interface GamesTableProps {
  games: Game[];
  onGameUpdated?: () => void;
}

const GamesTable: React.FC<GamesTableProps> = ({ games, onGameUpdated }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [originalGameData, setOriginalGameData] = useState<Game | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'regular',
    openDateTime: '',
    closeDateTime: '',
    resultDateTime: '',
    status: 'active'
  });

  const API_BASE_URL = 'https://satashreejibackend.onrender.com';

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'regular',
      openDateTime: '',
      closeDateTime: '',
      resultDateTime: '',
      status: 'active'
    });
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const adjustedFormData = {
      ...formData,
      openDateTime: new Date(formData.openDateTime).toISOString(),
      closeDateTime: new Date(formData.closeDateTime).toISOString(),
      resultDateTime: new Date(formData.resultDateTime).toISOString(),
    };

    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/api/admin/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(adjustedFormData),
      });

      const data = await response.json();

      if (response.ok) {
        setErrorMessage(null);
        setSuccessMessage('Game added successfully!');
        resetForm();
        setShowAddForm(false);
        onGameUpdated?.();
      } else {
        setErrorMessage(data.message || 'Failed to add game');
      }
    } catch (error) {
      console.error('Error adding game:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const formatDateTime = (dateStr: string | Date) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 16);
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setOriginalGameData({ ...game });
    
    setFormData({
      name: game.name || '',
      type: game.type || game.gameType || 'regular',
      openDateTime: game.openDateTime 
        ? formatDateTime(game.openDateTime) 
        : game.openTime 
          ? formatDateTime(game.openTime) 
          : '',
      closeDateTime: game.closeDateTime 
        ? formatDateTime(game.closeDateTime) 
        : game.closeTime 
          ? formatDateTime(game.closeTime) 
          : '',
      resultDateTime: game.resultDateTime 
        ? formatDateTime(game.resultDateTime) 
        : game.resultTime 
          ? formatDateTime(game.resultTime) 
          : '',
      status: game.status || 'active'
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMessage(null);

    if (!editingGame) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const updateData: any = {
      name: formData.get("name"),
      gameType: formData.get("type"),
      status: formData.get("status"),
    };

    const openDateTime = formData.get("openDateTime");
    const closeDateTime = formData.get("closeDateTime");
    const resultDateTime = formData.get("resultDateTime");

    if (typeof openDateTime === "string" && openDateTime) {
      updateData.openDateTime = new Date(openDateTime).toISOString();
    }
    if (typeof closeDateTime === "string" && closeDateTime) {
      updateData.closeDateTime = new Date(closeDateTime).toISOString();
    }
    if (typeof resultDateTime === "string" && resultDateTime) {
      updateData.resultDateTime = new Date(resultDateTime).toISOString();
    }

    try {
      const adminToken = localStorage.getItem("adminToken");
      
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/games/${editingGame._id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          }
        }
      );
      
      setSuccessMessage('Game updated successfully!');
      setShowEditForm(false);
      setEditingGame(null);
      setOriginalGameData(null);
      resetForm();
      onGameUpdated?.();
      
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update game';
      setErrorMessage(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (gameId: string) => {
    if (!window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(gameId);

    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/api/admin/testing-games/${gameId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Game deleted successfully!');
        onGameUpdated?.();
      } else {
        setErrorMessage(data.message || 'Failed to delete game');
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  // Check if field has been modified
  const isFieldModified = (fieldName: keyof typeof formData) => {
    if (!originalGameData) return false;
    
    let originalValue: any;
    let currentValue = formData[fieldName];
    
    // Handle type field mapping
    if (fieldName === 'type') {
      originalValue = originalGameData.type || originalGameData.gameType;
    } else if (fieldName.includes('DateTime')) {
      const originalField = originalGameData[fieldName as keyof Game] as string;
      if (originalField) {
        originalValue = formatDateTime(originalField);
      }
    } else {
      originalValue = originalGameData[fieldName as keyof Game];
    }
    
    return originalValue !== currentValue;
  };

  const getStatusIcon = (status: string) =>
    status === "active" ? (
      <Play className="status-icon active" />
    ) : (
      <Pause className="status-icon inactive" />
    );

  const getTypeIcon = (type: string) =>
    type === "regular" ? (
      <TrendingUp className="type-icon regular" />
    ) : (
      <Trophy className="type-icon premium" />
    );

  return (
    <div className="games-table">
      <div className="games-table__header">
        <div className="header-left">
          <h2>Games Dashboard</h2>
          <p>Manage and monitor all gaming activities</p>
        </div>
        <button 
          className="add-game-btn"
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
        >
          <Plus size={20} />
          Add Game
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
          <button onClick={() => setSuccessMessage(null)} className="close-message">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="error-message-global">
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} className="close-message">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Add Game Modal */}
      {showAddForm && (
        <div className="add-game-modal">
          <div className="add-game-form">
            <div className="form-header">
              <h2>Add New Game</h2>
              <button 
                className="close-modal-btn"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              >
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Game Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Game Type:</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="regular">Regular</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div className="form-group">
                <label>Open DateTime:</label>
                <input
                  type="datetime-local"
                  name="openDateTime"
                  value={formData.openDateTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Close DateTime:</label>
                <input
                  type="datetime-local"
                  name="closeDateTime"
                  value={formData.closeDateTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Result DateTime:</label>
                <input
                  type="datetime-local"
                  name="resultDateTime"
                  value={formData.resultDateTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status:</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">Add Game</button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Game Modal */}
      {showEditForm && editingGame && originalGameData && (
        <div className="add-game-modal">
          <div className="add-game-form">
            <div className="form-header">
              <h2>Edit Game</h2>
              <button 
                className="close-modal-btn"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingGame(null);
                  setOriginalGameData(null);
                  resetForm();
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Original Data Display */}
            <div className="original-data-info">
              <h3>Original Game Data:</h3>
              <div className="original-data-grid">
                <div className="original-item">
                  <span className="label">Name:</span>
                  <span className="value">{originalGameData.name}</span>
                </div>
                <div className="original-item">
                  <span className="label">Type:</span>
                  <span className="value">{originalGameData.type || originalGameData.gameType}</span>
                </div>
                <div className="original-item">
                  <span className="label">Status:</span>
                  <span className="value">{originalGameData.status}</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Game Name:</label>
                {isFieldModified('name') && <div className="modified-indicator">Modified</div>}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={isFieldModified('name') ? 'modified-field' : ''}
                  required
                />
              </div>

              <div className="form-group">
                <label>Game Type:</label>
                {isFieldModified('type') && <div className="modified-indicator">Modified</div>}
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  className={isFieldModified('type') ? 'modified-field' : ''}
                >
                  <option value="regular">Regular</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div className="form-group">
                <label>Open DateTime:</label>
                {isFieldModified('openDateTime') && <div className="modified-indicator">Modified</div>}
                <input
                  type="datetime-local"
                  name="openDateTime"
                  value={formData.openDateTime}
                  onChange={handleChange}
                  className={isFieldModified('openDateTime') ? 'modified-field' : ''}
                />
              </div>

              <div className="form-group">
                <label>Close DateTime:</label>
                {isFieldModified('closeDateTime') && <div className="modified-indicator">Modified</div>}
                <input
                  type="datetime-local"
                  name="closeDateTime"
                  value={formData.closeDateTime}
                  onChange={handleChange}
                  className={isFieldModified('closeDateTime') ? 'modified-field' : ''}
                />
              </div>

              <div className="form-group">
                <label>Result DateTime:</label>
                {isFieldModified('resultDateTime') && <div className="modified-indicator">Modified</div>}
                <input
                  type="datetime-local"
                  name="resultDateTime"
                  value={formData.resultDateTime}
                  onChange={handleChange}
                  className={isFieldModified('resultDateTime') ? 'modified-field' : ''}
                />
              </div>

              <div className="form-group">
                <label>Status:</label>
                {isFieldModified('status') && <div className="modified-indicator">Modified</div>}
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                  className={isFieldModified('status') ? 'modified-field' : ''}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update Game'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingGame(null);
                    setOriginalGameData(null);
                    resetForm();
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="games-table__wrapper">
        <table>
          <thead>
            <tr>
              <th>Game Details</th>
              <th>Open Time</th>
              <th>Close Time</th>
              <th>Result Time</th>
              <th>Rates</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => {
              const gameType = game.type || game.gameType || 'regular';
              return (
                <tr key={game._id}>
                  <td>
                    <div className="game-info">
                      <div className="game-avatar">{game.name.charAt(0)}</div>
                      <div className="game-details">
                        <div className="game-name">{game.name}</div>
                        <div className="game-type">
                          {getTypeIcon(gameType)}
                          <span>{gameType}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="time-info open-time">
                      <Clock className="time-icon" />
                      <span>{game.openTime}</span>
                    </div>
                  </td>
                  <td>
                    <div className="time-info close-time">
                      <Clock className="time-icon" />
                      <span>{game.closeTime}</span>
                    </div>
                  </td>
                  <td>
                    <div className="time-info result-time">
                      <Target className="time-icon" />
                      <span>{game.resultTime}</span>
                    </div>
                  </td>
                  <td>
                    <div className="rates-info">
                      <div className="rate-item">
                        <IndianRupee className="rate-icon" />
                        <span className="rate-label">Single:</span>
                        <span className="rate-value single">{game.singleDigit}</span>
                      </div>
                      <div className="rate-item">
                        <IndianRupee className="rate-icon" />
                        <span className="rate-label">Jodi:</span>
                        <span className="rate-value jodi">{game.jodiDigit}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="status-info">
                      {getStatusIcon(game.status)}
                      <span className={`status-text ${game.status}`}>{game.status}</span>
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(game)}
                        title="Edit Game"
                        disabled={isUpdating}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(game._id)}
                        disabled={isDeleting === game._id || isUpdating}
                        title="Delete Game"
                      >
                        {isDeleting === game._id ? (
                          <div className="loading-spinner"></div>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GamesTable;