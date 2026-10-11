import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import TrustBar from '@/components/TrustBar.jsx';

const Header = ({ setIsCartOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <>
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'glass-header shadow-2xl' : 'bg-transparent'}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}>
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group z-50">
              <motion.img
                src="https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/64d2f3751498e17703be6c6d3a5616d6.png"
                alt="StrongBuild logo"
                className="h-[40px] md:h-[50px] w-auto drop-shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              />
              <span className="text-xl md:text-2xl font-black tracking-tight text-white hidden sm:block">
                STRONGBUILD
              </span>
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold tracking-widest uppercase transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-accent'
                      : 'text-primary hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-5 z-50">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-4">
                  <Link to="/account" className="text-sm font-semibold text-primary hover:text-white transition-colors">Account</Link>
                  <button onClick={logout} className="text-sm font-semibold text-muted-foreground hover:text-white transition-colors">Logout</button>
                </div>
              ) : (
                <Link to="/login" className="hidden md:block text-sm font-semibold text-primary hover:text-white transition-colors">Login</Link>
              )}

              <Button variant="ghost" size="icon" className="text-primary hover:text-white hover:bg-white/5 rounded-full">
                <Search className="h-5 w-5" />
              </Button>

              <Button
                onClick={() => setIsCartOpen(true)}
                variant="ghost"
                size="icon"
                className="relative text-primary hover:text-white hover:bg-white/5 rounded-full"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute 0 top-0 right-0 bg-accent text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm translate-x-1 -translate-y-1">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="icon"
                className="lg:hidden text-primary hover:text-white hover:bg-white/5 rounded-full"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        <TrustBar />

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            >
              <nav className="flex flex-col p-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-bold tracking-widest uppercase transition-colors duration-200 ${
                      isActive(link.path) ? 'text-accent' : 'text-white hover:text-accent'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-6 mt-2 border-t border-white/10 flex flex-col gap-4">
                  {isAuthenticated ? (
                    <>
                      <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-white">My Account</Link>
                      <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-lg font-bold text-muted-foreground text-left">Logout</button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-white">Login / Register</Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/918317339439" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 h-14 w-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </>
  );
};

export default Header;