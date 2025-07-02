import React from "react";

const Header = ({ title, subtitle, children }) => (
  <header className="mb-8 sticky top-0 bg-gray-50 z-20 py-4">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
          <span role="img" aria-label="warehouse">🏭</span> {title}
        </h1>
        {subtitle && (
          <p className="text-base text-green-800 mt-1">{subtitle}</p>
        )}
      </div>
      {children && <div>{children}</div>}
    </div>
  </header>
);

export default Header;