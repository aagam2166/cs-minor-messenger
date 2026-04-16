import React from "react";
import Header from "./Header";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer (optional, later) */}
    </div>
  );
}

export default MainLayout;
