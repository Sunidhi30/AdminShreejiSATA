
import React, { useEffect, useState } from "react";
import "./GamesRate.scss";

interface Game {
  _id: string;
  name: string;
}

interface GameRate {
  _id: string;
  gameId: Game;
  rateType: 'single_digit';
  rate: number;
  minBet: number;
  maxBet: number;
  isActive: boolean;
  createdAt: string;
}

interface RateFormData {
  rateType: 'single_digit' ;
  rate: number;
  minBet: number;
  maxBet: number;
}

const GamesRate: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [games, setGames] = useState<Game[]>([]);
  const [rates, setRates] = useState<GameRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  
  const [formData, setFormData] = useState<RateFormData>({
    rateType: 'single_digit',
    rate: 10,
    minBet: 10,
    maxBet: 10000
  });

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (selectedGame) {
      fetchRates(selectedGame);
    }
  }, [selectedGame]);

  const fetchGames = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("https://satashreejibackend.onrender.com/api/admin/games", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setGames(data.games);
      }
    } catch (err) {
      setError("Failed to fetch games");
    }
  };

  const fetchRates = async (gameId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`https://satashreejibackend.onrender.com/api/admin/games/${gameId}/rates`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setRates(data.rates);
      }
    } catch (err) {
      setError("Failed to fetch rates");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame) {
      setError("Please select a game first");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`https://satashreejibackend.onrender.com/api/admin/games/${selectedGame}/rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess("Rate updated successfully");
        fetchRates(selectedGame);
        // Reset form
        setFormData({
          rateType: 'single_digit',
          rate: 10,
          minBet: 10,
          maxBet: 10000
        });
      }
    } catch (err) {
      setError("Failed to update rate");
    }
  };

  return (
    <div className="games-rate-container">
      <div className="games-rate-header">
        <h1>Games Rate Management</h1>
        <select 
          value={selectedGame} 
          onChange={(e) => setSelectedGame(e.target.value)}
          className="game-select"
        >
          <option value="">Select Game</option>
          {games.map(game => (
            <option key={game._id} value={game._id}>{game.name}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="games-rate-content">
        <div className="rate-form-section">
          <h2>Add/Update Rate</h2>
          <form onSubmit={handleSubmit} className="rate-form">
            <div className="form-group">
              <label>Rate Type</label>
              <select
                value={formData.rateType}
                onChange={(e) => setFormData({...formData, rateType: e.target.value as any})}
              >
                <option value="single_digit">Single Digit</option>
                {/* <option value="jodi_digit">Jodi Digit</option>
                <option value="spinner">Spinner</option> */}
              </select>
            </div>

            <div className="form-group">
              <label>Rate</label>
              <input
                type="number"
                value={formData.rate}
                onChange={(e) => setFormData({...formData, rate: Number(e.target.value)})}
              />
            </div>

            <div className="form-group">
              <label>Minimum Bet</label>
              <input
                type="number"
                value={formData.minBet}
                onChange={(e) => setFormData({...formData, minBet: Number(e.target.value)})}
              />
            </div>

            <div className="form-group">
              <label>Maximum Bet</label>
              <input
                type="number"
                value={formData.maxBet}
                onChange={(e) => setFormData({...formData, maxBet: Number(e.target.value)})}
              />
            </div>

            <button type="submit" className="submit-btn">
              Save Rate
            </button>
          </form>
        </div>

        <div className="rates-list-section">
          <h2>Current Rates</h2>
          {loading ? (
            <div className="loading">Loading rates...</div>
          ) : (
            <div className="rates-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Rate</th>
                    <th>Min Bet</th>
                    <th>Max Bet</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.map(rate => (
                    <tr key={rate._id}>
                      <td>{rate.rateType.replace('_', ' ').toUpperCase()}</td>
                      <td>{rate.rate}</td>
                      <td>{rate.minBet}</td>
                      <td>{rate.maxBet}</td>
                      <td>
                        <span className={`status ${rate.isActive ? 'active' : 'inactive'}`}>
                          {rate.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(rate.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamesRate;