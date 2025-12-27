import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, GraduationCap, Code, Award, FolderGit2,
  Plus, Trash2, Download, Eye, Sparkles, Settings2, ChevronRight, FileText,
  X, EyeOff, ChevronLeft, ImagePlus
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
import SummaryEditor from '@/components/cv/SummaryEditor';
import { CVData, sampleCVData, ContactItem, SkillItem } from '@/types/cv';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipe } from '@/hooks/use-swipe';
import { toast } from 'sonner';

type Section = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'certifications' | 'projects';

const sectionConfig = [
  { id: 'personal' as Section, label: 'Personal', icon: User },
  { id: 'summary' as Section, label: 'Summary', icon: FileText },
  { id: 'experience' as Section, label: 'Experience', icon: Briefcase },
  { id: 'education' as Section, label: 'Education', icon: GraduationCap },
  { id: 'skills' as Section, label: 'Skills', icon: Code },
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const isMobile = useIsMobile();

  const currentPalette = colorPalettes.find(p => p.id === selectedPalette) || colorPalettes[0];

  // Section navigation for swipe
  const currentSectionIndex = sectionConfig.findIndex(s => s.id === activeSection);

  // Validation functions
  const validateSection = (section: Section): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    switch (section) {
      case 'personal':
        if (!cvData.personalInfo.firstName.trim()) {
          errors.push('First Name is required');
        }
        if (!cvData.personalInfo.lastName.trim()) {
          errors.push('Last Name is required');
        }
        break;
      case 'summary':
        // Summary is optional
        break;
      case 'experience':
        cvData.experience.forEach((exp, index) => {
          if (!exp.company.trim()) errors.push(`Experience ${index + 1}: Company is required`);
          if (!exp.position.trim()) errors.push(`Experience ${index + 1}: Position is required`);
          if (!exp.startDate) errors.push(`Experience ${index + 1}: Start Date is required`);
        });
        break;
      case 'education':
        cvData.education.forEach((edu, index) => {
          if (!edu.institution.trim()) errors.push(`Education ${index + 1}: Institution is required`);
          if (!edu.position.trim()) errors.push(`Education ${index + 1}: Position/Degree is required`);
          if (!edu.startDate) errors.push(`Education ${index + 1}: Start Date is required`);
        });
        break;
      case 'skills':
        cvData.skills.forEach((skill, index) => {
          if (!skill.key.trim()) errors.push(`Skill ${index + 1}: Category is required`);
          if (!skill.value.trim()) errors.push(`Skill ${index + 1}: Skills are required`);
        });
        break;
      case 'certifications':
        cvData.certifications.forEach((cert, index) => {
          if (!cert.name.trim()) errors.push(`Certification ${index + 1}: Name is required`);
          if (!cert.issuer.trim()) errors.push(`Certification ${index + 1}: Issuer is required`);
        });
        break;
      case 'projects':
        cvData.projects.forEach((proj, index) => {
          if (!proj.title.trim()) errors.push(`Project ${index + 1}: Title is required`);
        });
        break;
    }

    return { valid: errors.length === 0, errors };
  };

  const goToNextSection = useCallback(() => {
    const validation = validateSection(activeSection);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      toast.error('Please fix the errors before continuing', {
        description: validation.errors[0],
      });
      return;
    }
    setValidationErrors([]);
    
    if (currentSectionIndex < sectionConfig.length - 1) {
      setActiveSection(sectionConfig[currentSectionIndex + 1].id);
      setShowPreview(false);
    }
  }, [currentSectionIndex, activeSection, cvData]);

  const goToPrevSection = useCallback(() => {
    setValidationErrors([]);
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

  const updatePersonalInfo = (field: keyof CVData['personalInfo'], value: string | ContactItem[]) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
    setValidationErrors([]);
  };

  const updateSummary = (value: string) => {
    setCvData(prev => ({ ...prev, summary: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updatePersonalInfo('photo', '');
  };

  const addContactItem = () => {
    const newItem: ContactItem = {
      id: Date.now().toString(),
      key: '',
      value: ''
    };
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        contactItems: [...prev.personalInfo.contactItems, newItem]
      }
    }));
  };

  const updateContactItem = (id: string, field: 'key' | 'value', value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        contactItems: prev.personalInfo.contactItems.map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const removeContactItem = (id: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        contactItems: prev.personalInfo.contactItems.filter(item => item.id !== id)
      }
    }));
  };

  // Experience functions
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
        highlights: []
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
    setValidationErrors([]);
  };

  const removeExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  // Education functions (same structure as experience)
  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now().toString(),
        institution: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
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
    setValidationErrors([]);
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Skills functions (key-value like contact items)
  const addSkill = () => {
    const newSkill: SkillItem = {
      id: Date.now().toString(),
      key: '',
      value: ''
    };
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, field: 'key' | 'value', value: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
    setValidationErrors([]);
  };

  const removeSkill = (id: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  // Certifications functions
  const addCertification = () => {
    setCvData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        id: Date.now().toString(),
        name: '',
        issuer: '',
        date: '',
        url: ''
      }]
    }));
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
    setValidationErrors([]);
  };

  const removeCertification = (id: string) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  // Projects functions
  const addProject = () => {
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now().toString(),
        title: '',
        subTitle: '',
        description: '',
        technologies: '',
        position: '',
        responsibilities: '',
        demo: '',
        source: ''
      }]
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
    setValidationErrors([]);
  };

  const removeProject = (id: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const handleAIUpdate = (updatedData: Partial<CVData>) => {
    setCvData(prev => ({ ...prev, ...updatedData }));
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const data = cvData;
    let y = 20;

    const fullName = `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.trim();

    doc.setFontSize(22);
    doc.setTextColor(currentPalette.primary);
    doc.text(fullName || 'Your Name', 105, y, { align: 'center' });
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(data.personalInfo.title || '', 105, y, { align: 'center' });
    y += 8;

    doc.setFontSize(9);
    const contact = data.personalInfo.contactItems.map(item => `${item.key}: ${item.value}`).join(' | ');
    if (contact) {
      doc.text(contact, 105, y, { align: 'center' });
      y += 15;
    } else {
      y += 5;
    }

    if (data.summary) {
      doc.setFontSize(11);
      doc.setTextColor(currentPalette.primary);
      doc.text('PROFESSIONAL SUMMARY', 20, y);
      y += 6;
      doc.setFontSize(9);
      doc.setTextColor(60);
      const plainSummary = data.summary.replace(/<[^>]*>/g, '');
      const summaryLines = doc.splitTextToSize(plainSummary, 170);
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

    doc.save(`${fullName || 'CV'}_Resume.pdf`);
  };

  // Navigation buttons component
  const NavigationButtons = () => (
    <div className="flex justify-between items-center pt-6 border-t border-border/50 mt-6">
      <Button
        variant="outline"
        onClick={goToPrevSection}
        disabled={currentSectionIndex === 0}
        className="gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Button>
      <div className="text-sm text-muted-foreground">
        Step {currentSectionIndex + 1} of {sectionConfig.length}
      </div>
      <Button
        onClick={goToNextSection}
        disabled={currentSectionIndex === sectionConfig.length - 1}
        className="gap-2"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );

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
                        <CardContent className="space-y-6">
                          {/* Photo Upload */}
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {cvData.personalInfo.photo ? (
                                <>
                                  <img 
                                    src={cvData.personalInfo.photo} 
                                    alt="Profile" 
                                    className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                                  />
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full"
                                    onClick={removePhoto}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </>
                              ) : (
                                <label className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center border-2 border-dashed border-border cursor-pointer hover:border-primary hover:bg-muted/80 transition-colors">
                                  <ImagePlus className="w-6 h-6 text-muted-foreground" />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoUpload}
                                  />
                                </label>
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Photo (Optional)</Label>
                              <p className="text-xs text-muted-foreground">Click the circle to upload a photo from your device</p>
                              {cvData.personalInfo.photo && (
                                <label className="cursor-pointer">
                                  <span className="text-xs text-primary hover:underline">Change photo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoUpload}
                                  />
                                </label>
                              )}
                            </div>
                          </div>

                          {/* First Name & Last Name */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                First Name <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="firstName"
                                value={cvData.personalInfo.firstName}
                                onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                                placeholder="John"
                                className={cn("bg-background/50", validationErrors.some(e => e.includes('First Name')) && "border-destructive")}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Last Name <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="lastName"
                                value={cvData.personalInfo.lastName}
                                onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                                placeholder="Anderson"
                                className={cn("bg-background/50", validationErrors.some(e => e.includes('Last Name')) && "border-destructive")}
                                required
                              />
                            </div>
                          </div>

                          {/* Title & Subtitle */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="title" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title</Label>
                              <Input
                                id="title"
                                value={cvData.personalInfo.title}
                                onChange={(e) => updatePersonalInfo('title', e.target.value)}
                                placeholder="Senior Software Engineer"
                                className="bg-background/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subtitle" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Subtitle</Label>
                              <Input
                                id="subtitle"
                                value={cvData.personalInfo.subtitle}
                                onChange={(e) => updatePersonalInfo('subtitle', e.target.value)}
                                placeholder="Building scalable web applications"
                                className="bg-background/50"
                              />
                            </div>
                          </div>

                          {/* Contact Items - Dynamic Key-Value List */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact Information</Label>
                              <Button size="sm" variant="outline" onClick={addContactItem} className="gap-1 h-7 text-xs">
                                <Plus className="w-3 h-3" />
                                Add Item
                              </Button>
                            </div>
                            
                            {cvData.personalInfo.contactItems.length === 0 ? (
                              <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
                                <p className="text-sm">No contact items added yet</p>
                                <p className="text-xs mt-1">Click "Add Item" to add email, phone, location, etc.</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {cvData.personalInfo.contactItems.map((item, index) => (
                                  <motion.div 
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border border-border/50"
                                  >
                                    <Input
                                      value={item.key}
                                      onChange={(e) => updateContactItem(item.id, 'key', e.target.value)}
                                      placeholder="Label (e.g. Email)"
                                      className="bg-background/50 w-1/3"
                                    />
                                    <Input
                                      value={item.value}
                                      onChange={(e) => updateContactItem(item.id, 'value', e.target.value)}
                                      placeholder="Value (e.g. john@example.com)"
                                      className="bg-background/50 flex-1"
                                    />
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 flex-shrink-0" 
                                      onClick={() => removeContactItem(item.id)}
                                    >
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>

                          <NavigationButtons />
                        </CardContent>
                      </Card>
                    )}

                    {/* Summary Section */}
                    {activeSection === 'summary' && (
                      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-primary" />
                            </div>
                            Professional Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <SummaryEditor 
                            value={cvData.summary} 
                            onChange={updateSummary}
                          />
                          <NavigationButtons />
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
                                  <Label className="text-xs text-muted-foreground">Company <span className="text-destructive">*</span></Label>
                                  <Input
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                    placeholder="Company Name"
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Position <span className="text-destructive">*</span></Label>
                                  <Input
                                    value={exp.position}
                                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                    placeholder="Job Title"
                                    className="bg-background/50"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Location</Label>
                                <Input
                                  value={exp.location}
                                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                  placeholder="City, Country"
                                  className="bg-background/50"
                                />
                              </div>
                              <div className="grid sm:grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Start Date <span className="text-destructive">*</span></Label>
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
                          <NavigationButtons />
                        </CardContent>
                      </Card>
                    )}

                    {/* Education Section - Same structure as Experience */}
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
                                  <Label className="text-xs text-muted-foreground">Institution <span className="text-destructive">*</span></Label>
                                  <Input
                                    value={edu.institution}
                                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                    placeholder="University/School Name"
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Position/Degree <span className="text-destructive">*</span></Label>
                                  <Input
                                    value={edu.position}
                                    onChange={(e) => updateEducation(edu.id, 'position', e.target.value)}
                                    placeholder="Bachelor of Science - Computer Science"
                                    className="bg-background/50"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Location</Label>
                                <Input
                                  value={edu.location}
                                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                  placeholder="City, Country"
                                  className="bg-background/50"
                                />
                              </div>
                              <div className="grid sm:grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Start Date <span className="text-destructive">*</span></Label>
                                  <Input
                                    type="month"
                                    value={edu.startDate}
                                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">End Date</Label>
                                  <Input
                                    type="month"
                                    value={edu.endDate}
                                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                    disabled={edu.current}
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="flex items-center gap-2 pt-5">
                                  <Switch
                                    checked={edu.current}
                                    onCheckedChange={(checked) => updateEducation(edu.id, 'current', checked)}
                                  />
                                  <Label className="text-xs">Current</Label>
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Description</Label>
                                <Textarea
                                  value={edu.description}
                                  onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                                  placeholder="Describe your studies, achievements..."
                                  rows={3}
                                  className="bg-background/50 resize-none"
                                />
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
                          <NavigationButtons />
                        </CardContent>
                      </Card>
                    )}

                    {/* Skills Section - Key-Value like Contact Items */}
                    {activeSection === 'skills' && (
                      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Code className="w-4 h-4 text-primary" />
                            </div>
                            Skills
                          </CardTitle>
                          <Button size="sm" onClick={addSkill} className="gap-1">
                            <Plus className="w-4 h-4" />
                            Add
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {cvData.skills.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                              <Code className="w-10 h-10 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">No skills added yet</p>
                              <p className="text-xs mt-1">Click "Add" to get started</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {cvData.skills.map((skill) => (
                                <motion.div 
                                  key={skill.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50"
                                >
                                  <Input
                                    value={skill.key}
                                    onChange={(e) => updateSkill(skill.id, 'key', e.target.value)}
                                    placeholder="Category (e.g. Frontend)"
                                    className="bg-background/50 w-1/3"
                                  />
                                  <Input
                                    value={skill.value}
                                    onChange={(e) => updateSkill(skill.id, 'value', e.target.value)}
                                    placeholder="Skills (e.g. React, TypeScript, Tailwind)"
                                    className="bg-background/50 flex-1"
                                  />
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 flex-shrink-0" 
                                    onClick={() => removeSkill(skill.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </motion.div>
                              ))}
                            </div>
                          )}
                          <NavigationButtons />
                        </CardContent>
                      </Card>
                    )}

                    {/* Certifications Section */}
                    {activeSection === 'certifications' && (
                      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Award className="w-4 h-4 text-primary" />
                            </div>
                            Certifications
                          </CardTitle>
                          <Button size="sm" onClick={addCertification} className="gap-1">
                            <Plus className="w-4 h-4" />
                            Add
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {cvData.certifications.map((cert, index) => (
                            <motion.div 
                              key={cert.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-muted/30 rounded-xl space-y-4 border border-border/50"
                            >
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                  Certification {index + 1}
                                </span>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeCertification(cert.id)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Name <span className="text-destructive">*</span></Label>
                                  <Input
                                    value={cert.name}
                                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                    placeholder="Certification Name"
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Issuer <span className="text-destructive">*</span></Label>
                                  <Input
                                    value={cert.issuer}
                                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                    placeholder="Issuing Organization"
                                    className="bg-background/50"
                                  />
                                </div>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Date</Label>
                                  <Input
                                    type="month"
                                    value={cert.date}
                                    onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">URL</Label>
                                  <Input
                                    value={cert.url || ''}
                                    onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                                    placeholder="https://..."
                                    className="bg-background/50"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {cvData.certifications.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                              <Award className="w-10 h-10 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">No certifications added yet</p>
                              <p className="text-xs mt-1">Click "Add" to get started</p>
                            </div>
                          )}
                          <NavigationButtons />
                        </CardContent>
                      </Card>
                    )}

                    {/* Projects Section */}
                    {activeSection === 'projects' && (
                      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FolderGit2 className="w-4 h-4 text-primary" />
                            </div>
                            Projects
                          </CardTitle>
                          <Button size="sm" onClick={addProject} className="gap-1">
                            <Plus className="w-4 h-4" />
                            Add
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {cvData.projects.map((proj, index) => (
                            <motion.div 
                              key={proj.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-muted/30 rounded-xl space-y-4 border border-border/50"
                            >
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                  Project {index + 1}
                                </span>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeProject(proj.id)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Title <span className="text-destructive">*</span></Label>
                                  <Input
                                    value={proj.title}
                                    onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                                    placeholder="Project Title"
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Subtitle</Label>
                                  <Input
                                    value={proj.subTitle}
                                    onChange={(e) => updateProject(proj.id, 'subTitle', e.target.value)}
                                    placeholder="Brief tagline"
                                    className="bg-background/50"
                                  />
                                </div>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Technologies</Label>
                                  <Input
                                    value={proj.technologies}
                                    onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                                    placeholder="React, Node.js, PostgreSQL..."
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Position</Label>
                                  <Input
                                    value={proj.position}
                                    onChange={(e) => updateProject(proj.id, 'position', e.target.value)}
                                    placeholder="Lead Developer"
                                    className="bg-background/50"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Description</Label>
                                <SummaryEditor 
                                  value={proj.description} 
                                  onChange={(value) => updateProject(proj.id, 'description', value)}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Responsibilities</Label>
                                <Textarea
                                  value={proj.responsibilities}
                                  onChange={(e) => updateProject(proj.id, 'responsibilities', e.target.value)}
                                  placeholder="What were your responsibilities in this project?"
                                  rows={3}
                                  className="bg-background/50 resize-none"
                                />
                              </div>
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Demo URL</Label>
                                  <Input
                                    value={proj.demo || ''}
                                    onChange={(e) => updateProject(proj.id, 'demo', e.target.value)}
                                    placeholder="https://demo.example.com"
                                    className="bg-background/50"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Source Code</Label>
                                  <Input
                                    value={proj.source || ''}
                                    onChange={(e) => updateProject(proj.id, 'source', e.target.value)}
                                    placeholder="github.com/user/repo"
                                    className="bg-background/50"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {cvData.projects.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                              <FolderGit2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">No projects added yet</p>
                              <p className="text-xs mt-1">Click "Add" to get started</p>
                            </div>
                          )}
                          <NavigationButtons />
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
