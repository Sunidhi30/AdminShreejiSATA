
import React, { useEffect, useState } from "react";
import GamesTable from "../components/tables/customTable/gamesTable/GameTable"; // ✅ Import the GamesTable


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

const Products: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch("https://satashreejibackend.onrender.com/api/admin/games", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.games)) {
          const mappedGames: Game[] = data.games.map((game: any) => ({
            name: game.name,
            openTime: new Date(game.openDateTime).toLocaleString(), // ⬅️ formatted nicely
            closeTime: new Date(game.closeDateTime).toLocaleString(), // ⬅️ formatted nicely
            resultTime: new Date(game.resultDateTime).toLocaleString(), // ⬅️ formatted nicely
            status: game.status,
            type: game.gameType,
            singleDigit: game.rates.singleDigit,
            jodiDigit: game.rates.jodiDigit,
          }));
          
          setGames(mappedGames);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err: any) {
        console.error("Error fetching games:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span>Loading games...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* <div className="products-header">
        <h1>Games Dashboard</h1>
        <p>Monitor and manage all gaming activities</p>
      </div> */}
      <GamesTable games={games} />
    </div>
  );
};



export default Products;
