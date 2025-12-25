import { Link, useLocation } from 'react-router-dom';
import { FileText, Sparkles, MessageSquare, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/templates', label: 'Templates', icon: FileText },
    { href: '/builder', label: 'CV Builder', icon: Sparkles },
    { href: '/interview', label: 'Mock Interview', icon: MessageSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow duration-300">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">
              CV<span className="gradient-text">Craft</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button
                  variant={isActive(link.href) ? 'secondary' : 'ghost'}
                  className={cn(
                    'gap-2',
                    isActive(link.href) && 'bg-primary/10 text-primary'
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/builder">
              <Button variant="gradient" size="lg">
                Create CV Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive(link.href) ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-2',
                      isActive(link.href) && 'bg-primary/10 text-primary'
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
              <Link to="/builder" onClick={() => setIsOpen(false)}>
                <Button variant="gradient" className="w-full mt-2">
                  Create CV Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
