import { motion } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export const colorPalettes: ColorPalette[] = [
  {
    id: 'classic',
    name: 'Classic Blue',
    primary: '#2563eb',
    secondary: '#3b82f6',
    accent: '#1d4ed8',
    background: '#ffffff',
    text: '#1f2937',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    primary: '#059669',
    secondary: '#10b981',
    accent: '#047857',
    background: '#ffffff',
    text: '#1f2937',
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    accent: '#6d28d9',
    background: '#ffffff',
    text: '#1f2937',
  },
  {
    id: 'coral',
    name: 'Coral',
    primary: '#f43f5e',
    secondary: '#fb7185',
    accent: '#e11d48',
    background: '#ffffff',
    text: '#1f2937',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    primary: '#6366f1',
    secondary: '#818cf8',
    accent: '#4f46e5',
    background: '#0f172a',
    text: '#f1f5f9',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    primary: '#f59e0b',
    secondary: '#fbbf24',
    accent: '#d97706',
    background: '#ffffff',
    text: '#1f2937',
  },
  {
    id: 'forest',
    name: 'Forest',
    primary: '#22c55e',
    secondary: '#4ade80',
    accent: '#16a34a',
    background: '#f0fdf4',
    text: '#14532d',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    primary: '#374151',
    secondary: '#4b5563',
    accent: '#1f2937',
    background: '#ffffff',
    text: '#111827',
  },
];

interface ColorPaletteSelectorProps {
  selectedPalette: string;
  onSelectPalette: (paletteId: string) => void;
}

const ColorPaletteSelector = ({ selectedPalette, onSelectPalette }: ColorPaletteSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Palette className="w-4 h-4" />
        Color Palette
      </div>
      <div className="grid grid-cols-4 gap-2">
        {colorPalettes.map((palette) => (
          <motion.button
            key={palette.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectPalette(palette.id)}
            className={cn(
              'relative p-1.5 rounded-lg border-2 transition-all',
              selectedPalette === palette.id
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            )}
            title={palette.name}
          >
            {selectedPalette === palette.id && (
              <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5 z-10">
                <Check className="w-2 h-2 text-primary-foreground" />
              </div>
            )}
            <div className="flex gap-0.5 h-6 rounded overflow-hidden">
              <div className="flex-1" style={{ backgroundColor: palette.primary }} />
              <div className="flex-1" style={{ backgroundColor: palette.secondary }} />
              <div className="flex-1" style={{ backgroundColor: palette.accent }} />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ColorPaletteSelector;
