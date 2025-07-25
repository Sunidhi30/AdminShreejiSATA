import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoadingSpinner from "./components/UI/loadingSpinner/LoadingSpinner";
import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./layout/MainLayout";
import AdminNotices from "./pages/AdminNotices";
import "./scss/App.scss";
const AdminProfile =React.lazy(() => import("./pages/AdminProfile"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Customers = React.lazy(() => import("./pages/Customers"));
const CustomerEdit = React.lazy(() => import("./pages/CustomerEdit"));
const Products = React.lazy(() => import("./pages/Products"));
const ProductEdit = React.lazy(() => import("./pages/ProductEdit"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const BlankPage = React.lazy(() => import("./pages/BlankPage"));
const Login = React.lazy(() => import("./pages/Login"));
const GamesRate = React.lazy(() => import("./pages/GamesRate")); // Import the new GamesRate page
const GameResult = React.lazy(() => import("./pages/GameResult")); // Import the new GameResult page
const GamesListWithInvestors =React.lazy(() => import("./pages/InvestorsList")); // Import the new GameResult page
const InvestorList = React.lazy(() => import("./pages/InvestorsList")); // Import the new GameResult page
const WiinningDetails = React.lazy(() => import("./pages/WinnersList")); // Import the new GameResult page
const UserWithdraw =React.lazy(() => import("./pages/WithdrawUsers")); // Import the new GameResult page
const UserDeposit =React.lazy(() => import("./pages/UserDeposit"));
const Hardgames = React.lazy(() => import("./pages/UploadGameForm"));
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:customerId" element={<CustomerEdit />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:productId" element={<ProductEdit />} />
                <Route path="/games-rate" element={<GamesRate />} /> {/* Add this new route */}
                <Route path="/hard-games" element={<Hardgames />} /> {/* Add this new route */}

                          <Route path="/game-results" element={<GameResult />} />
<Route path="/investors-list" element={<GamesListWithInvestors />} />
             <Route path="/admin/investors" element={<InvestorList />} />
<Route path="/Winning-details" element={<WiinningDetails />} />
      <Route path="/users-withdraw" element={<UserWithdraw />} />
      <Route path="/users-Deposit" element={<UserDeposit />} />
            <Route path="/notices" element={<AdminNotices />} />
            <Route path="/admin-profile" element={<AdminProfile />} />
        
              <Route path="/orders" element={<BlankPage />} />
              <Route path="/analytics" element={<BlankPage />} />
              <Route path="/discount" element={<BlankPage />} />
              <Route path="/inventory" element={<BlankPage />} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
