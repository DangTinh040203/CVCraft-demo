import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CVData } from '@/types/cv';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Target, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Lightbulb, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchResult {
  overallScore: number;
  categories: { name: string; score: number; weight: number; details: string }[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  summary: string;
}

interface CVMatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cvData: CVData;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
};

const getScoreBg = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excellent Match';
  if (score >= 50) return 'Partial Match';
  return 'Needs Improvement';
};

const CVMatchModal = ({ open, onOpenChange, cvData }: CVMatchModalProps) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description first.');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('cv-match', {
        body: { cvData, jobDescription },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setResult(data);
    } catch (err: any) {
      console.error('Match error:', err);
      toast.error(err.message || 'Failed to analyze. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setJobDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="w-5 h-5 text-primary" />
            CV-JD Match Analysis
          </DialogTitle>
          <DialogDescription>
            Paste a job description to see how well your CV matches.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px] text-sm"
                disabled={isAnalyzing}
              />
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobDescription.trim()}
                className="w-full gap-2"
                variant="gradient"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Analyze Match
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Overall Score */}
              <div className="text-center py-4">
                <div className={cn('text-6xl font-bold', getScoreColor(result.overallScore))}>
                  {result.overallScore}%
                </div>
                <div className={cn('text-sm font-medium mt-1', getScoreColor(result.overallScore))}>
                  {getScoreLabel(result.overallScore)}
                </div>
                <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">{result.summary}</p>
              </div>

              {/* Category Scores */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Breakdown
                </h3>
                {result.categories.map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{cat.name} <span className="text-muted-foreground">({cat.weight}%)</span></span>
                      <span className={cn('font-semibold', getScoreColor(cat.score))}>{cat.score}%</span>
                    </div>
                    <Progress value={cat.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">{cat.details}</p>
                  </div>
                ))}
              </div>

              {/* Strengths */}
              {result.strengths.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" /> Strengths
                  </h3>
                  <ul className="space-y-1">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Keywords */}
              {result.missingKeywords.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm flex items-center gap-2 text-red-500">
                    <XCircle className="w-4 h-4" /> Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-2 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {result.improvements.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm flex items-center gap-2 text-yellow-600">
                    <Lightbulb className="w-4 h-4" /> Suggestions
                  </h3>
                  <ul className="space-y-1">
                    {result.improvements.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-yellow-500 mt-0.5">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button onClick={handleReset} variant="outline" className="w-full">
                Analyze Another JD
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default CVMatchModal;
