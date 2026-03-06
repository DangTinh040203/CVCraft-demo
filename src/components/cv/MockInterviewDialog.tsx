import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Mic, Sparkles, MessageSquare, Users2, Code, Shuffle, Globe, Volume2, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MockInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type InterviewType = 'all' | 'behavioral' | 'technical';

interface InterviewConfig {
  jobDescription: string;
  questionCount: number;
  type: InterviewType;
  language: string;
  voice: string;
  speechSpeed: number;
}

const interviewTypes = [
  { value: 'all' as const, label: 'All (Mixed)', icon: Shuffle, desc: 'Blend of all question types' },
  { value: 'behavioral' as const, label: 'Behavioral', icon: Users2, desc: 'Soft skills & teamwork' },
  { value: 'technical' as const, label: 'Technical', icon: Code, desc: 'Technical problem solving' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'zh', label: '中文' },
];

const voices = [
  { value: 'kore-firm', label: 'Kore — Firm' },
  { value: 'aria-warm', label: 'Aria — Warm' },
  { value: 'nova-friendly', label: 'Nova — Friendly' },
  { value: 'echo-deep', label: 'Echo — Deep' },
];

const MockInterviewDialog = ({ open, onOpenChange }: MockInterviewDialogProps) => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<InterviewConfig>({
    jobDescription: '',
    questionCount: 5,
    type: 'all',
    language: 'en',
    voice: 'kore-firm',
    speechSpeed: 1.0,
  });

  const handleStart = () => {
    onOpenChange(false);
    navigate('/interview');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border/40 bg-card/95 backdrop-blur-md">
        {/* Top gradient accent */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-display flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Mic className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              Mock Interview
              <Sparkles className="w-5 h-5 text-accent" />
            </DialogTitle>
            <DialogDescription className="text-sm">
              Set up your mock interview with AI.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Job Description */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold">Job Description</Label>
            <Textarea
              placeholder="Paste the job description here..."
              value={config.jobDescription}
              onChange={(e) => setConfig(prev => ({ ...prev, jobDescription: e.target.value }))}
              className="min-h-[120px] bg-muted/30 border-border/50 text-sm resize-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <p className="text-xs text-muted-foreground">
              The AI interviewer will tailor questions based on this JD and your resume.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/40" />

          {/* Number of Questions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Number of Questions</Label>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full tabular-nums">
                {config.questionCount}
              </span>
            </div>
            <Slider
              value={[config.questionCount]}
              onValueChange={([v]) => setConfig(prev => ({ ...prev, questionCount: v }))}
              min={3}
              max={10}
              step={1}
              className="py-1"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>3 questions</span>
              <span>10 questions</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/40" />

          {/* Interview Type */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Interview Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {interviewTypes.map((t) => (
                <motion.button
                  key={t.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setConfig(prev => ({ ...prev, type: t.value }))}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 text-center",
                    config.type === t.value
                      ? "border-primary bg-primary/8 shadow-sm shadow-primary/10"
                      : "border-border/40 bg-muted/20 hover:border-primary/40"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    config.type === t.value ? "bg-primary/15" : "bg-muted/50"
                  )}>
                    <t.icon className={cn(
                      "w-4 h-4 transition-colors",
                      config.type === t.value ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <span className={cn(
                    "text-xs font-semibold transition-colors",
                    config.type === t.value ? "text-primary" : "text-foreground"
                  )}>
                    {t.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Language & Voice Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary" />
                Language
              </Label>
              <Select value={config.language} onValueChange={(v) => setConfig(prev => ({ ...prev, language: v }))}>
                <SelectTrigger className="bg-muted/30 border-border/50 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(l => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-primary" />
                Voice
              </Label>
              <Select value={config.voice} onValueChange={(v) => setConfig(prev => ({ ...prev, voice: v }))}>
                <SelectTrigger className="bg-muted/30 border-border/50 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voices.map(v => (
                    <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Speech Speed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-primary" />
                Speech Speed
              </Label>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full tabular-nums">
                {config.speechSpeed.toFixed(1)}×
              </span>
            </div>
            <Slider
              value={[config.speechSpeed]}
              onValueChange={([v]) => setConfig(prev => ({ ...prev, speechSpeed: v }))}
              min={0.5}
              max={2.0}
              step={0.1}
              className="py-1"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>0.5× (Slow)</span>
              <span>1.0×</span>
              <span>2.0× (Fast)</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/40" />

          {/* Start Button */}
          <Button
            variant="gradient"
            size="lg"
            onClick={handleStart}
            className="w-full h-12 text-base font-semibold group relative overflow-hidden shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 rounded-xl gap-2.5"
          >
            <Mic className="w-5 h-5" />
            Start Interview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MockInterviewDialog;
