{/* Neo Mwashi */}
{/*Emmanuel wema*/}
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './App.css'
import { adminSessionKey, getSession } from './auth/adminAuth.js'
import AdminLogin from './components/AdminLogin.jsx'
import { AdminSidebar } from './components/administratornavbar.jsx'
import LandingPage from './components/LandingPage.jsx'
import UserLogin from './components/UserLogin.jsx'
import UserRegister from './Components/UserRegister.jsx'
import ProductList from './products/ProductList.jsx'
import ProductPage from './products/ProductPage.jsx'

function ProtectedAdminRoute() {
  const session = getSession(adminSessionKey);
  const isAuthenticated = session?.role === "Admin";

  return isAuthenticated ? (
    <AdminSidebar />
  ) : (
    <Navigate to="/admin/login" replace state={{ from: "/admin" }} />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdminRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;