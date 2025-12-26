import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Mic, MicOff, Play, Pause, SkipForward, MessageSquare, Clock, 
  CheckCircle2, Volume2, Sparkles, Brain, Target, Zap, 
  ArrowRight, RotateCcw, Trophy, Star, TrendingUp, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';

interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tips: string[];
}

const sampleQuestions: InterviewQuestion[] = [
  {
    id: '1',
    question: 'Tell me about yourself and your professional background.',
    category: 'Introduction',
    difficulty: 'easy',
    tips: ['Keep it under 2 minutes', 'Focus on relevant experience', 'End with why you\'re excited about this role'],
  },
  {
    id: '2',
    question: 'What is your greatest professional achievement?',
    category: 'Behavioral',
    difficulty: 'medium',
    tips: ['Use the STAR method', 'Include metrics if possible', 'Show impact on the organization'],
  },
  {
    id: '3',
    question: 'Describe a challenging situation at work and how you handled it.',
    category: 'Behavioral',
    difficulty: 'medium',
    tips: ['Be specific about the situation', 'Explain your thought process', 'Highlight the positive outcome'],
  },
  {
    id: '4',
    question: 'Where do you see yourself in 5 years?',
    category: 'Career Goals',
    difficulty: 'easy',
    tips: ['Show ambition but be realistic', 'Align with the company\'s growth', 'Demonstrate commitment'],
  },
  {
    id: '5',
    question: 'Why should we hire you over other candidates?',
    category: 'Self-Assessment',
    difficulty: 'hard',
    tips: ['Highlight unique skills', 'Reference the job requirements', 'Show enthusiasm for the role'],
  },
];

type InterviewState = 'setup' | 'in-progress' | 'feedback' | 'complete';

// Floating Particles Component
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-primary/20"
        initial={{
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
          y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
        }}
        animate={{
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
          y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
        }}
        transition={{
          duration: Math.random() * 20 + 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />
    ))}
  </div>
);

// Animated Background Shapes
const BackgroundShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-accent/20 to-primary/10 blur-3xl"
      animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.4, 0.3, 0.4],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/5 to-transparent blur-2xl"
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 180, 360],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

