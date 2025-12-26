import { Link, useLocation } from 'react-router-dom';
import { FileText, Sparkles, MessageSquare, Menu, X, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';

interface MockUser {
  id: string;
  email: string;
  full_name: string;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mockUser, setMockUser] = useState<MockUser | null>(null);
  const [profileData, setProfileData] = useState<{ avatar_url?: string; full_name?: string } | null>(null);
  const location = useLocation();
  const { user, signOut, isLoading } = useAuth();

  // Check for mock user in localStorage
  useEffect(() => {
    const storedMockUser = localStorage.getItem('mockUser');
    if (storedMockUser) {
      setMockUser(JSON.parse(storedMockUser));
    }
  }, []);

  // Fetch profile data for real users
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) setProfileData(data);
    };
    fetchProfile();
  }, [user]);

  const currentUser = user || mockUser;
  const displayName = profileData?.full_name || user?.user_metadata?.full_name || mockUser?.full_name || currentUser?.email?.split('@')[0] || 'User';
  const displayEmail = currentUser?.email || '';
  const avatarUrl = profileData?.avatar_url || '';

  const navLinks = [
    { href: '/templates', label: 'Templates', icon: FileText },
    { href: '/builder', label: 'CV Builder', icon: Sparkles },
    { href: '/interview', label: 'Mock Interview', icon: MessageSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    // Clear mock user if exists
    localStorage.removeItem('mockUser');
    setMockUser(null);
    await signOut();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isLoading ? (
              <div className="w-24 h-10 bg-muted animate-pulse rounded-lg" />
            ) : currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[120px] truncate hidden lg:block">
                      {displayName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/builder" className="cursor-pointer">
                      <Sparkles className="w-4 h-4 mr-2" />
                      My CVs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button variant="gradient">Get Started</Button>
                </Link>
              </>
            )}
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
              {currentUser ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 border-t border-border mt-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{displayEmail}</p>
                    </div>
                  </div>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      Profile Settings
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="gradient" className="w-full mt-2">
                    Sign In / Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
