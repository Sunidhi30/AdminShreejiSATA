
// import { Pause, Play, TrendingUp, Trophy } from "lucide-react";
// import React from "react";
// import "./GamesTable.scss"; // Import SCSS for styling

// interface Game {
//   name: string;
//   openTime: string;
//   closeTime: string;
//   resultTime: string;
//   status: string;
//   type: string;
//   singleDigit: number;
//   jodiDigit: number;
// }

// interface GamesTableProps {
//   games: Game[];
// }

// const GamesTable: React.FC<GamesTableProps> = ({ games }) => {
//   const getStatusIcon = (status: string) =>
//     status === "active" ? (
//       <Play className="status-icon active" />
//     ) : (
//       <Pause className="status-icon inactive" />
//     );

//   const getTypeIcon = (type: string) =>
//     type === "regular" ? (
//       <TrendingUp className="type-icon regular" />
//     ) : (
//       <Trophy className="type-icon premium" />
//     );

//   return (
//     <div className="games-table">
//       {/* <h2>Games Overview</h2> */}
//       <table>
//         <thead>
//           <tr>
//             <th>Game</th>
//             <th>Timing</th>
//             <th>Rates</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {games.map((game, index) => (
//             <tr key={index}>
//               <td>
//                 {getTypeIcon(game.type)} {game.name}
//               </td>
//               <td>
//                 Open: {game.openTime} <br />
//                 Close: {game.closeTime} <br />
//                 Result: {game.resultTime}
//               </td>
//               <td>
//                 Single: {game.singleDigit} <br />
//                 Jodi: {game.jodiDigit}
//               </td>
//               <td>
//                 {getStatusIcon(game.status)} {game.status}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

import { Clock, DollarSign, Pause, Play, Target, TrendingUp, Trophy } from "lucide-react";
import React from "react";
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
    {
      name: "Delhi Bazaar",
      openTime: "10:30 AM",
      closeTime: "12:30 PM",
      resultTime: "01:00 PM",
      status: "inactive",
      type: "premium",
      singleDigit: 98,
      jodiDigit: 980
    },
    {
      name: "Kolkata Night",
      openTime: "08:00 PM",
      closeTime: "10:00 PM",
      resultTime: "10:30 PM",
      status: "active",
      type: "regular",
      singleDigit: 92,
      jodiDigit: 920
    },
    {
      name: "Goa Special",
      openTime: "02:00 PM",
      closeTime: "04:00 PM",
      resultTime: "04:30 PM",
      status: "active",
      type: "premium",
      singleDigit: 99,
      jodiDigit: 990
    }
  ];

  const displayGames = games.length > 0 ? games : sampleGames;

  return (
    <div className="games-table">
      <div className="games-table__header">
        <h2>Games Dashboard</h2>
        <p>Manage and monitor all gaming activities</p>
      </div>

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
                    <div className="game-avatar">
                      {game.name.charAt(0)}
                    </div>
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
                      <DollarSign className="rate-icon" />
                      <span className="rate-label">Single:</span>
                      <span className="rate-value single">{game.singleDigit}</span>
                    </div>
                    <div className="rate-item">
                      <DollarSign className="rate-icon" />
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

      {displayGames.length === 0 && (
        <div className="empty-state">
          <Trophy className="empty-icon" />
          <h3>No Games Found</h3>
          <p>There are no games to display at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default GamesTable;
