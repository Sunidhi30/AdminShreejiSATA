import React, { useEffect, useState } from 'react';
import './UploadGameForm.scss';

interface Game {
  _id: string;
  gameName: string;
  resultInterval: number;
  lastResultTime: string;
  isActive: boolean;
  minBet: number;
  maxBet: number;
  multiplier: number;
  description: string;
  resultMode: 'admin_controlled' | 'random';
  nextResults: any[];
  createdAt: string;
  updatedAt: string;
}

interface GameFormData {
  gameName: string;
  resultInterval: number;
  minBet: number;
  maxBet: number;
  multiplier: number;
  description: string;
}

const AdminGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState<GameFormData>({
    gameName: '',
    resultInterval: 1,
    minBet: 10,
    maxBet: 10000,
    multiplier: 9,
    description: 'Select a number (0-9) and spin to win!'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const baseURL = 'https://satashreejibackend.onrender.com/api/admin/games';

  // Get token from localStorage
  const getAuthToken = (): string | null => {
    return localStorage.getItem('adminToken');
  };

  // API Headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  });

  // Fetch all games
  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/games`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setGames(data.games);
      } else {
        setError('Failed to fetch games');
      }
    } catch (err) {
      setError('Error fetching games: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Add new game
  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/upload-game`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Game added successfully!');
        setShowAddModal(false);
        resetForm();
        fetchGames();
      } else {
        setError(data.error || 'Failed to add game');
      }
    } catch (err) {
      setError('Error adding game: ' + (err as Error).message);
    }
  };

  // Update game
  const handleUpdateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;

    try {
      const response = await fetch(`${baseURL}/games/${editingGame._id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Game updated successfully!');
        setShowEditModal(false);
        setEditingGame(null);
        resetForm();
        fetchGames();
      } else {
        setError(data.error || 'Failed to update game');
      }
    } catch (err) {
      setError('Error updating game: ' + (err as Error).message);
    }
  };

  // Toggle game active status
  const toggleGameStatus = async (gameId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${baseURL}/games/${gameId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`Game ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        fetchGames();
      } else {
        setError(data.error || 'Failed to update game status');
      }
    } catch (err) {
      setError('Error updating game status: ' + (err as Error).message);
    }
  };

  // Toggle result mode
  const toggleResultMode = async (gameId: string, currentMode: string) => {
    const newMode = currentMode === 'admin_controlled' ? 'random' : 'admin_controlled';
    
    try {
      const response = await fetch(`${baseURL}/result-mode/${gameId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ mode: newMode })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`Result mode changed to ${newMode}!`);
        fetchGames();
      } else {
        setError(data.error || 'Failed to update result mode');
      }
    } catch (err) {
      setError('Error updating result mode: ' + (err as Error).message);
    }
  };

  const resetForm = () => {
    setFormData({
      gameName: '',
      resultInterval: 1,
      minBet: 10,
      maxBet: 10000,
      multiplier: 9,
      description: 'Select a number (0-9) and spin to win!'
    });
  };

  const openEditModal = (game: Game) => {
    setFormData({
      gameName: game.gameName,
      resultInterval: game.resultInterval,
      minBet: game.minBet,
      maxBet: game.maxBet,
      multiplier: game.multiplier,
      description: game.description
    });
    setEditingGame(game);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingGame(null);
    resetForm();
    setError('');
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="admin-games">
      <div className="admin-games__header">
        <h1 className="admin-games__title">Game Management</h1>
        <button 
          className="admin-games__add-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add New Game
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="admin-games__alert admin-games__alert--error">
          {error}
        </div>
      )}
      {success && (
        <div className="admin-games__alert admin-games__alert--success">
          {success}
        </div>
      )}

      {/* Games Table */}
      <div className="admin-games__table-container">
        {loading ? (
          <div className="admin-games__loading">Loading games...</div>
        ) : games.length === 0 ? (
          <div className="admin-games__empty">No games found</div>
        ) : (
          <table className="admin-games__table">
            <thead>
              <tr>
                <th>Game Name</th>
                <th>Result Interval (min)</th>
                <th>Min Bet</th>
                <th>Max Bet</th>
                <th>Multiplier</th>
                <th>Status</th>
                <th>Result Mode</th>
                <th>Last Result</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game._id}>
                  <td className="admin-games__game-name">{game.gameName}</td>
                  <td>{game.resultInterval}</td>
                  <td>₹{game.minBet}</td>
                  <td>₹{game.maxBet}</td>
                  <td>{game.multiplier}x</td>
                  <td>
                    <button
                      className={`admin-games__status-btn ${
                        game.isActive ? 'admin-games__status-btn--active' : 'admin-games__status-btn--inactive'
                      }`}
                      onClick={() => toggleGameStatus(game._id, game.isActive)}
                    >
                      {game.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <button
                      className={`admin-games__mode-btn ${
                        game.resultMode === 'admin_controlled' ? 'admin-games__mode-btn--controlled' : 'admin-games__mode-btn--random'
                      }`}
                      onClick={() => toggleResultMode(game._id, game.resultMode)}
                    >
                      {game.resultMode === 'admin_controlled' ? 'Controlled' : 'Random'}
                    </button>
                  </td>
                  <td>{game.lastResultTime ? formatDate(game.lastResultTime) : 'N/A'}</td>
                  <td>
                    <button
                      className="admin-games__edit-btn"
                      onClick={() => openEditModal(game)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Game Modal */}
      {showAddModal && (
        <div className="admin-games__modal-overlay">
          <div className="admin-games__modal">
            <div className="admin-games__modal-header">
              <h2>Add New Game</h2>
              <button className="admin-games__close-btn" onClick={closeModals}>×</button>
            </div>
            <form onSubmit={handleAddGame} className="admin-games__form">
              <div className="admin-games__form-group">
                <label>Game Name *</label>
                <input
                  type="text"
                  value={formData.gameName}
                  onChange={(e) => setFormData({...formData, gameName: e.target.value})}
                  required
                />
              </div>
              <div className="admin-games__form-group">
                <label>Result Interval (minutes) *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.resultInterval}
                  onChange={(e) => setFormData({...formData, resultInterval: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="admin-games__form-row">
                <div className="admin-games__form-group">
                  <label>Min Bet</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minBet}
                    onChange={(e) => setFormData({...formData, minBet: Number(e.target.value)})}
                  />
                </div>
                <div className="admin-games__form-group">
                  <label>Max Bet</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxBet}
                    onChange={(e) => setFormData({...formData, maxBet: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="admin-games__form-group">
                <label>Multiplier</label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={formData.multiplier}
                  onChange={(e) => setFormData({...formData, multiplier: Number(e.target.value)})}
                />
              </div>
              <div className="admin-games__form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="admin-games__form-actions">
                <button type="button" onClick={closeModals} className="admin-games__cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-games__submit-btn">
                  Add Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Game Modal */}
      {showEditModal && (
        <div className="admin-games__modal-overlay">
          <div className="admin-games__modal">
            <div className="admin-games__modal-header">
              <h2>Edit Game</h2>
              <button className="admin-games__close-btn" onClick={closeModals}>×</button>
            </div>
            <form onSubmit={handleUpdateGame} className="admin-games__form">
              <div className="admin-games__form-group">
                <label>Game Name *</label>
                <input
                  type="text"
                  value={formData.gameName}
                  onChange={(e) => setFormData({...formData, gameName: e.target.value})}
                  required
                />
              </div>
              <div className="admin-games__form-group">
                <label>Result Interval (minutes) *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.resultInterval}
                  onChange={(e) => setFormData({...formData, resultInterval: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="admin-games__form-row">
                <div className="admin-games__form-group">
                  <label>Min Bet</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minBet}
                    onChange={(e) => setFormData({...formData, minBet: Number(e.target.value)})}
                  />
                </div>
                <div className="admin-games__form-group">
                  <label>Max Bet</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxBet}
                    onChange={(e) => setFormData({...formData, maxBet: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="admin-games__form-group">
                <label>Multiplier</label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={formData.multiplier}
                  onChange={(e) => setFormData({...formData, multiplier: Number(e.target.value)})}
                />
              </div>
              <div className="admin-games__form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="admin-games__form-actions">
                <button type="button" onClick={closeModals} className="admin-games__cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-games__submit-btn">
                  Update Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGames;