import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User, HelpCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

const MobileBottomNav = ({ setIsCartOpen }) => {
  const location = useLocation();
  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Shop', path: '/shop', icon: ShoppingBag },
    {
      label: 'Cart',
      onClick: () => setIsCartOpen(true),
      icon: ShoppingCart,
      badge: cartItemCount,
    },
    {
      label: isAuthenticated ? 'Account' : 'Login',
      path: isAuthenticated ? '/account' : '/login',
      icon: User,
    },
  ];

  const isActive = (path) => path && location.pathname === path;

  // Don't show in admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 px-2 py-1 shadow-2xl safe-area-pb">
      <nav className="flex items-center justify-around h-14 max-w-md mx-auto">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          if (item.onClick) {
            return (
              <button
                key={idx}
                type="button"
                onClick={item.onClick}
                className="relative flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors text-white/60 hover:text-white"
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon className="h-5 w-5 mb-0.5" />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-md animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="font-steelfish text-xs uppercase tracking-wider">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              to={item.path}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors ${
                active ? 'text-accent' : 'text-white/60 hover:text-white'
              }`}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span
                className={`font-steelfish text-xs uppercase tracking-wider ${
                  active ? 'font-bold text-accent' : 'text-white/70'
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileBottomNav;
