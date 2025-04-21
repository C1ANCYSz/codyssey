import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect / تأثير التمرير
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`z-50 w-full bg-slate-900/95 transition-all duration-300 ${
        scrolled
          ? "shadow-primary-600/25 fixed top-0 right-0 left-0 z-50 shadow-lg backdrop-blur-md"
          : "sticky top-0"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-2 transition-transform hover:scale-105"
            onClick={() => setIsOpen(false)}
          >
            <img
              src="/src/assets/logo.png"
              alt="Codyssey Logo"
              className="h-8 w-8 transition-all duration-300 group-hover:brightness-110 md:h-10 md:w-10"
            />
            <h1 className="font-logo group-hover:text-primary-300 text-2xl font-bold tracking-wider text-white transition-colors md:text-3xl">
              Codyssey
            </h1>
          </Link>

          {/* Mobile Menu Button / زر القائمة للموبايل */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <FiX className="text-2xl text-white" />
            ) : (
              <FiMenu className="text-2xl text-white" />
            )}
          </button>

          {/* Mobile Menu / القائمة للموبايل */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full right-0 left-0 border-t border-white/10 bg-slate-900/95 shadow-xl backdrop-blur-md md:hidden"
              >
                <nav className="container mx-auto px-4 py-4">
                  <ul className="flex flex-col gap-4">
                    <li>
                      <Link
                        to="/login"
                        className="block w-full rounded-lg px-4 py-2 text-white transition-colors hover:bg-white/10"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/signup"
                        className="bg-primary-600 hover:bg-primary-700 block w-full rounded-lg px-4 py-2 text-center font-medium text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </li>
                  </ul>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Menu / القائمة للكمبيوتر */}
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/login">
              <button className="rounded-lg px-6 py-2 font-medium text-white transition-colors hover:bg-white/10">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-primary-600 hover:bg-primary-700 hover:shadow-primary-600/25 rounded-lg px-6 py-2 font-medium text-white shadow-lg transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
