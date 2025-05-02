import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewPost from "./pages/NewPost";
import MyPosts from "./pages/MyPosts";
import BiddingHistory from "./pages/BiddingHistory";
import OnGoingBids from "./pages/OnGoingBids";
import AllPosts from "./pages/AllPosts"; 
import Auctions from "./pages/Auctions";
import AuctionDetail from "./pages/AuctionDetail";
import AuctionDetails from "./pages/AuctionDetail";
import ProfileSettings from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Posts routes */}
            <Route path="/AuctionDetails" element={<AuctionDetails />}/>
            <Route path="/ProfileSettings" element={<ProfileSettings />} />

            <Route path="/all_posts" element={<AllPosts />}/>
            <Route path="/new_post" element={<NewPost />} />
            <Route path="/my_posts" element={<MyPosts />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/auction_details/:id" element={<AuctionDetail />} />

              {/* Add other post-related routes here */}
            <Route path="/bids/history" element={<BiddingHistory />} />
            <Route path="/bids/ongoing" element={<OnGoingBids />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;