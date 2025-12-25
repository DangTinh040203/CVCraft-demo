import { Link } from 'react-router-dom';
import { 
  ArrowRight, FileText, Sparkles, MessageSquare, Users, CheckCircle2,
  Upload, Wand2, Download, Star, Quote, ChevronRight, Zap, Shield, Clock,
  Target, Award, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

  const howItWorks = [
    {
      step: '01',
      icon: Upload,
      title: 'Upload Your Info',
      description: 'Start fresh or import your existing CV. Add your experience, education, and skills.',
    },
    {
      step: '02',
      icon: Wand2,
      title: 'AI Enhancement',
      description: 'Let AI optimize your content for the job you want. Paste a job description for tailored suggestions.',
    },
    {
      step: '03',
      icon: Download,
      title: 'Download & Apply',
      description: 'Export your polished CV in PDF or Word format. Ready to land your dream job!',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      image: 'SC',
      content: 'CVCraft helped me land my dream job at Google. The AI suggestions made my resume stand out from hundreds of applicants.',
      rating: 5,
    },
    {
      name: 'Michael Roberts',
      role: 'Product Manager at Meta',
      image: 'MR',
      content: 'The mock interview feature was a game-changer. I felt so prepared walking into my final round interviews.',
      rating: 5,
    },
    {
      name: 'Emily Watson',
      role: 'Marketing Director',
      image: 'EW',
      content: 'I tried many CV builders, but CVCraft\'s templates and AI writing are simply the best. Highly recommend!',
      rating: 5,
    },
  ];

  const whyChooseUs = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Create a professional CV in under 10 minutes with our intuitive builder.',
    },
    {
      icon: Shield,
      title: 'ATS-Friendly',
      description: 'All templates are optimized to pass Applicant Tracking Systems.',
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'AI writes compelling content so you can focus on what matters.',
    },
    {
      icon: Target,
      title: 'Job-Targeted',
      description: 'Tailor your CV to specific job descriptions for higher success rates.',
    },
    {
      icon: Award,
      title: 'Expert Approved',
      description: 'Templates designed by hiring managers and career coaches.',
    },
    {
      icon: TrendingUp,
      title: 'Proven Results',
      description: '95% of users report getting more interview callbacks.',
    },
  ];

  const faqs = [
    {
      question: 'Is CVCraft really free to use?',
      answer: 'Yes! You can create and download your CV for free. We offer premium templates and advanced AI features for users who want extra polish.',
    },
    {
      question: 'How does the AI CV writing work?',
      answer: 'Our AI analyzes your experience and the job description you\'re targeting. It then suggests impactful bullet points, optimizes keywords, and ensures your CV is tailored for the role.',
    },
    {
      question: 'Are the templates ATS-friendly?',
      answer: 'Absolutely. All our templates are designed to pass Applicant Tracking Systems while still looking professional and modern.',
    },
    {
      question: 'Can I edit my CV after downloading?',
      answer: 'Yes! Your CVs are saved to your account. You can come back anytime to make edits and download updated versions.',
    },
    {
      question: 'How does the mock interview feature work?',
      answer: 'Our AI interviewer asks you common questions for your target role. You can practice answering verbally, and the AI provides feedback on your responses.',
    },
  ];

  const templateCategories = [
    { name: 'Professional', count: 4, color: 'bg-primary/10 text-primary' },
    { name: 'Modern', count: 2, color: 'bg-accent/10 text-accent' },
    { name: 'Creative', count: 2, color: 'bg-destructive/10 text-destructive' },
    { name: 'Minimal', count: 2, color: 'bg-muted text-muted-foreground' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 bg-background overflow-hidden relative min-h-[85vh] flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-[10%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-20 left-[5%] w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-float" />
          <div className="absolute top-1/2 right-[20%] w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <div className="relative">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">AI-Powered CV Builder</span>
            </div>
            
            {/* Main headline */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] animate-slide-up tracking-tight text-foreground">
              Discover, connect,
              <br />
              <span className="gradient-text">grow.</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto animate-slide-up stagger-1 leading-relaxed">
              Welcome to CVCraft, the largest professional CV building platform. Create stunning resumes in minutes.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up stagger-2">
              <Link to="/builder">
                <Button size="lg" className="w-full sm:w-auto group rounded-full px-6">
                  Build your profile
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-6">
                  Templates
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-slide-up stagger-3">
              {[
                { icon: '👤', label: 'Professionals', color: 'bg-green-500' },
                { icon: '🔗', label: 'Connections', color: 'bg-yellow-500' },
                { icon: '📋', label: 'Job listings', color: 'bg-blue-500' },
                { icon: '📄', label: 'Applications', color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.label} className="bg-card rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 px-4 border-b border-border bg-muted/30">
        <div className="container mx-auto">
          <p className="text-center text-muted-foreground text-sm mb-6">Trusted by professionals from leading companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix'].map((company) => (
              <span key={company} className="font-display font-bold text-xl text-muted-foreground">
                {company}
              </span>
            ))}
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

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create your perfect CV in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-20" />
            
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-bg mb-6 shadow-lg relative z-10">
                  <item.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <span className="absolute -top-2 -right-2 md:right-1/4 text-6xl font-display font-bold text-muted/50">
                  {item.step}
                </span>
                <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Preview Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Choose from <span className="gradient-text">10+ Professional Templates</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Our templates are designed by hiring managers and career coaches to help you make the best first impression.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {templateCategories.map((cat) => (
                  <span key={cat.name} className={`px-4 py-2 rounded-full text-sm font-medium ${cat.color}`}>
                    {cat.name} ({cat.count})
                  </span>
                ))}
              </div>

              <Link to="/templates">
                <Button variant="gradient" size="lg" className="group">
                  Browse All Templates
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className={`bg-card rounded-xl shadow-lg border border-border/50 p-4 ${i === 1 ? 'col-span-2' : ''}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20" />
                        <div className="flex-1">
                          <div className="h-2 bg-foreground/20 rounded w-3/4" />
                          <div className="h-1.5 bg-muted-foreground/20 rounded w-1/2 mt-1" />
                        </div>
                      </div>
                      <div className="space-y-1 pt-2 border-t border-border/50">
                        <div className="h-1.5 bg-muted rounded w-full" />
                        <div className="h-1.5 bg-muted rounded w-5/6" />
                        <div className="h-1.5 bg-muted rounded w-4/6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 gradient-bg rounded-2xl -z-10 opacity-20 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">CVCraft</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're not just another CV builder. Here's what makes us different.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
              <Card key={item.title} className="border-border/50 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
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

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See what our users have to say about their experience with CVCraft
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground mb-6">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-semibold">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Got questions? We've got answers.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold">CVCraft</span>
              </Link>
              <p className="text-muted-foreground text-sm">
                Build your dream career with AI-powered CV creation and interview preparation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/templates" className="hover:text-primary transition-colors">Templates</Link></li>
                <li><Link to="/builder" className="hover:text-primary transition-colors">CV Builder</Link></li>
                <li><Link to="/interview" className="hover:text-primary transition-colors">Mock Interview</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Career Tips</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 CVCraft. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
