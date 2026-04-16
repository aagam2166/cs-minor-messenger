import { Routes, Route } from "react-router-dom";
import Chat from "../pages/Chat";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import ProfileDesign from "../sandbox/ProfileDesign";
import Inbox from "../pages/Inbox";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import UserProfile from "../pages/UserProfile";

function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
  path="/chat/:conversationId"
  element={
    <ProtectedRoute>
      <MainLayout>
        <Chat />
      </MainLayout>
    </ProtectedRoute>
  }
/>


      <Route
  path="/inbox"
  element={
    <ProtectedRoute>
      <MainLayout>
        <Inbox />
      </MainLayout>
    </ProtectedRoute>
  }
/>

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
  path="/users/:username"
  element={
    <ProtectedRoute>
      <MainLayout>
        <UserProfile />
      </MainLayout>
    </ProtectedRoute>
  }
/>

     


      <Route path="/sandbox/profile" element={<ProfileDesign />} />

    </Routes>
  );
}

export default AppRoutes;
