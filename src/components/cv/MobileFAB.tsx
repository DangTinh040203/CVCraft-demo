import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Download, Settings2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/hooks/use-swipe';

interface MobileFABProps {
  onExportPDF: () => void;
  onTogglePreview: () => void;
  onOpenCustomize: () => void;
  onOpenAI: () => void;
  showPreview: boolean;
}

const MobileFAB = ({ 
  onExportPDF, 
  onTogglePreview, 
  onOpenCustomize, 
  onOpenAI,
  showPreview 
}: MobileFABProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { 
      icon: Download, 
      label: 'Export PDF', 
      onClick: () => { triggerHaptic(10); onExportPDF(); setIsOpen(false); },
      color: 'bg-green-500 hover:bg-green-600'
    },
    { 
      icon: showPreview ? EyeOff : Eye, 
      label: showPreview ? 'Edit Mode' : 'Preview', 
      onClick: () => { triggerHaptic(10); onTogglePreview(); setIsOpen(false); },
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      icon: Settings2, 
      label: 'Customize', 
      onClick: () => { triggerHaptic(10); onOpenCustomize(); setIsOpen(false); },
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    { 
      icon: Sparkles, 
      label: 'AI Assistant', 
      onClick: () => { triggerHaptic(10); onOpenAI(); setIsOpen(false); },
      color: 'bg-amber-500 hover:bg-amber-600'
    },
  ];

  return (
    <div className="fixed bottom-6 right-4 z-50 lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Action buttons */}
            <div className="absolute bottom-16 right-0 flex flex-col-reverse gap-3">
              {actions.map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.3, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.3, y: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={action.onClick}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-full shadow-lg text-white transition-colors',
                    action.color
                  )}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          triggerHaptic(15);
          setIsOpen(!isOpen);
        }}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300',
          isOpen 
            ? 'bg-muted text-muted-foreground rotate-45' 
            : 'bg-primary text-primary-foreground'
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default MobileFAB;
