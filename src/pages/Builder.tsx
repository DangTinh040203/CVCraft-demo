import { useState } from 'react';
import { 
  User, Briefcase, GraduationCap, Code, Languages, Award, FolderGit2,
  Plus, Trash2, ChevronDown, ChevronUp, Save, Download, Eye, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import Navbar from '@/components/Navbar';
import CVPreview from '@/components/CVPreview';
import AIChat from '@/components/AIChat';
import { CVData, sampleCVData, defaultCVData } from '@/types/cv';
import { cn } from '@/lib/utils';

type Section = 'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'certifications' | 'projects';

const sectionConfig = [
  { id: 'personal' as Section, label: 'Personal Info', icon: User },
  { id: 'experience' as Section, label: 'Experience', icon: Briefcase },
  { id: 'education' as Section, label: 'Education', icon: GraduationCap },
  { id: 'skills' as Section, label: 'Skills', icon: Code },
  { id: 'languages' as Section, label: 'Languages', icon: Languages },
  { id: 'certifications' as Section, label: 'Certifications', icon: Award },
  { id: 'projects' as Section, label: 'Projects', icon: FolderGit2 },
];

const Builder = () => {
  const [cvData, setCvData] = useState<CVData>(sampleCVData);
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">CV Builder</h1>
              <p className="text-muted-foreground">Build your professional CV step by step</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAIChat(!showAIChat)}
                className={cn(showAIChat && 'bg-primary/10 border-primary')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button variant="gradient">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-2">
              <Card className="sticky top-24">
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    {sectionConfig.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          activeSection === section.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted'
                        )}
                      >
                        <section.icon className="w-4 h-4" />
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className={cn('lg:col-span-5', showAIChat && 'lg:col-span-5')}>
              {showPreview ? (
                <CVPreview data={cvData} />
              ) : (
                <div className="space-y-6">
                  {/* Personal Info Section */}
                  {activeSection === 'personal' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              value={cvData.personalInfo.fullName}
                              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                              placeholder="John Anderson"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input
                              id="title"
                              value={cvData.personalInfo.title}
                              onChange={(e) => updatePersonalInfo('title', e.target.value)}
                              placeholder="Senior Software Engineer"
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={cvData.personalInfo.email}
                              onChange={(e) => updatePersonalInfo('email', e.target.value)}
                              placeholder="john@example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={cvData.personalInfo.phone}
                              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={cvData.personalInfo.location}
                              onChange={(e) => updatePersonalInfo('location', e.target.value)}
                              placeholder="San Francisco, CA"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn (optional)</Label>
                            <Input
                              id="linkedin"
                              value={cvData.personalInfo.linkedin || ''}
                              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                              placeholder="linkedin.com/in/username"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="summary">Professional Summary</Label>
                          <Textarea
                            id="summary"
                            value={cvData.personalInfo.summary}
                            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                            placeholder="Write a brief summary of your professional background..."
                            rows={4}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Experience Section */}
                  {activeSection === 'experience' && (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5" />
                          Work Experience
                        </CardTitle>
                        <Button size="sm" onClick={addExperience}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {cvData.experience.map((exp, index) => (
                          <div key={exp.id} className="p-4 border border-border rounded-lg space-y-4">
                            <div className="flex justify-between items-start">
                              <span className="text-sm font-medium text-muted-foreground">Position {index + 1}</span>
                              <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Company</Label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                  placeholder="Company Name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Position</Label>
                                <Input
                                  value={exp.position}
                                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                  placeholder="Job Title"
                                />
                              </div>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                  type="month"
                                  value={exp.endDate}
                                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                  disabled={exp.current}
                                />
                              </div>
                              <div className="flex items-center gap-2 pt-6">
                                <Switch
                                  checked={exp.current}
                                  onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked)}
                                />
                                <Label>Current</Label>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                placeholder="Describe your responsibilities..."
                                rows={3}
                              />
                            </div>
                          </div>
                        ))}
                        {cvData.experience.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            No experience added yet. Click "Add" to get started.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Education Section */}
                  {activeSection === 'education' && (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5" />
                          Education
                        </CardTitle>
                        <Button size="sm" onClick={addEducation}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {cvData.education.map((edu, index) => (
                          <div key={edu.id} className="p-4 border border-border rounded-lg space-y-4">
                            <div className="flex justify-between items-start">
                              <span className="text-sm font-medium text-muted-foreground">Education {index + 1}</span>
                              <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Institution</Label>
                                <Input
                                  value={edu.institution}
                                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                  placeholder="University Name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Degree</Label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                  placeholder="Bachelor of Science"
                                />
                              </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Field of Study</Label>
                                <Input
                                  value={edu.field}
                                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                  placeholder="Computer Science"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>GPA (optional)</Label>
                                <Input
                                  value={edu.gpa || ''}
                                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                  placeholder="3.8"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        {cvData.education.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            No education added yet. Click "Add" to get started.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Skills Section */}
                  {activeSection === 'skills' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Code className="w-5 h-5" />
                          Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-center py-8">
                          Use the AI Assistant to help you add and organize your skills based on your target job.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Other sections placeholder */}
                  {['languages', 'certifications', 'projects'].includes(activeSection) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="capitalize">{activeSection}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-center py-8">
                          This section is available. Use the AI Assistant to help populate it.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Preview Panel */}
            <div className={cn(
              'lg:col-span-5',
              showAIChat ? 'hidden lg:block lg:col-span-5' : 'lg:col-span-5'
            )}>
              <div className="sticky top-24">
                <CVPreview data={cvData} />
              </div>
            </div>

            {/* AI Chat Panel */}
            {showAIChat && (
              <div className="lg:col-span-5 fixed inset-0 z-50 lg:relative lg:z-0">
                <AIChat 
                  cvData={cvData} 
                  onUpdate={handleAIUpdate}
                  onClose={() => setShowAIChat(false)}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Builder;
