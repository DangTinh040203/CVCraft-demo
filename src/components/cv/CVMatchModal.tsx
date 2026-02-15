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
