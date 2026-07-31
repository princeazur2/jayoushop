import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Catalogue from "@/pages/Catalogue";
import ProductDetail from "@/pages/ProductDetail";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import NotFound from "@/pages/NotFound";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminRoute from "@/components/AdminRoute";
import ToastContainer from "@/components/ui/toast-container";
import ScrollToTop from "@/components/ScrollToTop";
import IntroSplash from "@/components/IntroSplash";
import InstallPWAPrompt from "@/components/InstallPWAPrompt";
import { useSiteSettings } from "@/hooks/useSupabase";

export default function App() {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("jayou-intro-seen");
    if (!alreadySeen && !location.pathname.startsWith("/admin")) {
      setShowIntro(true);
      sessionStorage.setItem("jayou-intro-seen", "1");
    }
    // Ne s'execute qu'une seule fois au premier montage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = settings?.site_name?.trim() || "JA ✨ Jí Yoū";
  }, [settings]);

  return (
    <>
      {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}
      <ScrollToTop />
      <InstallPWAPrompt />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/catalogue"
          element={
            <Layout>
              <Catalogue />
            </Layout>
          }
        />
        <Route
          path="/produit/:id"
          element={
            <Layout>
              <ProductDetail />
            </Layout>
          }
        />
        <Route
          path="/blog"
          element={
            <Layout>
              <Blog />
            </Layout>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <Layout>
              <BlogDetail />
            </Layout>
          }
        />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
}