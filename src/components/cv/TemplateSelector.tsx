import { motion } from 'framer-motion';
import { Check, Crown, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cvTemplates } from '@/data/templates';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateSelector = ({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Layout className="w-4 h-4" />
        Templates
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cvTemplates.slice(0, 6).map((template) => (
          <motion.button
            key={template.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectTemplate(template.id)}
            className={cn(
              'relative p-2 rounded-lg border-2 transition-all text-left',
              selectedTemplate === template.id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50 bg-card'
            )}
          >
            {template.isPremium && (
              <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5">
                <Crown className="w-2.5 h-2.5 text-white" />
              </div>
            )}
            {selectedTemplate === template.id && (
              <div className="absolute top-1 left-1 bg-primary rounded-full p-0.5">
                <Check className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
            )}
            <div className="h-12 bg-muted rounded mb-1.5 flex items-center justify-center">
              <div className="w-8 h-10 bg-background rounded shadow-sm border border-border" />
            </div>
            <p className="text-xs font-medium text-foreground truncate">{template.name}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
