import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Sparkles, MessageSquare, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Index = () => {
  const features = [
    {
      icon: FileText,
      title: '10 Professional Templates',
      description: 'Choose from beautifully designed templates that catch recruiters\' attention.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Writing',
      description: 'Generate and refine your CV content with AI. Just paste a job description.',
    },
    {
      icon: MessageSquare,
      title: 'Mock Interviews',
      description: 'Practice with AI interviews tailored to your target role and industry.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'CVs Created' },
    { value: '10K+', label: 'Users Hired' },
    { value: '95%', label: 'Success Rate' },
  ];

  const benefits = [
    'ATS-optimized formatting',
    'Real-time preview',
    'Export to PDF & Word',
    'Job-specific tailoring',
    'Grammar & spelling check',
    'Unlimited revisions',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 gradient-hero text-primary-foreground overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">AI-Powered CV Builder</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight animate-slide-up">
              Build Your Dream Career with the{' '}
              <span className="text-accent">Perfect CV</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-slide-up stagger-1">
              Create stunning, ATS-friendly resumes in minutes. Let AI help you write compelling content tailored to any job description.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-2">
              <Link to="/builder">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  Start Building Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="glass" size="xl" className="w-full sm:w-auto">
                  Browse Templates
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 md:gap-16 mt-16 animate-slide-up stagger-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-3xl md:text-4xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Land Your Dream Job</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our comprehensive toolkit helps you create professional CVs, tailor them to job descriptions, and practice interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow duration-300">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Stand Out from the <span className="gradient-text">Competition</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Our CV builder is designed by hiring managers and career coaches to give you the best chance of getting noticed.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link to="/builder" className="inline-block mt-8">
                <Button variant="gradient" size="lg">
                  Get Started Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="bg-card rounded-2xl shadow-xl p-8 border border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl">
                      JA
                    </div>
                    <div>
                      <div className="font-display font-semibold text-lg">John Anderson</div>
                      <div className="text-muted-foreground">Senior Software Engineer</div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="h-3 bg-muted rounded-full w-full" />
                    <div className="h-3 bg-muted rounded-full w-4/5" />
                    <div className="h-3 bg-muted rounded-full w-3/5" />
                  </div>
                  <div className="space-y-2 pt-4">
                    <div className="h-2 bg-primary/20 rounded-full w-full" />
                    <div className="h-2 bg-primary/20 rounded-full w-5/6" />
                    <div className="h-2 bg-primary/20 rounded-full w-4/6" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 gradient-bg rounded-2xl -z-10 opacity-20 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="gradient-hero rounded-3xl p-12 md:p-16 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10">
              <Users className="w-16 h-16 mx-auto mb-6 text-accent" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Join 50,000+ Professionals
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Create your professional CV today and take the next step in your career journey.
              </p>
              <Link to="/builder">
                <Button variant="hero" size="xl">
                  Create Your CV Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">CVCraft</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 CVCraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
