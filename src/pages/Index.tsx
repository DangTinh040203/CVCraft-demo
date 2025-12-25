import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, FileText, Sparkles, MessageSquare, CheckCircle2,
  Upload, Wand2, Download, Star, ChevronRight, Zap, Shield, Clock,
  Target, Award, TrendingUp, Play, MousePointer2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from '@/components/Navbar';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

// Animated counter component
const AnimatedCounter = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseInt(value.replace(/\D/g, ''));

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, numericValue]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

// Floating particles component
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-primary/20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Typing animation component
const TypeWriter = ({ text, className }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle"
      />
    </span>
  );
};

const Index = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    {
      icon: FileText,
      title: '10 Professional Templates',
      description: 'Choose from beautifully designed templates that catch recruiters\' attention.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Writing',
      description: 'Generate and refine your CV content with AI. Just paste a job description.',
    },
    {
      icon: MessageSquare,
      title: 'Mock Interviews',
      description: 'Practice with AI interviews tailored to your target role and industry.',
    },
  ];

  const stats = [
    { value: '50', suffix: 'K+', label: 'CVs Created' },
    { value: '10', suffix: 'K+', label: 'Users Hired' },
    { value: '95', suffix: '%', label: 'Success Rate' },
  ];

  const benefits = [
    'ATS-optimized formatting',
    'Real-time preview',
    'Export to PDF & Word',
    'Job-specific tailoring',
    'Grammar & spelling check',
    'Unlimited revisions',
  ];

  const howItWorks = [
    {
      step: '01',
      icon: Upload,
      title: 'Upload Your Info',
      description: 'Start fresh or import your existing CV. Add your experience, education, and skills.',
    },
    {
      step: '02',
      icon: Wand2,
      title: 'AI Enhancement',
      description: 'Let AI optimize your content for the job you want. Paste a job description for tailored suggestions.',
    },
    {
      step: '03',
      icon: Download,
      title: 'Download & Apply',
      description: 'Export your polished CV in PDF or Word format. Ready to land your dream job!',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      image: 'SC',
      content: 'CVCraft helped me land my dream job at Google. The AI suggestions made my resume stand out from hundreds of applicants.',
      rating: 5,
    },
    {
      name: 'Michael Roberts',
      role: 'Product Manager at Meta',
      image: 'MR',
      content: 'The mock interview feature was a game-changer. I felt so prepared walking into my final round interviews.',
      rating: 5,
    },
    {
      name: 'Emily Watson',
      role: 'Marketing Director',
      image: 'EW',
      content: 'I tried many CV builders, but CVCraft\'s templates and AI writing are simply the best. Highly recommend!',
      rating: 5,
    },
  ];

  const whyChooseUs = [
    { icon: Zap, title: 'Lightning Fast', description: 'Create a professional CV in under 10 minutes with our intuitive builder.' },
    { icon: Shield, title: 'ATS-Friendly', description: 'All templates are optimized to pass Applicant Tracking Systems.' },
    { icon: Clock, title: 'Save Time', description: 'AI writes compelling content so you can focus on what matters.' },
    { icon: Target, title: 'Job-Targeted', description: 'Tailor your CV to specific job descriptions for higher success rates.' },
    { icon: Award, title: 'Expert Approved', description: 'Templates designed by hiring managers and career coaches.' },
    { icon: TrendingUp, title: 'Proven Results', description: '95% of users report getting more interview callbacks.' },
  ];

  const faqs = [
    { question: 'Is CVCraft really free to use?', answer: 'Yes! You can create and download your CV for free. We offer premium templates and advanced AI features for users who want extra polish.' },
    { question: 'How does the AI CV writing work?', answer: 'Our AI analyzes your experience and the job description you\'re targeting. It then suggests impactful bullet points, optimizes keywords, and ensures your CV is tailored for the role.' },
    { question: 'Are the templates ATS-friendly?', answer: 'Absolutely. All our templates are designed to pass Applicant Tracking Systems while still looking professional and modern.' },
    { question: 'Can I edit my CV after downloading?', answer: 'Yes! Your CVs are saved to your account. You can come back anytime to make edits and download updated versions.' },
    { question: 'How does the mock interview feature work?', answer: 'Our AI interviewer asks you common questions for your target role. You can practice answering verbally, and the AI provides feedback on your responses.' },
  ];

  const templateCategories = [
    { name: 'Professional', count: 4, color: 'bg-primary/10 text-primary' },
    { name: 'Modern', count: 2, color: 'bg-accent/10 text-accent' },
    { name: 'Creative', count: 2, color: 'bg-destructive/10 text-destructive' },
    { name: 'Minimal', count: 2, color: 'bg-muted text-muted-foreground' },
  ];

  const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix'];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-24 px-4 overflow-hidden relative min-h-[90vh] flex items-center bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <FloatingParticles />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 right-[10%] w-96 h-96 bg-primary/15 rounded-full blur-[120px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-20 left-[5%] w-80 h-80 bg-accent/15 rounded-full blur-[100px]"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 20, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/3 left-[15%] w-64 h-64 bg-primary/10 rounded-full blur-[80px]"
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-[15%] w-48 h-48 bg-accent/10 rounded-full blur-[60px]"
            animate={{ y: [0, 30, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Geometric shapes */}
          <motion.div
            className="absolute top-40 left-[20%] w-4 h-4 border-2 border-primary/30 rotate-45"
            animate={{ rotate: [45, 135, 45], scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-40 right-[25%] w-6 h-6 border-2 border-accent/30 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 right-[10%] w-3 h-3 bg-primary/30 rounded-full"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
        
        <motion.div 
          className="container mx-auto relative z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-primary">AI-Powered CV Builder</span>
              <motion.span 
                className="px-2 py-0.5 bg-primary/20 rounded-full text-xs font-bold text-primary"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                NEW
              </motion.span>
            </motion.div>
            
            {/* Main headline */}
            <motion.h1 
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover, connect,
              <br />
              <motion.span 
                className="gradient-text inline-block"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              >
                grow.
              </motion.span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Welcome to CVCraft, the largest professional CV building platform. Create stunning resumes in minutes.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link to="/builder">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="w-full sm:w-auto group rounded-full px-6 relative overflow-hidden">
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <span className="relative flex items-center gap-2">
                      Build your profile
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/templates">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-6">
                    Templates
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                { icon: '👤', label: 'Professionals', color: 'bg-green-500' },
                { icon: '🔗', label: 'Connections', color: 'bg-yellow-500' },
                { icon: '📋', label: 'Job listings', color: 'bg-blue-500' },
                { icon: '📄', label: 'Applications', color: 'bg-purple-500' },
              ].map((item, index) => (
                <motion.div 
                  key={item.label} 
                  className="bg-card rounded-xl p-4 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div 
                      className={`w-2 h-2 rounded-full ${item.color}`}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div 
              className="mt-16 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span className="text-xs text-muted-foreground">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <MousePointer2 className="w-5 h-5 text-primary" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Trusted By Section - Marquee */}
      <section className="py-12 px-4 border-b border-border bg-muted/30 overflow-hidden">
        <div className="container mx-auto">
          <motion.p 
            className="text-center text-muted-foreground text-sm mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Trusted by professionals from leading companies
          </motion.p>
          <div className="relative">
            <motion.div 
              className="flex gap-16 items-center"
              animate={{ x: [0, -500] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[...companies, ...companies].map((company, i) => (
                <span key={i} className="font-display font-bold text-xl text-muted-foreground whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity">
                  {company}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Land Your Dream Job</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our comprehensive toolkit helps you create professional CVs, tailor them to job descriptions, and practice interviews.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group p-8 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-xl transition-all duration-500"
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div 
                  className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </motion.div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create your perfect CV in just 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <motion.div 
              className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-20"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            {howItWorks.map((item, index) => (
              <motion.div 
                key={item.step} 
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-bg mb-6 shadow-lg relative z-10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                >
                  <item.icon className="w-10 h-10 text-primary-foreground" />
                </motion.div>
                <motion.span 
                  className="absolute -top-2 -right-2 md:right-1/4 text-6xl font-display font-bold text-muted/50"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                >
                  {item.step}
                </motion.span>
                <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Preview Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Choose from <span className="gradient-text">10+ Professional Templates</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Our templates are designed by hiring managers and career coaches to help you make the best first impression.
              </p>
              
              <motion.div 
                className="flex flex-wrap gap-3 mb-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {templateCategories.map((cat) => (
                  <motion.span 
                    key={cat.name} 
                    className={`px-4 py-2 rounded-full text-sm font-medium ${cat.color} cursor-pointer`}
                    variants={scaleIn}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cat.name} ({cat.count})
                  </motion.span>
                ))}
              </motion.div>

              <Link to="/templates">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="group">
                    Browse All Templates
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i}
                    className={`bg-card rounded-xl shadow-lg border border-border/50 p-4 ${i === 1 ? 'col-span-2' : ''}`}
                    variants={fadeInUp}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <motion.div 
                          className="w-8 h-8 rounded-full bg-primary/20"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        />
                        <div className="flex-1">
                          <div className="h-2 bg-foreground/20 rounded w-3/4" />
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-1/2 mt-1" />
                        </div>
                      </div>
                      <div className="space-y-1 pt-2 border-t border-border/50">
                        <motion.div 
                          className="h-1.5 bg-muted rounded w-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                        <motion.div 
                          className="h-1.5 bg-muted rounded"
                          initial={{ width: 0 }}
                          whileInView={{ width: '83%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 + 0.1 }}
                        />
                        <motion.div 
                          className="h-1.5 bg-muted rounded"
                          initial={{ width: 0 }}
                          whileInView={{ width: '66%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div 
                className="absolute -bottom-4 -right-4 w-32 h-32 gradient-bg rounded-2xl -z-10 opacity-20 blur-xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">CVCraft</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're not just another CV builder. Here's what makes us different.
            </p>
          </motion.div>

          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {whyChooseUs.map((item, index) => (
              <motion.div key={item.title} variants={fadeInUp}>
                <Card className="border-border/50 hover:shadow-xl transition-all duration-500 overflow-hidden group">
                  <CardContent className="pt-6 relative">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <motion.div 
                      className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 relative z-10"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    <h3 className="font-display font-semibold text-lg mb-2 relative z-10">{item.title}</h3>
                    <p className="text-muted-foreground text-sm relative z-10">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section with animated stats */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Stand Out from the <span className="gradient-text">Competition</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Our CV builder is designed by hiring managers and career coaches to give you the best chance of getting noticed.
              </p>
              
              <motion.div 
                className="grid sm:grid-cols-2 gap-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={benefit} 
                    className="flex items-center gap-3"
                    variants={fadeInLeft}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    </motion.div>
                    <span className="text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>

              <Link to="/builder" className="inline-block mt-8">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg">
                    Get Started Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="bg-card rounded-2xl shadow-xl p-8 border border-border/50"
                whileHover={{ y: -5 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      JA
                    </motion.div>
                    <div>
                      <div className="font-display font-semibold text-lg">John Anderson</div>
                      <div className="text-muted-foreground">Senior Software Engineer</div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-border">
                    {[100, 80, 90, 70].map((width, i) => (
                      <motion.div 
                        key={i}
                        className="h-3 bg-muted rounded-full overflow-hidden"
                      >
                        <motion.div
                          className="h-full bg-primary/30 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${width}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              <motion.div 
                className="absolute -bottom-4 -left-4 w-40 h-40 gradient-bg rounded-2xl -z-10 opacity-20 blur-xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto">
          <motion.div 
            className="flex flex-wrap justify-center gap-12 md:gap-24"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center"
                variants={scaleIn}
              >
                <motion.div 
                  className="font-display text-5xl md:text-6xl font-bold gradient-text"
                  whileHover={{ scale: 1.1 }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </motion.div>
                <div className="text-muted-foreground mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See what our users have to say about their experience.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.name}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full border-border/50 hover:shadow-xl transition-all duration-500">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-semibold"
                        whileHover={{ scale: 1.1 }}
                      >
                        {testimonial.image}
                      </motion.div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about CVCraft.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem value={`item-${index}`} className="bg-card rounded-lg border border-border/50 px-6">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="relative overflow-hidden rounded-3xl gradient-bg p-12 md:p-16 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Animated background elements */}
            <motion.div 
              className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
              animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <motion.h2 
                className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Ready to Land Your Dream Job?
              </motion.h2>
              <motion.p 
                className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Join thousands of professionals who have already transformed their careers with CVCraft.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link to="/builder">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="secondary" className="rounded-full px-8 text-lg">
                      Start Building for Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto">
          <motion.div 
            className="grid md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-4">
                <motion.div 
                  className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </motion.div>
                <span className="font-display font-bold text-xl">CVCraft</span>
              </div>
              <p className="text-muted-foreground text-sm">
                The AI-powered CV builder that helps you land your dream job.
              </p>
            </motion.div>
            
            {[
              { title: 'Product', links: ['Templates', 'CV Builder', 'Mock Interviews', 'Pricing'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
            ].map((section) => (
              <motion.div key={section.title} variants={fadeInUp}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <motion.a 
                        href="#" 
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="border-t border-border mt-12 pt-8 text-center text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © 2024 CVCraft. All rights reserved.
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Index;