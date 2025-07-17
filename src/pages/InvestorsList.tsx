import { Calendar, ChevronDown, Clock, DollarSign, Mail, TrendingUp, User, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import './investors.scss';

interface Game {
  _id: string;
  name: string;
  openTime: string;
  closeTime: string;
  resultTime: string;
  status: string;
  gameType: string;
  rates: {
    singleDigit: number;
    jodiDigit: number;
  };
}

interface Investor {
  userId: string;
  username: string;
  email: string;
  profileImage: string;
  betAmount: number;
  betNumber: number;
  betType: string;
  session: string;
  status: string;
  createdAt: string;
}

interface InvestorResponse {
  success: boolean;
  gameId: string;
  totalInvestors: number;
  investors: Investor[];
}

const InvestorList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [totalInvestors, setTotalInvestors] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gameLoading, setGameLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'lowest' | 'highest'>('lowest');

  // Get adminToken from localStorage
  const adminToken = localStorage.getItem('adminToken');

  const fetchGames = async () => {
    try {
      setGameLoading(true);
      const response = await fetch('https://satashreejibackend.onrender.com/api/admin/games', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setGames(data.games);
        if (data.games.length > 0) {
          setSelectedGame(data.games[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setGameLoading(false);
    }
  };

  const fetchInvestors = async (gameId: string, sort: 'lowest' | 'highest' = 'lowest') => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://satashreejibackend.onrender.com/api/admin/games/${gameId}/investors?sort=${sort}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      const data: InvestorResponse = await response.json();
      if (data.success) {
        setInvestors(data.investors);
        setTotalInvestors(data.totalInvestors);
      }
    } catch (error) {
      console.error('Error fetching investors:', error);
      setInvestors([]);
      setTotalInvestors(0);
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setDropdownOpen(false);
    fetchInvestors(game._id, sortBy);
  };

  const handleSortChange = (newSort: 'lowest' | 'highest') => {
    setSortBy(newSort);
    if (selectedGame) {
      fetchInvestors(selectedGame._id, newSort);
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'won';
      case 'lost': return 'lost';
      case 'pending': return 'pending';
      default: return 'pending';
    }
  };

  const getBetTypeColor = (betType: string) => {
    switch (betType) {
      case 'single': return 'single';
      case 'jodi': return 'jodi';
      default: return 'single';
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (selectedGame) {
      fetchInvestors(selectedGame._id, sortBy);
    }
  }, [selectedGame]);

  if (gameLoading) {
    return (
      <div className="investor-list">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading games...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="investor-list">
      <div className="investor-list__header">
        <div className="header-left">
          <h2>Game Investors</h2>
          <p>Manage and view investors for each game</p>
        </div>
        
        <div className="header-actions">
          <div className="sort-controls">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value as 'lowest' | 'highest')}
              className="sort-select"
            >
              <option value="lowest">Lowest Bet</option>
              <option value="highest">Highest Bet</option>
            </select>
          </div>
          
          <div className="game-selector">
            <button 
              className="game-dropdown-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="selected-game">
                {selectedGame ? selectedGame.name : 'Select Game'}
              </span>
              <ChevronDown className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`} />
            </button>
            
            {dropdownOpen && (
              <div className="game-dropdown">
                {games.map((game) => (
                  <button
                    key={game._id}
                    className={`game-option ${selectedGame?._id === game._id ? 'selected' : ''}`}
                    onClick={() => handleGameSelect(game)}
                  >
                    <div className="game-option-info">
                      <span className="game-name">{game.name}</span>
                      <span className="game-timing">{game.openTime} - {game.closeTime}</span>
                    </div>
                    <span className={`game-status ${game.status}`}>
                      {game.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedGame && (
        <div className="game-info-card">
          <div className="game-avatar">
            {selectedGame.name.charAt(0).toUpperCase()}
          </div>
          <div className="game-details">
            <h3>{selectedGame.name}</h3>
            <div className="game-meta">
              <span className="game-timing">
                <Clock size={16} />
                {selectedGame.openTime} - {selectedGame.closeTime}
              </span>
              <span className={`game-status ${selectedGame.status}`}>
                {selectedGame.status}
              </span>
            </div>
          </div>
          <div className="total-investors">
            <Users size={20} />
            <span>{totalInvestors} Investors</span>
          </div>
        </div>
      )}

      <div className="investor-list__wrapper">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading investors...</p>
          </div>
        ) : investors.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Investor</th>
                <th>Contact</th>
                <th>Bet Details</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {investors.map((investor, index) => (
                <tr key={`${investor.userId}-${index}`}>
                  <td>
                    <div className="investor-info">
                      <div className="investor-avatar">
                        {investor.profileImage ? (
                          <img src={investor.profileImage} alt={investor.username} />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div className="investor-details">
                        <div className="investor-name">{investor.username}</div>
                        <div className="investor-id">ID: {investor.userId.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="email">
                        <Mail size={14} />
                        {investor.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="bet-details">
                      <div className="bet-number">
                        <TrendingUp size={14} />
                        Number: {investor.betNumber}
                      </div>
                      <div className={`bet-type ${getBetTypeColor(investor.betType)}`}>
                        {investor.betType}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="amount-info">
                      <DollarSign size={16} />
                      <span className="amount">₹{investor.betAmount}</span>
                    </div>
                  </td>
                  <td>
                    <div className={`status-badge ${getStatusColor(investor.status)}`}>
                      {investor.status}
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <Calendar size={14} />
                      {formatDate(investor.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <Users size={48} />
            <h3>No Investors Found</h3>
            <p>
              {selectedGame 
                ? `No investors have placed bets on ${selectedGame.name} yet.`
                : 'Please select a game to view investors.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorList;