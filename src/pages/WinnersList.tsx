import { Calendar, ChevronDown, Clock, DollarSign, Mail, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import './winners.scss';

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

interface Winner {
  betId: string;
  user: {
    username: string;
    email: string;
    mobile: string;
  };
  game: {
    name: string;
    type: string;
  };
  betType: string;
  betNumber: number;
  betAmount: number;
  winningAmount: number;
  resultNumber: number;
  betDate: string;
  session: string;
}

interface WinnersResponse {
  success: boolean;
  data: {
    winners: Winner[];
    summary: {
      totalWinners: number;
      betTypeSummary: any[];
      totalWinAmount: number;
      totalBetAmount: number;
    };
    pagination: {
      currentPage: number;
      totalPages: number;
      totalRecords: number;
      limit: number;
    };
  };
}

const WinnersList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [totalWinners, setTotalWinners] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gameLoading, setGameLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const adminToken = localStorage.getItem('adminToken');

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    setDropdownOpen(false);
    fetchWinners(game._id);
  };

  const fetchGames = async () => {
    try {
      setGameLoading(true);
      const response = await fetch('http://localhost:9000/api/admin/games', {
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

  const fetchWinners = async (gameId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:9000/api/admin/games/${gameId}/winners`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      const data: WinnersResponse = await response.json();
      if (data.success) {
        setWinners(data.data.winners);
        setTotalWinners(data.data.summary.totalWinners);
      }
    } catch (error) {
      console.error('Error fetching winners:', error);
      setWinners([]);
      setTotalWinners(0);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (selectedGame) {
      fetchWinners(selectedGame._id);
    }
  }, [selectedGame]);

  if (gameLoading) {
    return (
      <div className="winners-list">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="winners-list">
      {/* Header Section */}
      <div className="winners-list__header">
        <div className="header-left">
          <h2>Game Winners</h2>
          <p>View all winners for selected games.</p>
        </div>

        <div className="header-actions">
          <div className="game-selector">
            <button
              className="game-dropdown-btn"
              onClick={toggleDropdown}
            >
              <span className="selected-game">
                {selectedGame ? selectedGame.name : "Select a Game"}
              </span>
              <ChevronDown
                size={16}
                className={`dropdown-icon ${dropdownOpen ? "open" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="game-dropdown">
                {games.map((game) => (
                  <button
                    key={game._id}
                    className={`game-option ${
                      selectedGame?._id === game._id ? "selected" : ""
                    }`}
                    onClick={() => handleSelectGame(game)}
                  >
                    <div className="game-option-info">
                      <div className="game-name">{game.name}</div>
                      <div className="game-timing">
                        <Clock size={12} />
                        {game.openTime} - {game.closeTime}
                      </div>
                    </div>
                    <div
                      className={`game-status ${
                        game.status === "active" ? "active" : "inactive"
                      }`}
                    >
                      {game.status}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Game Info Card */}
      {selectedGame && (
        <div className="game-info-card">
          <div className="game-avatar">
            {selectedGame.name.charAt(0).toUpperCase()}
          </div>
          <div className="game-details">
            <h3>{selectedGame.name}</h3>
            <div className="game-meta">
              <div className="game-timing">
                <Clock size={14} />
                {selectedGame.openTime} - {selectedGame.closeTime}
              </div>
              <div
                className={`game-status ${
                  selectedGame.status === "active" ? "active" : "inactive"
                }`}
              >
                {selectedGame.status}
              </div>
            </div>
          </div>
          <div className="total-winners">
            <Trophy size={18} />
            <span>{totalWinners} Winners</span>
          </div>
        </div>
      )}

      {/* Winners Table */}
      <div className="winners-list__wrapper">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading winners...</p>
          </div>
        ) : winners.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Winner</th>
                <th>Contact</th>
                <th>Bet Details</th>
                <th>Winning Amount</th>
                <th>Result Number</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner) => (
                <tr key={winner.betId}>
                  <td>
                    <div className="winner-info">
                      <div className="winner-avatar">
                        <Trophy size={16} />
                      </div>
                      <div className="winner-details">
                        <div className="winner-name">{winner.user.username}</div>
                        <div className="winner-id">ID: {winner.betId.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="email">
                        <Mail size={14} />
                        {winner.user.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="bet-details">
                      <div className="bet-number">
                        Number: {winner.betNumber}
                      </div>
                      <div className={`bet-type ${winner.betType}`}>
                        {winner.betType}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="amount-info winning">
                      <DollarSign size={14} />
                      <span className="amount">₹{winner.winningAmount}</span>
                    </div>
                  </td>
                  <td>
                    <div className="result-number">
                      {winner.resultNumber}
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <Calendar size={12} />
                      {formatDate(winner.betDate)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <Trophy size={48} />
            <h3>No Winners Found</h3>
            <p>
              {selectedGame
                ? `No winners found for ${selectedGame.name} yet.`
                : "Please select a game to view winners."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinnersList;
