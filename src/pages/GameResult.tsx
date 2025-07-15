import React, { useEffect, useState } from 'react';
import './GameResult.scss';

interface Game {
  _id: string;
  name: string;
}

interface Result {
  _id: string;
  gameId: {
    _id: string;
    name: string;
  };
  date: string;
  openResult?: number;
  closeResult?: number;
  spinnerResult?: number;
  createdAt: string;
}

interface Pagination {
  current: number;
  pages: number;
  total: number;
}

interface ApiResponse {
  success: boolean;
  results: Result[];
  pagination: Pagination;
}

interface DeclareResultForm {
  gameId: string;
  date: string;
  openResult: string;
  closeResult: string;
  spinnerResult: string;
}

const GameResult: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [pagination, setPagination] = useState<Pagination>({ current: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<DeclareResultForm>({
    gameId: '',
    date: new Date().toISOString().split('T')[0],
    openResult: '',
    closeResult: '',
    spinnerResult: ''
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const API_BASE_URL = 'http://localhost:9000/api/admin';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch games list
  const fetchGames = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/games`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setGames(data.games || []);
        if (data.games?.length > 0) {
          setSelectedGame(data.games[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  // Fetch results for selected game
  const fetchResults = async (gameId: string, page: number = 1) => {
    if (!gameId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/games/${gameId}/results?page=${page}&limit=10`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data: ApiResponse = await response.json();
        setResults(data.results);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  // Declare result
  const declareResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        date: formData.date,
        ...(formData.openResult && { openResult: parseInt(formData.openResult) }),
        ...(formData.closeResult && { closeResult: parseInt(formData.closeResult) }),
        ...(formData.spinnerResult && { spinnerResult: parseInt(formData.spinnerResult) })
      };

      const response = await fetch(`${API_BASE_URL}/games/${formData.gameId}/results`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          gameId: '',
          date: new Date().toISOString().split('T')[0],
          openResult: '',
          closeResult: '',
          spinnerResult: ''
        });
        // Refresh results
        if (selectedGame) {
          fetchResults(selectedGame);
        }
        alert('Result declared successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error declaring result:', error);
      alert('Error declaring result');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (selectedGame) {
      fetchResults(selectedGame, page);
    }
  };
const formatDateTime = (dateString: string) => {
  if (!dateString) return '-';
  let parsedDate = new Date(dateString);

  if (isNaN(parsedDate.getTime())) {
    // Try fixing common issues like wrong separators
    parsedDate = new Date(dateString.replace(/-/g, '/'));
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date';
    }
  }

  return parsedDate.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // optional: shows AM/PM
  });
};

//   // Format date for display
//  const formatDate = (dateString: string) => {
//   if (!dateString) return '-'; // Handle empty dates gracefully
//   const parsedDate = new Date(dateString);

//   if (isNaN(parsedDate.getTime())) {
//     // Try replacing dashes with slashes (common issue)
//     const fixedDate = new Date(dateString.replace(/-/g, '/'));
//     if (!isNaN(fixedDate.getTime())) {
//       return fixedDate.toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       });
//     }
//     return 'Invalid Date';
//   }

//   return parsedDate.toLocaleDateString('en-IN', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });
// };

// const formatTime = (dateString: string) => {
//   if (!dateString) return '-';
//   const parsedDate = new Date(dateString);

//   if (isNaN(parsedDate.getTime())) {
//     const fixedDate = new Date(dateString.replace(/-/g, '/'));
//     if (!isNaN(fixedDate.getTime())) {
//       return fixedDate.toLocaleTimeString('en-IN', {
//         hour: '2-digit',
//         minute: '2-digit',
//       });
//     }
//     return 'Invalid Time';
//   }

//   return parsedDate.toLocaleTimeString('en-IN', {
//     hour: '2-digit',
//     minute: '2-digit',
//   });
// };


  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (selectedGame) {
      fetchResults(selectedGame);
    }
  }, [selectedGame]);

  return (
    <div className="game-result-container">
      <div className="game-result-header">
        <h1>Game Results</h1>
        <button 
          className="declare-btn"
          onClick={() => setShowModal(true)}
        >
          Declare Result
        </button>
      </div>

      <div className="game-selector">
        <label htmlFor="game-select">Select Game:</label>
        <select
          id="game-select"
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
        >
          <option value="">Select a game</option>
          {games.map(game => (
            <option key={game._id} value={game._id}>
              {game.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading results...</div>
      ) : (
        <>
          <div className="results-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Game</th>
                  <th>Open Result</th>
                  <th>Close Result</th>
                  <th>Spinner Result</th>
                  <th>Declared At</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="no-results">
                      No results found
                    </td>
                  </tr>
                ) : (
                  results.map(result => (
                    <tr key={result._id}>
                     <td>{formatDateTime(result.date)}</td>

                      <td>{result.gameId.name}</td>
                      <td className="result-digit">
                        {result.openResult !== undefined ? result.openResult : '-'}
                      </td>
                      <td className="result-digit">
                        {result.closeResult !== undefined ? result.closeResult : '-'}
                      </td>
                      <td className="result-digit">
                        {result.spinnerResult !== undefined ? result.spinnerResult : '-'}
                      </td>
                     <td>{formatDateTime(result.createdAt)}</td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={pagination.current === page ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Declare Result</h2>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={declareResult} className="declare-form">
              <div className="form-group">
                <label htmlFor="modal-game-select">Game:</label>
                <select
                  id="modal-game-select"
                  name="gameId"
                  value={formData.gameId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a game</option>
                  {games.map(game => (
                    <option key={game._id} value={game._id}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="openResult">Open Result (0-9):</label>
                <input
                  type="number"
                  id="openResult"
                  name="openResult"
                  value={formData.openResult}
                  onChange={handleInputChange}
                  min="0"
                  max="9"
                  placeholder="Optional"
                />
              </div>

              <div className="form-group">
                <label htmlFor="closeResult">Close Result (0-9):</label>
                <input
                  type="number"
                  id="closeResult"
                  name="closeResult"
                  value={formData.closeResult}
                  onChange={handleInputChange}
                  min="0"
                  max="9"
                  placeholder="Optional"
                />
              </div>

              <div className="form-group">
                <label htmlFor="spinnerResult">Spinner Result (0-9):</label>
                <input
                  type="number"
                  id="spinnerResult"
                  name="spinnerResult"
                  value={formData.spinnerResult}
                  onChange={handleInputChange}
                  min="0"
                  max="9"
                  placeholder="Optional"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Declaring...' : 'Declare Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameResult;