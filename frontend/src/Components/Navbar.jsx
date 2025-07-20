import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "About", to: "/about" },
  { name: "How It Works", to: "/how-it-works" },
  { name: "FAQ", to: "/faq" },
  
];

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="w-full flex items-center justify-between py-6 px-4 bg-white/90 shadow-sm backdrop-blur z-20">
      <div className="text-2xl font-extrabold text-green-700 tracking-tight">
        <Link to="/">farmio.</Link>
      </div>
      <div className="flex items-center space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`hover:underline transition text-base ${
              location.pathname === link.to
                ? "font-semibold text-green-600"
                : "text-gray-700"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/login" className="hover:underline text-base">
          Log in
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-500 transition"
        >
          Get started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;