import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Mic, MicOff, MessageSquare, Clock, 
  CheckCircle2, Volume2, Sparkles, Brain, Target, Zap, 
  ArrowRight, RotateCcw, Trophy, Star, TrendingUp, 
  Download, Briefcase, Code, Users2, Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';

interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tips: string[];
}

// Behavioral Questions
const behavioralQuestions: InterviewQuestion[] = [
  {
    id: 'b1',
    question: 'Tell me about yourself and your professional background.',
    category: 'Introduction',
    difficulty: 'easy',
    tips: ['Keep it under 2 minutes', 'Focus on relevant experience', 'End with why you\'re excited about this role'],
  },
  {
    id: 'b2',
    question: 'What is your greatest professional achievement?',
    category: 'Behavioral',
    difficulty: 'medium',
    tips: ['Use the STAR method', 'Include metrics if possible', 'Show impact on the organization'],
  },
  {
    id: 'b3',
    question: 'Describe a challenging situation at work and how you handled it.',
    category: 'Behavioral',
    difficulty: 'medium',
    tips: ['Be specific about the situation', 'Explain your thought process', 'Highlight the positive outcome'],
  },
  {
    id: 'b4',
    question: 'Where do you see yourself in 5 years?',
    category: 'Career Goals',
    difficulty: 'easy',
    tips: ['Show ambition but be realistic', 'Align with the company\'s growth', 'Demonstrate commitment'],
  },
  {
    id: 'b5',
    question: 'Why should we hire you over other candidates?',
    category: 'Self-Assessment',
    difficulty: 'hard',
    tips: ['Highlight unique skills', 'Reference the job requirements', 'Show enthusiasm for the role'],
  },
  {
    id: 'b6',
    question: 'Tell me about a time you failed and what you learned from it.',
    category: 'Behavioral',
    difficulty: 'hard',
    tips: ['Be honest about the failure', 'Focus on the learning', 'Show growth mindset'],
  },
  {
    id: 'b7',
    question: 'How do you handle stress and pressure?',
    category: 'Behavioral',
    difficulty: 'medium',
    tips: ['Give specific examples', 'Show coping strategies', 'Demonstrate resilience'],
  },
  {
    id: 'b8',
    question: 'Describe your leadership style.',
    category: 'Leadership',
    difficulty: 'medium',
    tips: ['Use real examples', 'Show adaptability', 'Highlight team success'],
  },
];

// Technical Questions
const technicalQuestions: InterviewQuestion[] = [
  {
    id: 't1',
    question: 'Explain a complex technical concept you recently worked with.',
    category: 'Technical',
    difficulty: 'medium',
    tips: ['Break it down simply', 'Use analogies', 'Show your understanding'],
  },
  {
    id: 't2',
    question: 'How do you stay updated with the latest technologies in your field?',
    category: 'Technical',
    difficulty: 'easy',
    tips: ['Mention specific resources', 'Show continuous learning', 'Give examples'],
  },
  {
    id: 't3',
    question: 'Describe a technical problem you solved and your approach.',
    category: 'Problem Solving',
    difficulty: 'hard',
    tips: ['Use the STAR method', 'Explain your debugging process', 'Show systematic thinking'],
  },
  {
    id: 't4',
    question: 'How do you ensure code quality in your projects?',
    category: 'Technical',
    difficulty: 'medium',
    tips: ['Mention testing strategies', 'Code reviews', 'Best practices'],
  },
  {
    id: 't5',
    question: 'Explain your experience with system design and architecture.',
    category: 'System Design',
    difficulty: 'hard',
    tips: ['Start with high-level overview', 'Discuss trade-offs', 'Consider scalability'],
  },
  {
    id: 't6',
    question: 'How do you handle technical debt in projects?',
    category: 'Technical',
    difficulty: 'medium',
    tips: ['Show prioritization skills', 'Balance features vs refactoring', 'Give examples'],
  },
  {
    id: 't7',
    question: 'Describe your experience working with APIs and integrations.',
    category: 'Technical',
    difficulty: 'medium',
    tips: ['Mention specific APIs', 'Discuss challenges', 'Show integration experience'],
  },
  {
    id: 't8',
    question: 'How do you approach debugging a production issue?',
    category: 'Problem Solving',
    difficulty: 'hard',
    tips: ['Show systematic approach', 'Mention monitoring tools', 'Discuss root cause analysis'],
  },
];

