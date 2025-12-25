import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, SkipForward, MessageSquare, Clock, CheckCircle2, XCircle, Volume2 } from 'lucide-react';
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
      // Save mock answer
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
      case 'easy': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-amber-500 bg-amber-500/10';
      case 'hard': return 'text-red-500 bg-red-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Setup Screen */}
          {state === 'setup' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-bg flex items-center justify-center shadow-glow">
                <MessageSquare className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-4xl font-bold mb-4">
                AI Mock <span className="gradient-text">Interview</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Practice your interview skills with AI-powered feedback. Answer questions verbally and get instant analysis.
              </p>

              <Card className="max-w-md mx-auto mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Interview Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Questions</span>
                    <span className="font-medium">{sampleQuestions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Estimated Time</span>
                    <span className="font-medium">15-20 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Categories</span>
                    <span className="font-medium">Behavioral, Technical</span>
                  </div>
                </CardContent>
              </Card>

              <Button variant="hero" size="xl" onClick={startInterview}>
                <Mic className="w-5 h-5 mr-2" />
                Start Interview
              </Button>
            </div>
          )}

          {/* In Progress */}
          {state === 'in-progress' && (
            <div className="space-y-6">
              {/* Progress Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {sampleQuestions.length}
                </span>
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full font-medium capitalize',
                  getDifficultyColor(currentQuestion.difficulty)
                )}>
                  {currentQuestion.difficulty}
                </span>
              </div>
              <Progress value={progress} className="h-2" />

              {/* Question Card */}
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <span className="text-xs text-primary font-medium uppercase tracking-wide">
                    {currentQuestion.category}
                  </span>
                  <h2 className="font-display text-2xl font-semibold mt-2 mb-6">
                    {currentQuestion.question}
                  </h2>

                  {/* Tips */}
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-primary" />
                      Tips for answering:
                    </h4>
                    <ul className="space-y-1">
                      {currentQuestion.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recording Controls */}
                  <div className="text-center">
                    <div className="mb-4">
                      <span className="font-display text-4xl font-bold text-foreground">
                        {formatTime(recordingTime)}
                      </span>
                    </div>

                    <div className="flex justify-center gap-4">
                      <Button
                        variant={isRecording ? 'destructive' : 'gradient'}
                        size="xl"
                        onClick={toggleRecording}
                        className="w-48"
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
                    </div>

                    {isRecording && (
                      <p className="text-sm text-muted-foreground mt-4 animate-pulse">
                        Recording in progress... Click stop when you're done.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Feedback Screen */}
          {state === 'feedback' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold">Great job!</h2>
                <p className="text-muted-foreground">Here's your feedback for this question</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>AI Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <div>
                      <h4 className="font-medium text-green-700">Strengths</h4>
                      <p className="text-sm text-muted-foreground">
                        Clear communication, good structure, and confident delivery.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-amber-500/10 rounded-lg">
                    <Clock className="w-6 h-6 text-amber-500" />
                    <div>
                      <h4 className="font-medium text-amber-700">Areas to Improve</h4>
                      <p className="text-sm text-muted-foreground">
                        Consider adding more specific metrics and examples from your experience.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-2">Suggested Answer Structure:</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the STAR method (Situation, Task, Action, Result) to structure your response for maximum impact.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4">
                <Button variant="outline" size="lg" onClick={() => setState('in-progress')}>
                  Retry Question
                </Button>
                <Button variant="gradient" size="lg" onClick={nextQuestion}>
                  {currentQuestionIndex < sampleQuestions.length - 1 ? (
                    <>
                      Next Question
                      <SkipForward className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    'Complete Interview'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Complete Screen */}
          {state === 'complete' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="font-display text-4xl font-bold mb-4">
                Interview <span className="gradient-text">Complete!</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Great job completing all {sampleQuestions.length} questions. Keep practicing to improve your interview skills.
              </p>

              <Card className="max-w-md mx-auto mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Your Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Questions Answered</span>
                    <span className="font-medium text-green-500">{sampleQuestions.length}/{sampleQuestions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Overall Confidence</span>
                    <span className="font-medium text-primary">Good</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Communication</span>
                    <span className="font-medium text-primary">Strong</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4">
                <Button variant="outline" size="lg" onClick={restartInterview}>
                  Practice Again
                </Button>
                <Button variant="gradient" size="lg">
                  View Detailed Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Interview;
