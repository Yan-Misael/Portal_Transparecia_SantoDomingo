import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip Link para navegación por teclado (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-to-content">
        Saltar al contenido principal
      </a>

      <Header />

      <main
        id="main-content"
        role="main"
        className="flex-1"
        tabIndex={-1}
        aria-label="Contenido principal"
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