// Pulse Animation for Recording
const PulseRing = ({ isRecording }: { isRecording: boolean }) => (
  <AnimatePresence>
    {isRecording && (
      <>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-red-500"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2 + i * 0.5, opacity: 0 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}
      </>
    )}
  </AnimatePresence>
);

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const Interview = () => {
  const [state, setState] = useState<InterviewState>('setup');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const timerRef = useRef<NodeJS.Timeout>();

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / sampleQuestions.length) * 100;

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = () => {
    setState('in-progress');
    setCurrentQuestionIndex(0);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingTime(0);
    } else {
      setIsRecording(false);
      setIsPaused(false);
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: `Answer recorded for ${recordingTime} seconds`,
      }));
      setState('feedback');
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setRecordingTime(0);
      setState('in-progress');
    } else {
      setState('complete');
    }
  };

  const restartInterview = () => {
    setState('setup');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setRecordingTime(0);
    setIsRecording(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const features = [
    { icon: Brain, label: 'AI-Powered Analysis', desc: 'Get intelligent feedback' },
    { icon: Target, label: 'Industry Questions', desc: 'Real interview scenarios' },
    { icon: Zap, label: 'Instant Feedback', desc: 'Improve in real-time' },
  ];

  const stats = [
    { value: '10K+', label: 'Interviews Completed' },
    { value: '95%', label: 'Success Rate' },
    { value: '50+', label: 'Question Categories' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundShapes />
      <FloatingParticles />
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            {/* Setup Screen */}
            {state === 'setup' && (
              <motion.div
                key="setup"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                variants={staggerContainer}
                className="text-center"
              >
                {/* Hero Section */}
                <motion.div variants={fadeInUp} className="mb-12">
                  <motion.div 
                    className="relative w-24 h-24 mx-auto mb-8"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary rotate-6 blur-sm opacity-60" />
                    <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30">
                      <MessageSquare className="w-12 h-12 text-primary-foreground" />
                    </div>
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-8 h-8 text-accent" />
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    variants={fadeInUp}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">AI-Powered Interview Practice</span>
                  </motion.div>

                  <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Master Your Next
                    <br />
                    <span className="gradient-text animate-gradient-shift">Interview</span>
                  </h1>
                  
                  <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                    Practice with AI-powered mock interviews, receive instant feedback, 
                    and build confidence for your dream job opportunity.
                  </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div 
                  variants={staggerContainer}
                  className="grid md:grid-cols-3 gap-4 mb-12"
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.label}
                      variants={fadeInUp}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group"
                    >
                      <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="pt-6 pb-4 relative">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                            <feature.icon className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-semibold mb-1">{feature.label}</h3>
                          <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Interview Setup Card */}
                <motion.div variants={scaleIn}>
                  <Card className="max-w-lg mx-auto mb-8 border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Interview Session
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { label: 'Questions', value: sampleQuestions.length, icon: MessageSquare },
                        { label: 'Duration', value: '15-20 min', icon: Clock },
                        { label: 'Focus Areas', value: 'Behavioral & Technical', icon: Brain },
                      ].map((item, i) => (
                        <motion.div 
                          key={item.label}
                          className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-muted-foreground">{item.label}</span>
                          </div>
                          <span className="font-semibold">{item.value}</span>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* CTA Button */}
                <motion.div variants={fadeInUp}>
                  <Button 
                    variant="gradient" 
                    size="xl" 
                    onClick={startInterview}
                    className="group relative overflow-hidden shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Mic className="w-5 h-5" />
                      Start Interview
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </motion.div>

                {/* Stats */}
                <motion.div 
                  variants={staggerContainer}
                  className="flex justify-center gap-8 md:gap-16 mt-12 pt-8 border-t border-border/30"
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      variants={fadeInUp}
                      className="text-center"
                    >
                      <div className="font-display text-3xl font-bold gradient-text">{stat.value}</div>
                      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* In Progress */}
            {state === 'in-progress' && (
              <motion.div
                key="in-progress"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                variants={staggerContainer}
                className="space-y-6"
              >
                {/* Progress Header */}
                <motion.div variants={fadeInUp} className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Question</span>
                        <div className="font-display font-bold text-lg">
                          {currentQuestionIndex + 1} <span className="text-muted-foreground font-normal">/ {sampleQuestions.length}</span>
                        </div>
                      </div>
                    </div>
                    <motion.span 
                      className={cn(
                        'text-sm px-4 py-2 rounded-full font-medium capitalize border',
                        getDifficultyColor(currentQuestion.difficulty)
                      )}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {currentQuestion.difficulty}
                    </motion.span>
                  </div>
                  <div className="relative">
                    <Progress value={progress} className="h-3 bg-muted/50" />
                    <motion.div
                      className="absolute -top-1 h-5 w-5 rounded-full bg-primary shadow-lg shadow-primary/50 flex items-center justify-center"
                      style={{ left: `calc(${progress}% - 10px)` }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Question Card */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                    <CardContent className="pt-8 pb-8">
                      <motion.span 
                        className="inline-flex items-center gap-2 text-sm text-primary font-medium uppercase tracking-wide bg-primary/10 px-3 py-1 rounded-full"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Target className="w-4 h-4" />
                        {currentQuestion.category}
                      </motion.span>
                      
                      <motion.h2 
                        className="font-display text-2xl md:text-3xl font-bold mt-4 mb-8 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {currentQuestion.question}
                      </motion.h2>

                      {/* Tips */}
                      <motion.div 
                        className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-6 mb-8 border border-border/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Volume2 className="w-4 h-4 text-primary" />
                          </div>
                          Tips for a great answer
                        </h4>
                        <ul className="space-y-3">
                          {currentQuestion.tips.map((tip, i) => (
                            <motion.li 
                              key={i} 
                              className="text-sm text-muted-foreground flex items-start gap-3"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + i * 0.1 }}
                            >
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              {tip}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>

                      {/* Recording Controls */}
                      <div className="text-center">
                        <motion.div 
                          className="mb-6"
                          animate={isRecording ? { scale: [1, 1.02, 1] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <span className={cn(
                            "font-display text-6xl font-bold transition-colors",
                            isRecording ? "text-rose-500" : "text-foreground"
                          )}>
                            {formatTime(recordingTime)}
                          </span>
                        </motion.div>

                        <div className="relative inline-block">
                          <PulseRing isRecording={isRecording} />
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant={isRecording ? 'destructive' : 'gradient'}
                              size="xl"
                              onClick={toggleRecording}
                              className={cn(
                                "relative w-56 shadow-xl transition-all duration-300",
                                isRecording 
                                  ? "shadow-rose-500/30 hover:shadow-rose-500/50" 
                                  : "shadow-primary/30 hover:shadow-primary/50"
                              )}
                            >
                              {isRecording ? (
                                <>
                                  <MicOff className="w-5 h-5 mr-2" />
                                  Stop Recording
                                </>
                              ) : (
                                <>
                                  <Mic className="w-5 h-5 mr-2" />
                                  Start Recording
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </div>

                        <AnimatePresence>
                          {isRecording && (
                            <motion.p 
                              className="text-sm text-rose-400 mt-6 flex items-center justify-center gap-2"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                            >
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                              Recording in progress... Click stop when you're done.
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* Feedback Screen */}
            {state === 'feedback' && (
              <motion.div
                key="feedback"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                variants={staggerContainer}
                className="space-y-8"
              >
                <motion.div variants={fadeInUp} className="text-center mb-8">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/30"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="font-display text-3xl font-bold mb-2">Excellent Response!</h2>
                  <p className="text-muted-foreground">Here's your AI-powered feedback</p>
                </motion.div>

                <motion.div variants={scaleIn}>
                  <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-primary to-emerald-500" />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" />
                        AI Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div 
                        className="flex items-start gap-4 p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl border border-emerald-500/20"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-400 mb-1">Strengths</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Clear communication, well-structured response, and confident delivery. Great use of specific examples.
                          </p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-start gap-4 p-5 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl border border-amber-500/20"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-amber-400 mb-1">Areas to Improve</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Consider adding more specific metrics and quantifiable achievements to strengthen your response.
                          </p>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="pt-4 border-t border-border/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold">Pro Tip</h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Use the STAR method (Situation, Task, Action, Result) to structure your responses for maximum impact and clarity.
                        </p>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div 
                  variants={fadeInUp}
                  className="flex justify-center gap-4"
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => setState('in-progress')}
                    className="group"
                  >
                    <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Retry Question
                  </Button>
                  <Button 
                    variant="gradient" 
                    size="lg" 
                    onClick={nextQuestion}
                    className="group shadow-xl shadow-primary/25"
                  >
                    {currentQuestionIndex < sampleQuestions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        Complete Interview
                        <Trophy className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Complete Screen */}
            {state === 'complete' && (
              <motion.div
                key="complete"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                variants={staggerContainer}
                className="text-center"
              >
                <motion.div
                  className="relative w-28 h-28 mx-auto mb-8"
                  variants={scaleIn}
                >
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/40">
                    <Trophy className="w-14 h-14 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-10 h-10 text-primary fill-primary" />
                  </motion.div>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h1 className="font-display text-5xl font-bold mb-4">
                    Interview <span className="gradient-text">Complete!</span>
                  </h1>
                  <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                    Congratulations! You've completed all {sampleQuestions.length} questions. 
                    Keep practicing to build your interview confidence.
                  </p>
                </motion.div>

                <motion.div variants={scaleIn}>
                  <Card className="max-w-lg mx-auto mb-10 border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-primary to-amber-400" />
                    <CardHeader>
                      <CardTitle className="flex items-center justify-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-400" />
                        Performance Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { label: 'Questions Completed', value: `${sampleQuestions.length}/${sampleQuestions.length}`, color: 'text-emerald-400', icon: CheckCircle2 },
                        { label: 'Overall Confidence', value: 'Excellent', color: 'text-primary', icon: TrendingUp },
                        { label: 'Communication', value: 'Strong', color: 'text-primary', icon: MessageSquare },
                        { label: 'Structure', value: 'Well Organized', color: 'text-amber-400', icon: Target },
                      ].map((item, i) => (
                        <motion.div 
                          key={item.label}
                          className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-muted-foreground">{item.label}</span>
                          </div>
                          <span className={cn("font-semibold", item.color)}>{item.value}</span>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div 
                  variants={fadeInUp}
                  className="flex justify-center gap-4"
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={restartInterview}
                    className="group"
                  >
                    <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Practice Again
                  </Button>
                  <Button 
                    variant="gradient" 
                    size="lg"
                    className="shadow-xl shadow-primary/25"
                  >
                    View Detailed Report
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Interview;
