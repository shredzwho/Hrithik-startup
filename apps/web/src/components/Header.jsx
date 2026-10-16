import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, MessageCircle, ChevronRight, Zap } from 'lucide-react';
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
    { path: '/shop', label: 'All Gear' },
    { path: '/shop?q=belt', label: 'Lever Belts', hot: true },
    { path: '/shop?q=wrap', label: 'Wrist Wraps' },
    { path: '/shop?q=bundle', label: 'Bundles & Kits' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Platform Journal' },
  ];
  
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname + location.search === path || (path === '/shop' && location.pathname === '/shop' && !location.search);
  };
  
  return (
    <>
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'glass-header shadow-2xl' : 'bg-black/90 backdrop-blur-md'}`}>
        
        {/* Top Urgency Flash Bar */}
        <div className="bg-gradient-to-r from-[#FF1E27] via-[#D60010] to-[#1D70F7] text-white py-1 px-4 text-center font-steelfish tracking-widest uppercase text-xs md:text-sm flex items-center justify-center gap-2 overflow-hidden shadow-sm">
          <Zap className="h-3.5 w-3.5 fill-white animate-pulse" />
          <span>OFFICIAL META SPECIAL: USE CODE <strong className="bg-black/30 px-1.5 py-0.5 rounded text-white font-mono">STRONG10</strong> FOR 10% OFF | FREE SAME-DAY DISPATCH OVER ₹1,499</span>
          <Zap className="h-3.5 w-3.5 fill-white animate-pulse hidden sm:inline" />
        </div>

        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? 'py-2 sm:py-2.5' : 'py-3 sm:py-3.5'}`}>
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo + Steelfish Monogram */}
            <Link to="/" className="flex items-center gap-3 group z-50 shrink-0">
              <div className="relative">
                <motion.img
                  src="https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/64d2f3751498e17703be6c6d3a5616d6.png"
                  alt="STRONGBUILD Official Logo"
                  className="h-[38px] sm:h-[46px] md:h-[50px] w-auto drop-shadow-[0_2px_12px_rgba(255,30,39,0.35)]"
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-steelfish text-2xl sm:text-3xl md:text-4xl tracking-wider text-white uppercase leading-none font-bold flex items-center gap-1">
                  STRONGBUILD<span className="text-accent text-3xl leading-none">.</span>
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-white/50 font-bold -mt-0.5">
                  Powerlifting Division
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation with Steelfish */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-steelfish text-lg tracking-wider uppercase transition-colors duration-200 relative py-1 ${
                    isActive(link.path)
                      ? 'text-accent font-bold'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.hot && (
                    <span className="ml-1.5 px-1 py-0.2 bg-accent text-[9px] font-sans font-black tracking-normal text-white rounded uppercase align-middle">
                      HOT
                    </span>
                  )}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    />
                  )}
                </Link>
              ))}
            </nav>
            
            {/* Action Bar */}
            <div className="flex items-center gap-1.5 sm:gap-3 z-50">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/account" className="font-steelfish text-base tracking-wider uppercase text-white/80 hover:text-white transition-colors">Account</Link>
                  <button onClick={logout} className="font-steelfish text-base tracking-wider uppercase text-white/40 hover:text-accent transition-colors">Logout</button>
                </div>
              ) : (
                <Link to="/login" className="hidden md:block font-steelfish text-base tracking-wider uppercase text-white/80 hover:text-accent transition-colors">
                  Login
                </Link>
              )}

              <Link to="/shop">
                <Button variant="ghost" size="icon" className="text-white hover:text-accent hover:bg-white/5 rounded-full h-9 w-9 sm:h-10 sm:w-10" aria-label="Search Gear">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>

              {/* Shopping Cart Trigger */}
              <Button
                onClick={() => setIsCartOpen(true)}
                variant="ghost"
                size="icon"
                className="relative text-white hover:text-accent hover:bg-white/5 rounded-full h-9 w-9 sm:h-10 sm:w-10"
                aria-label="View Shopping Cart"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-accent text-white font-mono text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-lg shadow-accent/40 translate-x-1 -translate-y-1">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              
              {/* Mobile Menu Toggle */}
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:text-accent hover:bg-white/5 rounded-full h-9 w-9 sm:h-10 sm:w-10"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Trust Bar below header */}
        <TrustBar />

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-0 w-full max-h-[85vh] overflow-y-auto bg-black/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
            >
              <div className="p-5 space-y-6">
                {/* Popular Gear Shortcuts */}
                <div>
                  <p className="font-steelfish text-sm tracking-widest uppercase text-accent mb-3 font-bold flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" /> High-Demand Categories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: '13mm Lever Belts', path: '/shop?q=13mm', badge: 'IPF Spec' },
                      { name: '10mm Lever Belts', path: '/shop?q=10mm', badge: 'Best Seller' },
                      { name: 'Stiff Wrist Wraps', path: '/shop?q=wrap', badge: 'Max Support' },
                      { name: 'Bundles & Kits', path: '/shop?q=kit', badge: 'Save 30%' },
                      { name: 'Liquid Chalk', path: '/shop?q=chalk', badge: 'Zero Mess' },
                      { name: 'Power Singlets', path: '/shop?q=singlet', badge: 'Competition' },
                    ].map((cat, i) => (
                      <Link
                        key={i}
                        to={cat.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 flex flex-col justify-between group active:scale-95 transition-transform"
                      >
                        <span className="font-steelfish text-base uppercase text-white tracking-wide group-hover:text-accent font-bold">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-brand-blue font-bold tracking-wider uppercase mt-1">
                          {cat.badge} →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Primary Nav Links */}
                <nav className="flex flex-col space-y-2 pt-2 border-t border-white/10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`font-steelfish text-2xl tracking-wider uppercase py-1.5 flex items-center justify-between transition-colors ${
                        isActive(link.path) ? 'text-accent font-bold' : 'text-white/90 hover:text-accent'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="h-4 w-4 text-white/30" />
                    </Link>
                  ))}
                </nav>

                {/* Quick Utilities */}
                <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                  <Link
                    to="/track-order"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-steelfish text-base uppercase tracking-wider text-white/70 hover:text-white flex items-center gap-2"
                  >
                    📦 Track Your Shipment
                  </Link>
                  <a
                    href="https://wa.me/918317339439"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-steelfish text-base uppercase tracking-wider text-[#25D366] flex items-center gap-2"
                  >
                    💬 WhatsApp Athlete Support (+91 83173 39439)
                  </a>
                  {isAuthenticated ? (
                    <div className="pt-2 flex items-center justify-between border-t border-white/10">
                      <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="font-steelfish text-lg uppercase text-white">My Account</Link>
                      <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="font-steelfish text-base uppercase text-accent">Logout</button>
                    </div>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="font-steelfish text-xl uppercase text-white hover:text-accent pt-1">
                      Login / Register Account →
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Floating WhatsApp Assistance Button */}
      <a 
        href="https://wa.me/918317339439?text=Hi%20STRONGBUILD%2C%20I%20need%20help%20with%20sizing%20and%20choosing%20my%20gear" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform z-40 border-2 border-white/20"
        aria-label="Direct WhatsApp Athlete Consultation"
      >
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
      </a>
    </>
  );
};

export default Header;