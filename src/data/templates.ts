import { CVTemplate } from '@/types/cv';

export const cvTemplates: CVTemplate[] = [
  {
    id: 'professional-classic',
    name: 'Professional Classic',
    description: 'Traditional layout perfect for corporate roles',
    thumbnail: '/templates/professional-classic.png',
    category: 'professional',
    isPremium: false,
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean and contemporary with ample white space',
    thumbnail: '/templates/modern-minimal.png',
    category: 'minimal',
    isPremium: false,
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Stand out with vibrant colors and unique layout',
    thumbnail: '/templates/creative-bold.png',
    category: 'creative',
    isPremium: false,
  },
  {
    id: 'executive-elegant',
    name: 'Executive Elegant',
    description: 'Sophisticated design for senior positions',
    thumbnail: '/templates/executive-elegant.png',
    category: 'professional',
    isPremium: true,
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    description: 'Perfect for tech professionals and developers',
    thumbnail: '/templates/tech-modern.png',
    category: 'modern',
    isPremium: false,
  },
  {
    id: 'designer-portfolio',
    name: 'Designer Portfolio',
    description: 'Showcase your creative work beautifully',
    thumbnail: '/templates/designer-portfolio.png',
    category: 'creative',
    isPremium: true,
  },
  {
    id: 'academic-formal',
    name: 'Academic Formal',
    description: 'Ideal for academic and research positions',
    thumbnail: '/templates/academic-formal.png',
    category: 'professional',
    isPremium: false,
  },
  {
    id: 'startup-fresh',
    name: 'Startup Fresh',
    description: 'Dynamic layout for startup culture',
    thumbnail: '/templates/startup-fresh.png',
    category: 'modern',
    isPremium: false,
  },
  {
    id: 'minimalist-zen',
    name: 'Minimalist Zen',
    description: 'Ultra-clean with focus on content',
    thumbnail: '/templates/minimalist-zen.png',
    category: 'minimal',
    isPremium: true,
  },
  {
    id: 'corporate-pro',
    name: 'Corporate Pro',
    description: 'Trusted format for Fortune 500 applications',
    thumbnail: '/templates/corporate-pro.png',
    category: 'professional',
    isPremium: false,
  },
];

export const getTemplateById = (id: string): CVTemplate | undefined => {
  return cvTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: CVTemplate['category']): CVTemplate[] => {
  return cvTemplates.filter(template => template.category === category);
};
