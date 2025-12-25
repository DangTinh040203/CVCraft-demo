import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Check, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import { cvTemplates } from '@/data/templates';
import { CVTemplate } from '@/types/cv';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'All Templates' },
  { id: 'professional', label: 'Professional' },
  { id: 'modern', label: 'Modern' },
  { id: 'creative', label: 'Creative' },
  { id: 'minimal', label: 'Minimal' },
];

const TemplateCard = ({ template }: { template: CVTemplate }) => {
  const categoryColors: Record<string, string> = {
    professional: 'bg-primary/10 text-primary',
    modern: 'bg-accent/10 text-accent',
    creative: 'bg-destructive/10 text-destructive',
    minimal: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail Preview */}
      <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
        <div className="absolute inset-4 bg-card rounded-lg shadow-sm p-4">
          {/* Mini CV Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20" />
              <div className="space-y-1 flex-1">
                <div className="h-2 bg-foreground/20 rounded w-3/4" />
                <div className="h-1.5 bg-muted-foreground/20 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-border/50">
              <div className="h-1.5 bg-muted rounded w-full" />
              <div className="h-1.5 bg-muted rounded w-5/6" />
              <div className="h-1.5 bg-muted rounded w-4/6" />
            </div>
            <div className="space-y-1.5 pt-2">
              <div className="h-1.5 bg-primary/20 rounded w-full" />
              <div className="h-1.5 bg-primary/20 rounded w-3/4" />
            </div>
          </div>
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link to={`/builder?template=${template.id}`}>
            <Button variant="hero" size="lg">
              Use Template
            </Button>
          </Link>
        </div>

        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium">
            <Crown className="w-3 h-3" />
            Premium
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold">{template.name}</h3>
          <span className={cn('text-xs px-2 py-0.5 rounded-full', categoryColors[template.category])}>
            {template.category}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </div>
    </div>
  );
};

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = cvTemplates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Choose Your <span className="gradient-text">Perfect Template</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse our collection of professionally designed CV templates. Each template is ATS-friendly and fully customizable.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    selectedCategory === category.id && 'gradient-bg border-0'
                  )}
                >
                  {selectedCategory === category.id && <Check className="w-4 h-4 mr-1" />}
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Templates;
