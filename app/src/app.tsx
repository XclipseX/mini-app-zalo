import React from "react";
import { App, ZMPRouter, AnimationRoutes, Route, SnackbarProvider } from "zmp-ui";
import { CartProvider } from "./state/cart";
import { MemberProvider } from "./state/member";
import BottomNav from "./components/bottom-nav";
import HomePage from "./pages/home";
import MenuPage from "./pages/menu";
import ProductPage from "./pages/product";
import CartPage from "./pages/cart";
import RewardsPage from "./pages/rewards";
import PrivacyPage from "./pages/privacy";
import StaffPage from "./pages/staff";

export default function MyApp() {
  return (
    <App>
      <SnackbarProvider>
        <MemberProvider>
          <CartProvider>
            <ZMPRouter memoryRouter={import.meta.env.VITE_WEB_DEMO === "true"}>
              <AnimationRoutes>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/rewards" element={<RewardsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/staff" element={<StaffPage />} />
              </AnimationRoutes>
              <BottomNav />
            </ZMPRouter>
          </CartProvider>
        </MemberProvider>
      </SnackbarProvider>
    </App>
  );
}
