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
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? 'py-2.5 sm:py-3' : 'py-3 sm:py-4'}`}>
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group z-50">
              <motion.img
                src="https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/64d2f3751498e17703be6c6d3a5616d6.png"
                alt="StrongBuild logo"
                className="h-[36px] sm:h-[44px] md:h-[50px] w-auto drop-shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              />
              <span className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-white block">
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
            <div className="flex items-center gap-2 sm:gap-4 md:gap-5 z-50">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-4">
                  <Link to="/account" className="text-sm font-semibold text-primary hover:text-white transition-colors">Account</Link>
                  <button onClick={logout} className="text-sm font-semibold text-muted-foreground hover:text-white transition-colors">Logout</button>
                </div>
              ) : (
                <Link to="/login" className="hidden md:block text-sm font-semibold text-primary hover:text-white transition-colors">Login</Link>
              )}

              <Link to="/shop">
                <Button variant="ghost" size="icon" className="text-primary hover:text-white hover:bg-white/5 rounded-full h-9 w-9 sm:h-10 sm:w-10">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>

              <Button
                onClick={() => setIsCartOpen(true)}
                variant="ghost"
                size="icon"
                className="relative text-primary hover:text-white hover:bg-white/5 rounded-full h-9 w-9 sm:h-10 sm:w-10"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute 0 top-0 right-0 bg-accent text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-sm translate-x-1 -translate-y-1">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="icon"
                className="lg:hidden text-primary hover:text-white hover:bg-white/5 rounded-full h-9 w-9 sm:h-10 sm:w-10"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              className="lg:hidden absolute top-full left-0 w-full max-h-[80vh] overflow-y-auto bg-black/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
            >
              <div className="p-5 space-y-6">
                {/* Popular Categories Shortcut */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-accent mb-3">Popular Gear</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Lever Belts', path: '/shop' },
                      { name: 'Wrist Wraps', path: '/shop' },
                      { name: 'Liquid Chalk', path: '/shop' },
                      { name: 'Bundles & Kits', path: '/shop' },
                    ].map((cat, i) => (
                      <Link
                        key={i}
                        to={cat.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-2.5 text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <span className="text-accent text-[10px]">→</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Primary Nav Links */}
                <nav className="flex flex-col space-y-3 pt-2 border-t border-white/10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-base font-bold tracking-wider uppercase transition-colors duration-200 py-1 ${
                        isActive(link.path) ? 'text-accent' : 'text-white hover:text-accent'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Quick Utilities */}
                <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                  <Link
                    to="/track-order"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs font-semibold text-white/70 hover:text-white uppercase tracking-wider"
                  >
                    📦 Track Your Order
                  </Link>
                  <a
                    href="https://wa.me/918317339439"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#25D366] flex items-center gap-1.5 uppercase tracking-wider"
                  >
                    💬 WhatsApp Support (+91 83173 39439)
                  </a>
                  {isAuthenticated ? (
                    <div className="pt-2 flex items-center justify-between">
                      <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-white">My Account</Link>
                      <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-xs font-bold text-muted-foreground hover:text-white">Logout</button>
                    </div>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-white pt-1">
                      Login / Create Account →
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Floating WhatsApp Button - Offset for mobile bottom nav */}
      <a 
        href="https://wa.me/918317339439" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform z-40"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
      </a>
    </>
  );
};

export default Header;