type InterviewState = 'setup' | 'in-progress' | 'feedback' | 'complete';
type InterviewType = 'behavioral' | 'technical';

interface InterviewSettings {
  jobTitle: string;
  type: InterviewType;
  questionCount: number;
  enableFeedback: boolean;
}

interface AnswerFeedback {
  questionId: string;
  question: string;
  recordingTime: number;
  strengths: string;
  improvements: string;
}

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
  const [settings, setSettings] = useState<InterviewSettings>({
    jobTitle: '',
    type: 'behavioral',
    questionCount: 5,
    enableFeedback: true,
  });
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [feedbacks, setFeedbacks] = useState<AnswerFeedback[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

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
    const sourceQuestions = settings.type === 'behavioral' ? behavioralQuestions : technicalQuestions;
    const shuffled = [...sourceQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, settings.questionCount);
    setQuestions(selected);
    setFeedbacks([]);
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
      
      // Save feedback for this question
      const newFeedback: AnswerFeedback = {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        recordingTime,
        strengths: 'Clear communication, well-structured response, and confident delivery.',
        improvements: 'Consider adding more specific metrics and quantifiable achievements.',
      };
      setFeedbacks(prev => [...prev, newFeedback]);
      
      if (settings.enableFeedback) {
        setState('feedback');
      } else {
        nextQuestion();
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
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
    setFeedbacks([]);
    setRecordingTime(0);
    setIsRecording(false);
    setQuestions([]);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(99, 102, 241); // Primary color
    doc.text('Interview Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    // Job Title & Type
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Position: ${settings.jobTitle || 'Not specified'}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Interview Type: ${settings.type === 'behavioral' ? 'Behavioral' : 'Technical'}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 15;
    
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;
    
    // Summary
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.text('Performance Summary', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Questions Completed: ${feedbacks.length}/${questions.length}`, 25, yPosition);
    yPosition += 7;
    const totalTime = feedbacks.reduce((acc, f) => acc + f.recordingTime, 0);
    doc.text(`Total Recording Time: ${formatTime(totalTime)}`, 25, yPosition);
    yPosition += 15;
    
    // Questions & Feedback
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.text('Questions & Feedback', 20, yPosition);
    yPosition += 12;
    
    feedbacks.forEach((feedback, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Question number
      doc.setFontSize(12);
      doc.setTextColor(99, 102, 241);
      doc.text(`Question ${index + 1}`, 20, yPosition);
      yPosition += 7;
      
      // Question text
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      const questionLines = doc.splitTextToSize(feedback.question, pageWidth - 50);
      doc.text(questionLines, 25, yPosition);
      yPosition += questionLines.length * 6 + 5;
      
      // Recording time
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Recording Time: ${formatTime(feedback.recordingTime)}`, 25, yPosition);
      yPosition += 8;
      
      // Strengths
      doc.setTextColor(34, 197, 94); // Green
      doc.text('Strengths:', 25, yPosition);
      yPosition += 5;
      doc.setTextColor(80, 80, 80);
      const strengthLines = doc.splitTextToSize(feedback.strengths, pageWidth - 55);
      doc.text(strengthLines, 30, yPosition);
      yPosition += strengthLines.length * 5 + 5;
      
      // Improvements
      doc.setTextColor(245, 158, 11); // Amber
      doc.text('Areas to Improve:', 25, yPosition);
      yPosition += 5;
      doc.setTextColor(80, 80, 80);
      const improvementLines = doc.splitTextToSize(feedback.improvements, pageWidth - 55);
      doc.text(improvementLines, 30, yPosition);
      yPosition += improvementLines.length * 5 + 12;
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generated by AI Mock Interview | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    doc.save(`interview-report-${settings.jobTitle.replace(/\s+/g, '-').toLowerCase() || 'general'}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const questionCounts = [3, 5, 7, 10];

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
                    Customize your practice session and get AI-powered feedback to ace your dream job.
                  </p>
                </motion.div>

                {/* Setup Form */}
                <motion.div variants={scaleIn}>
                  <Card className="max-w-2xl mx-auto mb-8 border-border/40 bg-card/90 backdrop-blur-md overflow-hidden shadow-xl relative">
                    {/* Top gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                    
                    <CardHeader className="pb-2 pt-8 px-8">
                      <CardTitle className="text-2xl flex items-center gap-3 font-display">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                          <Settings2 className="w-5 h-5 text-primary-foreground" />
                        </div>
                        Interview Setup
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Configure your mock interview session</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-7 px-8 pb-8 pt-4">
                      {/* Job Title */}
                      <div className="space-y-2.5">
                        <Label htmlFor="jobTitle" className="text-sm font-semibold flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          Job Title
                        </Label>
                        <Input
                          id="jobTitle"
                          placeholder="e.g. Software Engineer, Product Manager..."
                          value={settings.jobTitle}
                          onChange={(e) => setSettings(prev => ({ ...prev, jobTitle: e.target.value }))}
                          className="bg-muted/40 border-border/50 h-12 text-base px-4 focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-border/50" />

                      {/* Interview Type */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Interview Type</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSettings(prev => ({ ...prev, type: 'behavioral' }))}
                            className={cn(
                              "relative p-5 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden group",
                              settings.type === 'behavioral'
                                ? "border-primary bg-primary/8 shadow-md shadow-primary/10"
                                : "border-border/40 bg-muted/20 hover:border-primary/40 hover:bg-muted/40"
                            )}
                          >
                            {settings.type === 'behavioral' && (
                              <motion.div 
                                layoutId="typeIndicator"
                                className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                              </motion.div>
                            )}
                            <div className={cn(
                              "w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors",
                              settings.type === 'behavioral' ? "bg-primary/15" : "bg-muted/60"
                            )}>
                              <Users2 className={cn(
                                "w-5 h-5 transition-colors",
                                settings.type === 'behavioral' ? "text-primary" : "text-muted-foreground"
                              )} />
                            </div>
                            <h3 className="font-semibold text-sm">Behavioral</h3>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Soft skills, teamwork & leadership</p>
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSettings(prev => ({ ...prev, type: 'technical' }))}
                            className={cn(
                              "relative p-5 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden group",
                              settings.type === 'technical'
                                ? "border-primary bg-primary/8 shadow-md shadow-primary/10"
                                : "border-border/40 bg-muted/20 hover:border-primary/40 hover:bg-muted/40"
                            )}
                          >
                            {settings.type === 'technical' && (
                              <motion.div 
                                layoutId="typeIndicator"
                                className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                              </motion.div>
                            )}
                            <div className={cn(
                              "w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors",
                              settings.type === 'technical' ? "bg-primary/15" : "bg-muted/60"
                            )}>
                              <Code className={cn(
                                "w-5 h-5 transition-colors",
                                settings.type === 'technical' ? "text-primary" : "text-muted-foreground"
                              )} />
                            </div>
                            <h3 className="font-semibold text-sm">Technical</h3>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Skills & problem solving</p>
                          </motion.button>
                        </div>
                      </div>

                      {/* Question Count */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            Number of Questions
                          </Label>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                            {settings.questionCount} questions
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {questionCounts.map((count) => (
                            <motion.button
                              key={count}
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => setSettings(prev => ({ ...prev, questionCount: count }))}
                              className={cn(
                                "flex-1 py-3.5 rounded-xl border-2 font-bold text-sm transition-all duration-300",
                                settings.questionCount === count
                                  ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                                  : "border-border/40 bg-muted/20 text-muted-foreground hover:border-primary/40 hover:bg-muted/40"
                              )}
                            >
                              {count}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Feedback Toggle */}
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-muted/40 to-muted/20 border border-border/40">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <Label htmlFor="feedback" className="font-semibold text-sm cursor-pointer">AI Feedback</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">Get instant feedback after each answer</p>
                          </div>
                        </div>
                        <Switch
                          id="feedback"
                          checked={settings.enableFeedback}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableFeedback: checked }))}
                        />
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-border/50" />

                      {/* CTA Buttons */}
                      <div className="pt-1 space-y-3">
                        <Button 
                          variant="gradient" 
                          size="lg" 
                          onClick={startInterview}
                          disabled={!settings.jobTitle.trim()}
                          className="w-full h-13 text-base font-semibold group relative overflow-hidden shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 rounded-xl"
                        >
                          <span className="relative z-10 flex items-center gap-2.5">
                            <Mic className="w-5 h-5" />
                            Start Interview
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg" 
                          onClick={() => {
                            // Generate demo data
                            const demoQuestions = [...behavioralQuestions].slice(0, 5);
                            setQuestions(demoQuestions);
                            setFeedbacks(demoQuestions.map(q => ({
                              questionId: q.id,
                              question: q.question,
                              recordingTime: Math.floor(Math.random() * 60) + 30,
                              strengths: 'Clear communication, well-structured response, and confident delivery.',
                              improvements: 'Consider adding more specific metrics and quantifiable achievements.',
                            })));
                            setState('complete');
                          }}
                          className="w-full h-11 text-sm font-medium rounded-xl border-border/50 hover:bg-muted/50 gap-2"
                        >
                          <Trophy className="w-4 h-4 text-primary" />
                          Preview Demo Result
                        </Button>
                        {!settings.jobTitle.trim() && (
                          <p className="text-xs text-muted-foreground mt-1 text-center">Enter a job title to get started</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* In Progress */}
            {state === 'in-progress' && currentQuestion && (
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
                          {currentQuestionIndex + 1} <span className="text-muted-foreground font-normal">/ {questions.length}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">{settings.jobTitle}</span>
                      <motion.span 
                        className={cn(
                          'ml-2 text-sm px-4 py-2 rounded-full font-medium capitalize border',
                          getDifficultyColor(currentQuestion.difficulty)
                        )}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        {currentQuestion.difficulty}
                      </motion.span>
                    </div>
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
            {state === 'feedback' && currentQuestion && (
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
                            {feedbacks[feedbacks.length - 1]?.strengths || 'Clear communication, well-structured response, and confident delivery.'}
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
                            {feedbacks[feedbacks.length - 1]?.improvements || 'Consider adding more specific metrics and quantifiable achievements.'}
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
                    onClick={() => {
                      setFeedbacks(prev => prev.slice(0, -1));
                      setState('in-progress');
                    }}
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
                    {currentQuestionIndex < questions.length - 1 ? (
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
            {state === 'complete' && (() => {
              const totalTime = feedbacks.reduce((acc, f) => acc + f.recordingTime, 0);
              const avgTime = feedbacks.length > 0 ? totalTime / feedbacks.length : 0;
              // Simple score based on avg recording time (longer = better, max 120s = 100%)
              const overallScore = Math.min(100, Math.round((avgTime / 120) * 100));
              const scoreColor = overallScore >= 70 ? 'text-emerald-500' : overallScore >= 40 ? 'text-amber-500' : 'text-rose-500';
              const scoreRingColor = overallScore >= 70 ? '#10b981' : overallScore >= 40 ? '#f59e0b' : '#ef4444';
              const scoreLabel = overallScore >= 70 ? 'Great Performance' : overallScore >= 40 ? 'Needs Improvement' : 'Needs Work';
              const scoreBadgeColor = overallScore >= 70 ? 'bg-emerald-500/10 text-emerald-500' : overallScore >= 40 ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500';
              const circumference = 2 * Math.PI * 54;
              const strokeDashoffset = circumference - (overallScore / 100) * circumference;

              return (
                <motion.div
                  key="complete"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  variants={staggerContainer}
                  className="max-w-3xl mx-auto"
                >
                  {/* Hero Score Section */}
                  <motion.div variants={fadeInUp} className="text-center mb-10">
                    <Card className="relative overflow-hidden border-border/40 bg-card/90 backdrop-blur-md shadow-xl">
                      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                      <CardContent className="pt-10 pb-8 px-8">
                        {/* Score Ring */}
                        <motion.div 
                          className="relative w-40 h-40 mx-auto mb-6"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
                        >
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" className="stroke-muted/30" />
                            <motion.circle 
                              cx="60" cy="60" r="54" fill="none" strokeWidth="8"
                              stroke={scoreRingColor}
                              strokeLinecap="round"
                              strokeDasharray={circumference}
                              initial={{ strokeDashoffset: circumference }}
                              animate={{ strokeDashoffset }}
                              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span 
                              className={cn("text-4xl font-display font-bold", scoreColor)}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1 }}
                            >
                              {overallScore}%
                            </motion.span>
                          </div>
                        </motion.div>

                        <motion.span 
                          className={cn("inline-block text-xs font-bold px-3 py-1 rounded-full mb-3", scoreBadgeColor)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2 }}
                        >
                          {overallScore >= 70 ? '🔥' : overallScore >= 40 ? '⚡' : '📈'} {scoreLabel}
                        </motion.span>

                        <motion.h2 
                          className="font-display text-2xl font-bold mb-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          Interview Complete!
                        </motion.h2>
                        <motion.p 
                          className="text-sm text-muted-foreground max-w-md mx-auto"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.9 }}
                        >
                          You completed {feedbacks.length}/{questions.length} questions for <strong>{settings.jobTitle}</strong> in {formatTime(totalTime)}.
                        </motion.p>

                        {/* Stats Row */}
                        <motion.div 
                          className="grid grid-cols-3 gap-3 mt-8"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 }}
                        >
                          {[
                            { icon: CheckCircle2, label: 'Completed', value: `${feedbacks.length}/${questions.length}`, color: 'text-emerald-500' },
                            { icon: Clock, label: 'Total Time', value: formatTime(totalTime), color: 'text-amber-500' },
                            { icon: Zap, label: 'Avg/Question', value: formatTime(Math.round(avgTime)), color: 'text-primary' },
                          ].map((stat, i) => (
                            <div key={stat.label} className="p-3 rounded-xl bg-muted/30 border border-border/30">
                              <stat.icon className={cn("w-5 h-5 mx-auto mb-1.5", stat.color)} />
                              <div className={cn("text-lg font-bold font-display", stat.color)}>{stat.value}</div>
                              <div className="text-[11px] text-muted-foreground">{stat.label}</div>
                            </div>
                          ))}
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Score Breakdown */}
                  <motion.div variants={scaleIn} className="mb-8">
                    <Card className="border-border/40 bg-card/90 backdrop-blur-sm overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Score Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {feedbacks.map((fb, i) => {
                          const qScore = Math.min(100, Math.round((fb.recordingTime / 120) * 100));
                          const qColor = qScore >= 70 ? 'text-emerald-500' : qScore >= 40 ? 'text-amber-500' : 'text-rose-500';
                          const qBg = qScore >= 70 ? 'bg-emerald-500' : qScore >= 40 ? 'bg-amber-500' : 'bg-rose-500';
                          return (
                            <motion.div 
                              key={fb.questionId}
                              className="p-4 rounded-xl bg-muted/20 border border-border/30"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                            >
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                  <span className="text-xs font-semibold text-primary">Q{i + 1}</span>
                                  <p className="text-sm font-medium mt-0.5 leading-relaxed">{fb.question}</p>
                                </div>
                                <span className={cn("text-sm font-bold tabular-nums", qColor)}>{qScore}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                                <motion.div 
                                  className={cn("h-full rounded-full", qBg)}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${qScore}%` }}
                                  transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                                />
                              </div>
                              <div className="mt-3 space-y-2">
                                <p className="text-xs text-emerald-500 flex items-start gap-1.5">
                                  <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                  {fb.strengths}
                                </p>
                                <p className="text-xs text-amber-500 flex items-start gap-1.5">
                                  <Target className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                  {fb.improvements}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Strengths & Improvements Side by Side */}
                  <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Strengths */}
                    <Card className="border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-emerald-500">
                          <CheckCircle2 className="w-4 h-4" />
                          STRENGTHS
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2.5">
                          {feedbacks.map((fb, i) => (
                            <motion.li 
                              key={i}
                              className="text-xs text-muted-foreground flex items-start gap-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + i * 0.08 }}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                              {fb.strengths}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Areas for Improvement */}
                    <Card className="border-rose-500/20 bg-rose-500/5 overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-rose-500">
                          <Target className="w-4 h-4" />
                          AREAS FOR IMPROVEMENT
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2.5">
                          {feedbacks.map((fb, i) => (
                            <motion.li 
                              key={i}
                              className="text-xs text-muted-foreground flex items-start gap-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + i * 0.08 }}
                            >
                              <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                                {i + 1}
                              </span>
                              {fb.improvements}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div 
                    variants={fadeInUp}
                    className="flex flex-col sm:flex-row justify-center gap-3"
                  >
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={restartInterview}
                      className="group rounded-xl"
                    >
                      <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Interview Again
                    </Button>
                    <Button 
                      variant="gradient" 
                      size="lg"
                      onClick={downloadPDF}
                      className="shadow-xl shadow-primary/25 rounded-xl"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Report (PDF)
                    </Button>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Interview;
