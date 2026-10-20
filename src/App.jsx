import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Story from "./pages/Story";
import MenuPage from "./pages/Menu";
import Experience from "./pages/Experience";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";

import Admin from "./pages/Admin";
import AdminOverview from "./pages/AdminOverview";
import AdminMenu from "./pages/AdminMenu";
import AdminReservations from "./pages/AdminReservations";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function DemoAdminLayout({ children }) {
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Frontend demo: no backend login verification */}
        <Route
          path="/admin/login"
          element={<Navigate to="/admin" replace />}
        />

        <Route
          path="/admin"
          element={
            <DemoAdminLayout>
              <AdminOverview />
            </DemoAdminLayout>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <DemoAdminLayout>
              <AdminMenu />
            </DemoAdminLayout>
          }
        />

        <Route
          path="/admin/reservations"
          element={
            <DemoAdminLayout>
              <AdminReservations />
            </DemoAdminLayout>
          }
        />

        <Route
          path="/admin-panel"
          element={
            <DemoAdminLayout>
              <Admin />
            </DemoAdminLayout>
          }
        />

        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/story" element={<PublicLayout><Story /></PublicLayout>} />
        <Route path="/menu" element={<PublicLayout><MenuPage /></PublicLayout>} />
        <Route path="/experience" element={<PublicLayout><Experience /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}