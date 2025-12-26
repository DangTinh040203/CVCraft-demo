import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, GraduationCap, Code, Languages, Award, FolderGit2,
  Plus, Trash2, Download, Eye, Sparkles, Settings2, ChevronRight, FileText,
  X, EyeOff, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Navbar from '@/components/Navbar';
import CVPreviewStyled from '@/components/cv/CVPreviewStyled';
import TemplateSelector from '@/components/cv/TemplateSelector';
import ColorPaletteSelector, { colorPalettes, ColorPalette } from '@/components/cv/ColorPaletteSelector';
import AIChat from '@/components/AIChat';
import MobileFAB from '@/components/cv/MobileFAB';
import { CVData, sampleCVData } from '@/types/cv';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipe } from '@/hooks/use-swipe';

type Section = 'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'certifications' | 'projects';

const sectionConfig = [
  { id: 'personal' as Section, label: 'Personal', icon: User },
  { id: 'experience' as Section, label: 'Experience', icon: Briefcase },
  { id: 'education' as Section, label: 'Education', icon: GraduationCap },
  { id: 'skills' as Section, label: 'Skills', icon: Code },
  { id: 'languages' as Section, label: 'Languages', icon: Languages },
  { id: 'certifications' as Section, label: 'Certifications', icon: Award },
  { id: 'projects' as Section, label: 'Projects', icon: FolderGit2 },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Builder = () => {
  const [cvData, setCvData] = useState<CVData>(sampleCVData);
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('professional-classic');
  const [selectedPalette, setSelectedPalette] = useState('classic');
  const [customizeSheetOpen, setCustomizeSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  const currentPalette = colorPalettes.find(p => p.id === selectedPalette) || colorPalettes[0];

  // Section navigation for swipe
  const currentSectionIndex = sectionConfig.findIndex(s => s.id === activeSection);
  
  const goToNextSection = useCallback(() => {
    if (currentSectionIndex < sectionConfig.length - 1) {
      setActiveSection(sectionConfig[currentSectionIndex + 1].id);
      setShowPreview(false);
    }
  }, [currentSectionIndex]);

  const goToPrevSection = useCallback(() => {
    if (currentSectionIndex > 0) {
      setActiveSection(sectionConfig[currentSectionIndex - 1].id);
      setShowPreview(false);
    }
  }, [currentSectionIndex]);

  // Swipe handlers for mobile navigation
  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNextSection,
    onSwipeRight: goToPrevSection,
    minSwipeDistance: 75,
  });

  const updatePersonalInfo = (field: keyof CVData['personalInfo'], value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now().toString(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        highlights: ['']
      }]
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now().toString(),
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        highlights: []
      }]
    }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const handleAIUpdate = (updatedData: Partial<CVData>) => {
    setCvData(prev => ({ ...prev, ...updatedData }));
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const data = cvData;
    let y = 20;

    doc.setFontSize(22);
    doc.setTextColor(currentPalette.primary);
    doc.text(data.personalInfo.fullName || 'Your Name', 105, y, { align: 'center' });
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(data.personalInfo.title || '', 105, y, { align: 'center' });
    y += 8;

    doc.setFontSize(9);
    const contact = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' | ');
    doc.text(contact, 105, y, { align: 'center' });
    y += 15;

    if (data.personalInfo.summary) {
      doc.setFontSize(11);
      doc.setTextColor(currentPalette.primary);
      doc.text('PROFESSIONAL SUMMARY', 20, y);
      y += 6;
      doc.setFontSize(9);
      doc.setTextColor(60);
      const summaryLines = doc.splitTextToSize(data.personalInfo.summary, 170);
      doc.text(summaryLines, 20, y);
      y += summaryLines.length * 5 + 10;
    }

    if (data.experience.length > 0) {
      doc.setFontSize(11);
      doc.setTextColor(currentPalette.primary);
      doc.text('EXPERIENCE', 20, y);
      y += 6;
      data.experience.forEach(exp => {
        doc.setFontSize(10);
        doc.setTextColor(40);
        doc.text(`${exp.position} at ${exp.company}`, 20, y);
        y += 5;
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(exp.description, 20, y);
        y += 8;
      });
      y += 5;
    }

    doc.save(`${data.personalInfo.fullName || 'CV'}_Resume.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  CV Builder
                </h1>
                <p className="text-muted-foreground text-xs md:text-sm">Craft your professional story</p>
              </div>
            </div>
            
            {/* Action buttons - hidden on mobile (using FAB instead) */}
            <div className="hidden md:flex gap-2 flex-wrap">
              <Sheet open={customizeSheetOpen} onOpenChange={setCustomizeSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 flex-shrink-0">
                    <Settings2 className="w-4 h-4" />
                    <span>Customize</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] overflow-y-auto" side="right">
                  <SheetHeader>
                    <SheetTitle>Customize Your CV</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6 pb-8">
                    <TemplateSelector 
                      selectedTemplate={selectedTemplate}
                      onSelectTemplate={setSelectedTemplate}
                    />
                    <ColorPaletteSelector 
                      selectedPalette={selectedPalette}
                      onSelectPalette={setSelectedPalette}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAIChat(!showAIChat)}
                className={cn('gap-2 flex-shrink-0', showAIChat && 'bg-primary/10 border-primary')}
              >
                <Sparkles className="w-4 h-4" />
                AI Assistant
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className={cn('gap-2 flex-shrink-0', showPreview && 'bg-primary/10 border-primary')}
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
              
              <Button variant="gradient" size="sm" onClick={exportPDF} className="gap-2 flex-shrink-0">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </motion.div>

          {/* Mobile Swipe Indicator */}
          {isMobile && !showPreview && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-4 px-2"
            >
              <button 
                onClick={goToPrevSection}
                disabled={currentSectionIndex === 0}
                className={cn(
                  'flex items-center gap-1 text-xs font-medium transition-colors',
                  currentSectionIndex === 0 ? 'text-muted-foreground/50' : 'text-primary'
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                {currentSectionIndex > 0 && sectionConfig[currentSectionIndex - 1].label}
              </button>
              
              <div className="flex gap-1.5">
                {sectionConfig.map((_, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      idx === currentSectionIndex ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                ))}
              </div>
              
              <button 
                onClick={goToNextSection}
                disabled={currentSectionIndex === sectionConfig.length - 1}
                className={cn(
                  'flex items-center gap-1 text-xs font-medium transition-colors',
                  currentSectionIndex === sectionConfig.length - 1 ? 'text-muted-foreground/50' : 'text-primary'
                )}
              >
                {currentSectionIndex < sectionConfig.length - 1 && sectionConfig[currentSectionIndex + 1].label}
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Sidebar Navigation - Horizontal scroll on mobile, vertical on desktop */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 order-1"
            >
              {/* Mobile: Horizontal scrolling tabs */}
              <div className="lg:hidden overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                  {sectionConfig.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => { setActiveSection(section.id); setShowPreview(false); }}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                          : 'bg-card text-muted-foreground border border-border/50'
                      )}
                    >
                      <section.icon className="w-4 h-4" />
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Desktop: Vertical navigation */}
              <Card className="hidden lg:block sticky top-24 bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    {sectionConfig.map((section, index) => (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                          activeSection === section.id
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <section.icon className="w-4 h-4" />
                          {section.label}
                        </span>
                        {activeSection === section.id && (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </motion.button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content - Full width on mobile when not previewing, editor only on desktop */}
            <div 
              className={cn(
                'order-2',
                showPreview ? 'hidden lg:hidden' : 'col-span-1 lg:col-span-5',
              )}
              {...(isMobile ? swipeHandlers : {})}
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`editor-${activeSection}`} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                    {/* Personal Info Section */}
                    {activeSection === 'personal' && (
                      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            Personal Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="fullName" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Full Name</Label>
                              <Input
                                id="fullName"
                                value={cvData.personalInfo.fullName}
                                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                                placeholder="John Anderson"
                                className="bg-background/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="title" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Job Title</Label>
                              <Input
                                id="title"
                                value={cvData.personalInfo.title}
                                onChange={(e) => updatePersonalInfo('title', e.target.value)}
                                placeholder="Senior Software Engineer"
                                className="bg-background/50"
                              />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={cvData.personalInfo.email}
                                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                placeholder="john@example.com"
                                className="bg-background/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</Label>
                              <Input
                                id="phone"
                                value={cvData.personalInfo.phone}
                                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                                placeholder="+1 (555) 123-4567"
                                className="bg-background/50"
                              />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="location" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</Label>
                              <Input
                                id="location"
                                value={cvData.personalInfo.location}
                                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                                placeholder="San Francisco, CA"
                                className="bg-background/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="linkedin" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">LinkedIn</Label>
                              <Input
                                id="linkedin"
                                value={cvData.personalInfo.linkedin || ''}
                                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                                placeholder="linkedin.com/in/username"
                                className="bg-background/50"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="summary" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Professional Summary</Label>
                            <Textarea
                              id="summary"
                              value={cvData.personalInfo.summary}
                              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                              placeholder="Write a brief summary of your professional background..."
                              rows={4}
                              className="bg-background/50 resize-none"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Experience Section */}
                    {activeSection === 'experience' && (
                      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Briefcase className="w-4 h-4 text-primary" />
                            </div>
                            Work Experience
                          </CardTitle>
                          <Button size="sm" onClick={addExperience} className="gap-1">
                            <Plus className="w-4 h-4" />
                            Add
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {cvData.experience.map((exp, index) => (
                            <motion.div 
                              key={exp.id} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-muted/30 rounded-xl space-y-4 border border-border/50"
                            >
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                  Position {index + 1}
                                </span>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeExperience(exp.id)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Company</Label>
                                  <Input
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                    placeholder="Company Name"
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Position</Label>
                                  <Input
                                    value={exp.position}
                                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                    placeholder="Job Title"
                                    className="bg-background/50"
                                  />
                                </div>
                              </div>
                              <div className="grid sm:grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Start Date</Label>
                                  <Input
                                    type="month"
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">End Date</Label>
                                  <Input
                                    type="month"
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                    disabled={exp.current}
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="flex items-center gap-2 pt-5">
                                  <Switch
                                    checked={exp.current}
                                    onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked)}
                                  />
                                  <Label className="text-xs">Current</Label>
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Description</Label>
                                <Textarea
                                  value={exp.description}
                                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                  placeholder="Describe your responsibilities..."
                                  rows={3}
                                  className="bg-background/50 resize-none"
                                />
                              </div>
                            </motion.div>
                          ))}
                          {cvData.experience.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">No experience added yet</p>
                              <p className="text-xs mt-1">Click "Add" to get started</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Education Section */}
                    {activeSection === 'education' && (
                      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <GraduationCap className="w-4 h-4 text-primary" />
                            </div>
                            Education
                          </CardTitle>
                          <Button size="sm" onClick={addEducation} className="gap-1">
                            <Plus className="w-4 h-4" />
                            Add
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {cvData.education.map((edu, index) => (
                            <motion.div 
                              key={edu.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-muted/30 rounded-xl space-y-4 border border-border/50"
                            >
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                  Education {index + 1}
                                </span>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeEducation(edu.id)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Institution</Label>
                                  <Input
                                    value={edu.institution}
                                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                    placeholder="University Name"
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Degree</Label>
                                  <Input
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                    placeholder="Bachelor of Science"
                                    className="bg-background/50"
                                  />
                                </div>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Field of Study</Label>
                                  <Input
                                    value={edu.field}
                                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                    placeholder="Computer Science"
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">End Date</Label>
                                  <Input
                                    type="month"
                                    value={edu.endDate}
                                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                    className="bg-background/50"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {cvData.education.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                              <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">No education added yet</p>
                              <p className="text-xs mt-1">Click "Add" to get started</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Skills Section */}
                    {activeSection === 'skills' && (
                      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Code className="w-4 h-4 text-primary" />
                            </div>
                            Skills
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-12 text-muted-foreground">
                            <Code className="w-10 h-10 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">Skills section coming soon</p>
                            <p className="text-xs mt-1">Use AI Assistant to help populate your skills</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Languages Section */}
                    {activeSection === 'languages' && (
                      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Languages className="w-4 h-4 text-primary" />
                            </div>
                            Languages
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-12 text-muted-foreground">
                            <Languages className="w-10 h-10 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">Languages section coming soon</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Certifications Section */}
                    {activeSection === 'certifications' && (
                      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Award className="w-4 h-4 text-primary" />
                            </div>
                            Certifications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-12 text-muted-foreground">
                            <Award className="w-10 h-10 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">Certifications section coming soon</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Projects Section */}
                    {activeSection === 'projects' && (
                      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FolderGit2 className="w-4 h-4 text-primary" />
                            </div>
                            Projects
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-12 text-muted-foreground">
                            <FolderGit2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">Projects section coming soon</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
              </AnimatePresence>
            </div>

            {/* Preview Panel - Always visible on desktop, full screen on mobile when preview active */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                'order-3',
                showPreview ? 'col-span-1 lg:col-span-10' : 'hidden lg:block lg:col-span-5'
              )}
            >
              <div className="lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">Live Preview</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: currentPalette.primary }}
                    />
                    <span className="text-xs text-muted-foreground">{currentPalette.name}</span>
                  </div>
                </div>
                <CVPreviewStyled 
                  data={cvData} 
                  palette={currentPalette}
                  templateId={selectedTemplate}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* AI Chat Panel - Desktop only */}
      <AnimatePresence>
        {showAIChat && !isMobile && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-4 top-24 bottom-4 w-80 lg:w-96 z-50 hidden md:block"
          >
            <AIChat cvData={cvData} onUpdate={handleAIUpdate} onClose={() => setShowAIChat(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile AI Chat Sheet */}
      <Sheet open={showAIChat && isMobile} onOpenChange={setShowAIChat}>
        <SheetContent side="bottom" className="h-[80vh] p-0">
          <AIChat cvData={cvData} onUpdate={handleAIUpdate} onClose={() => setShowAIChat(false)} />
        </SheetContent>
      </Sheet>

      {/* Mobile Customize Sheet */}
      <Sheet open={customizeSheetOpen && isMobile} onOpenChange={setCustomizeSheetOpen}>
        <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Customize Your CV</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6 pb-8">
            <TemplateSelector 
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
            <ColorPaletteSelector 
              selectedPalette={selectedPalette}
              onSelectPalette={setSelectedPalette}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile FAB */}
      {isMobile && (
        <MobileFAB
          onExportPDF={exportPDF}
          onTogglePreview={() => setShowPreview(!showPreview)}
          onOpenCustomize={() => setCustomizeSheetOpen(true)}
          onOpenAI={() => setShowAIChat(true)}
          showPreview={showPreview}
        />
      )}
    </div>
  );
};

export default Builder;
