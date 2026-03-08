import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "./components/Shared";
import { Navbar } from "./components/Shared";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import AppPage from "./pages/AppPage";
import "./styles/global.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout({ children, showNav = true }) {
  return (
    <div className="noise">
      {showNav && <Navbar />}
      {children}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/app" element={<Layout showNav={false}><AppPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
