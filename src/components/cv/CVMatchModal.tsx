import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CVData } from '@/types/cv';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Target, TrendingUp, CheckCircle2, XCircle, Lightbulb, Search, Upload, FileText, X } from 'lucide-react';
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

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excellent Match';
  if (score >= 50) return 'Partial Match';
  return 'Needs Improvement';
};

const CVMatchModal = ({ open, onOpenChange, cvData }: CVMatchModalProps) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt')) {
      toast.error('Please upload a PDF, Word, or text file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB.');
      return;
    }

    setUploadedFile(file);
    setIsExtractingFile(true);

    try {
      // For text files, read directly
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const text = await file.text();
        setJobDescription(text);
        setIsExtractingFile(false);
        return;
      }

      // For PDF/Word, send to edge function to extract text
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-jd-text`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to extract text from file');
      }

      const data = await response.json();
      setJobDescription(data.text || '');
      toast.success('File content extracted successfully!');
    } catch (err: any) {
      console.error('File extraction error:', err);
      toast.error(err.message || 'Failed to read file. Try pasting the text instead.');
      setUploadedFile(null);
    } finally {
      setIsExtractingFile(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setJobDescription('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please provide a job description first.');
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
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
            Provide a job description to see how well your CV matches.
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
              <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'text' | 'file')}>
                <TabsList className="w-full">
                  <TabsTrigger value="text" className="flex-1 gap-2">
                    <FileText className="w-4 h-4" />
                    Paste Text
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex-1 gap-2">
                    <Upload className="w-4 h-4" />
                    Upload File
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="mt-4">
                  <Textarea
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px] text-sm"
                    disabled={isAnalyzing}
                  />
                </TabsContent>

                <TabsContent value="file" className="mt-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {!uploadedFile ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isExtractingFile}
                      className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-sm">Click to upload JD file</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, Word (.doc, .docx), or Text file • Max 10MB</p>
                      </div>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        {isExtractingFile ? (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        ) : (
                          <button onClick={removeFile} className="p-1 hover:bg-background rounded">
                            <X className="w-4 h-4 text-muted-foreground" />
                          </button>
                        )}
                      </div>

                      {isExtractingFile && (
                        <p className="text-xs text-muted-foreground text-center">Extracting text from file...</p>
                      )}

                      {jobDescription && !isExtractingFile && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground font-medium">Extracted content preview:</p>
                          <div className="max-h-[150px] overflow-y-auto p-3 bg-muted/30 rounded-lg border text-xs text-muted-foreground whitespace-pre-wrap">
                            {jobDescription.slice(0, 1000)}
                            {jobDescription.length > 1000 && '...'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || isExtractingFile || !jobDescription.trim()}
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
              className="space-y-5"
            >
              {/* Hero Score Card */}
              <div className="relative rounded-2xl border bg-gradient-to-br from-background to-secondary/50 p-6 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.08),transparent_70%)]" />
                <div className="relative">
                  {/* Score Ring */}
                  <div className="mx-auto w-28 h-28 relative mb-3">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                      <motion.circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={result.overallScore >= 80 ? 'hsl(142 71% 45%)' : result.overallScore >= 50 ? 'hsl(38 92% 50%)' : 'hsl(0 84% 60%)'}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - result.overallScore / 100) }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={cn('text-3xl font-bold tracking-tight', getScoreColor(result.overallScore))}>
                        {result.overallScore}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">/ 100</span>
                    </div>
                  </div>
                  <div className={cn('text-sm font-semibold', getScoreColor(result.overallScore))}>
                    {getScoreLabel(result.overallScore)}
                  </div>
                  <p className="text-muted-foreground text-xs mt-2 max-w-sm mx-auto leading-relaxed">{result.summary}</p>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="rounded-xl border bg-card p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Score Breakdown
                </h3>
                <div className="space-y-3">
                  {result.categories.map((cat, idx) => (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{cat.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground">wt. {cat.weight}%</span>
                          <span className={cn('text-xs font-bold tabular-nums', getScoreColor(cat.score))}>{cat.score}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={cn('h-full rounded-full', cat.score >= 80 ? 'bg-green-500' : cat.score >= 50 ? 'bg-yellow-500' : 'bg-destructive')}
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.score}%` }}
                          transition={{ duration: 0.8, delay: 0.1 * idx, ease: 'easeOut' }}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{cat.details}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Strengths & Missing Keywords - Side by Side on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.strengths.length > 0 && (
                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 space-y-2">
                    <h3 className="font-semibold text-xs flex items-center gap-1.5 text-green-600 dark:text-green-400 uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                    </h3>
                    <ul className="space-y-1.5">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5 leading-relaxed">
                          <span className="text-green-500 mt-0.5 shrink-0">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.missingKeywords.length > 0 && (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-2">
                    <h3 className="font-semibold text-xs flex items-center gap-1.5 text-destructive uppercase tracking-wider">
                      <XCircle className="w-3.5 h-3.5" /> Missing Keywords
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {result.missingKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-destructive/10 text-destructive rounded-md text-[11px] font-medium border border-destructive/15">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Improvement Suggestions */}
              {result.improvements.length > 0 && (
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 space-y-2">
                  <h3 className="font-semibold text-xs flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5" /> Suggestions to Improve
                  </h3>
                  <ul className="space-y-2">
                    {result.improvements.map((tip, i) => (
                      <li key={i} className="text-xs text-foreground/80 flex items-start gap-2 leading-relaxed">
                        <span className="w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                          {i + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button onClick={handleReset} variant="outline" className="w-full gap-2">
                <Search className="w-3.5 h-3.5" />
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
