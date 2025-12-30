import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, FileText, Loader2, Sparkles, Zap, Target, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type AuthView = 'login' | 'signup' | 'verify-otp';

// Floating particles component
const FloatingElements = () => (
  <>
    {/* Animated circles */}
    <motion.div
      className="absolute top-20 right-20 w-32 h-32 border border-white/20 rounded-full"
      animate={{ rotate: 360, scale: [1, 1.1, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute bottom-40 left-10 w-24 h-24 border border-white/10 rounded-full"
      animate={{ rotate: -360 }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute top-1/3 right-10 w-16 h-16 bg-white/5 rounded-full backdrop-blur-sm"
      animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
      transition={{ duration: 5, repeat: Infinity }}
    />
    
    {/* Floating dots */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-white/30 rounded-full"
        style={{
          top: `${20 + Math.random() * 60}%`,
          left: `${10 + Math.random() * 80}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: i * 0.3,
        }}
      />
    ))}

    {/* Geometric shapes */}
    <motion.div
      className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-white/20 rotate-45"
      animate={{ rotate: [45, 135, 45] }}
      transition={{ duration: 8, repeat: Infinity }}
    />
    <motion.div
      className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-white/10 rounded-sm rotate-12"
      animate={{ rotate: [12, -12, 12], scale: [1, 1.2, 1] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
  </>
);

const Auth = () => {
  const navigate = useNavigate();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  // Cooldown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = { email: '', password: '', fullName: '' };
    let isValid = true;

    try {
      emailSchema.parse(formData.email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
        isValid = false;
      }
    }

    try {
      passwordSchema.parse(formData.password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
        isValid = false;
      }
    }

    if (authView === 'signup' && !formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your name';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otpValue,
        type: 'signup',
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Email verified successfully! Welcome to CVCraft.');
      navigate('/');
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('A new verification code has been sent to your email.');
      setResendCooldown(60);
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      // Mock admin account bypass
      if (authView === 'login' && formData.email === 'admin@gmail.com' && formData.password === 'admin123') {
        toast.success('Welcome back, Admin!');
        // Store mock session in localStorage
        localStorage.setItem('mockUser', JSON.stringify({
          id: 'mock-admin-id',
          email: 'admin@gmail.com',
          full_name: 'Admin User',
        }));
        navigate('/');
        return;
      }

      if (authView === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please try again.');
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success('Welcome back!');
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            toast.error('An account with this email already exists. Please sign in instead.');
            setAuthView('login');
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success('Verification code sent to your email!');
        setAuthView('verify-otp');
        setResendCooldown(60);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const features = [
    { icon: FileText, text: '10+ Professional Templates', delay: 0 },
    { icon: Sparkles, text: 'AI-Powered CV Writing', delay: 0.1 },
    { icon: Target, text: 'Mock Interview Practice', delay: 0.2 },
    { icon: Zap, text: 'ATS-Friendly Formats', delay: 0.3 },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        
        {/* Animated mesh gradient overlay */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
          animate={{
            background: [
              'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        {/* Floating elements */}
        <FloatingElements />
        
        {/* Glowing orbs */}
        <motion.div 
          className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.1, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 lg:p-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-3 mb-16">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <FileText className="w-6 h-6 text-white" />
              </motion.div>
              <span className="font-display font-bold text-2xl">CVCraft</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Build Your Dream
              <br />
              <motion.span 
                className="text-white/90"
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Career with AI
              </motion.span>
            </h1>
            <p className="text-lg text-white/70 mb-12 max-w-md leading-relaxed">
              Create stunning, ATS-friendly resumes in minutes. Practice interviews with AI and land your dream job.
            </p>
          </motion.div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.text}
                className="flex items-center gap-4 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + feature.delay }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-white/90 font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div 
            className="mt-16 pt-8 border-t border-white/10 flex gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[
              { value: '50K+', label: 'Users' },
              { value: '95%', label: 'Success' },
              { value: '10+', label: 'Templates' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
              >
                <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">
              CV<span className="gradient-text">Craft</span>
            </span>
          </Link>

          {authView === 'verify-otp' ? (
            /* OTP Verification View */
            <>
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-display text-3xl font-bold mb-2">
                  Verify Your Email
                </h2>
                <p className="text-muted-foreground">
                  We've sent a 6-digit verification code to
                </p>
                <p className="text-foreground font-medium mt-1">
                  {formData.email}
                </p>
              </motion.div>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpValue}
                    onChange={(value) => setOtpValue(value)}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    size="lg"
                    className="w-full rounded-full"
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otpValue.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Email
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading || resendCooldown > 0}
                      className="text-primary font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                    </button>
                  </p>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setAuthView('signup');
                      setOtpValue('');
                    }}
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to signup
                  </Button>
                </div>
              </motion.div>
            </>
          ) : (
            /* Login/Signup View */
            <>
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-3xl font-bold mb-2">
                  {authView === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-muted-foreground">
                  {authView === 'login'
                    ? 'Sign in to continue building your career'
                    : 'Get started with your free account'}
                </p>
              </motion.div>

              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {authView === 'signup' && (
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Anderson"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName}</p>
                    )}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {authView === 'login' ? 'Signing in...' : 'Creating account...'}
                      </>
                    ) : (
                      <>
                        {authView === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full rounded-full"
                    onClick={async () => {
                      const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                          redirectTo: `${window.location.origin}/`,
                        },
                      });
                      if (error) {
                        toast.error(error.message);
                      }
                    }}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full rounded-full opacity-50 cursor-not-allowed"
                    disabled={true}
                    title="GitHub login coming soon"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                    <span className="ml-2 text-xs">(Coming Soon)</span>
                  </Button>
                </motion.div>
              </div>

              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-muted-foreground">
                  {authView === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthView(authView === 'login' ? 'signup' : 'login');
                      setErrors({ email: '', password: '', fullName: '' });
                    }}
                    className="text-primary font-medium hover:underline"
                  >
                    {authView === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </motion.div>

              <motion.p 
                className="text-xs text-muted-foreground text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                By continuing, you agree to our{' '}
                <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
              </motion.p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;