
import { Clock, IndianRupee, Pause, Play, Plus, Target, TrendingUp, Trophy } from "lucide-react";
import React, { useState } from "react";
import "./GamesTable.scss";

interface Game {
  name: string;
  openTime: string;
  closeTime: string;
  resultTime: string;
  status: string;
  type: string;
  singleDigit: number;
  jodiDigit: number;
}

interface GamesTableProps {
  games: Game[];
}

const GamesTable: React.FC<GamesTableProps> = ({ games }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'regular',
    openDateTime: '', // ⬅️ Updated
    closeDateTime: '', // ⬅️ Updated
    resultDateTime: '', // ⬅️ Updated
    status: 'active'
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Adjust datetime fields to ISO format
    const adjustedFormData = {
      ...formData,
      openDateTime: new Date(formData.openDateTime).toISOString(),
      closeDateTime: new Date(formData.closeDateTime).toISOString(),
      resultDateTime: new Date(formData.resultDateTime).toISOString(),
    };
  
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch('https://satashreejibackend.onrender.com/api/admin/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(adjustedFormData),
      });
  
      if (response.ok) {
        setShowAddForm(false);
      } else {
        throw new Error('Failed to add game');
      }
    } catch (error) {
      console.error('Error adding game:', error);
    }
  };
  

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('https://satashreejibackend.onrender.com/api/admin/games', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //         ,
  //       },
  //       body: JSON.stringify(formData),
  //     });
      
  //     if (response.ok) {
  //       setShowAddForm(false);
  //       // You might want to refresh your games list here
  //     } else {
  //       throw new Error('Failed to add game');
  //     }
  //   } catch (error) {
  //     console.error('Error adding game:', error);
  //   }
  // };

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

  // Sample data for demonstration
  const sampleGames: Game[] = [
    {
      name: "Mumbai Morning",
      openTime: "09:00 AM",
      closeTime: "11:00 AM",
      resultTime: "11:30 AM",
      status: "active",
      type: "regular",
      singleDigit: 95,
      jodiDigit: 950
    },
    // ... other sample games
  ];

  const displayGames = games.length > 0 ? games : sampleGames;

  return (
    <div className="games-table">
      <div className="games-table__header">
        <div className="header-left">
          <h2>Games Dashboard</h2>
          <p>Manage and monitor all gaming activities</p>
        </div>
        <button 
          className="add-game-btn"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          Add Game
        </button>
      </div>

      {showAddForm && (
        <div className="add-game-modal">
          <div className="add-game-form">
            <h2>Add New Game</h2>
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
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
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
            </tr>
          </thead>
          <tbody>
            {displayGames.map((game, index) => (
              <tr key={index}>
                <td>
                  <div className="game-info">
                    <div className="game-avatar">{game.name.charAt(0)}</div>
                    <div className="game-details">
                      <div className="game-name">{game.name}</div>
                      <div className="game-type">
                        {getTypeIcon(game.type)}
                        <span>{game.type}</span>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GamesTable;