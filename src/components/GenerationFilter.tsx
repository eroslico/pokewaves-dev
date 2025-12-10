import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerationFilterProps {
  selectedGeneration: number | null;
  onGenerationSelect: (gen: number | null) => void;
}

const GENERATIONS = [
  { number: 1, name: 'Kanto', range: '1-151' },
  { number: 2, name: 'Johto', range: '152-251' },
  { number: 3, name: 'Hoenn', range: '252-386' },
  { number: 4, name: 'Sinnoh', range: '387-493' },
  { number: 5, name: 'Unova', range: '494-649' },
  { number: 6, name: 'Kalos', range: '650-721' },
  { number: 7, name: 'Alola', range: '722-809' },
  { number: 8, name: 'Galar', range: '810-905' },
  { number: 9, name: 'Paldea', range: '906-1010' },
];

export const GenerationFilter = ({ selectedGeneration, onGenerationSelect }: GenerationFilterProps) => {
  return (
    <div className="glass-strong rounded-2xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Generation</h3>
        </div>
        {selectedGeneration && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGenerationSelect(null)}
            className="h-7 text-xs hover:text-destructive"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {GENERATIONS.map((gen) => (
          <Badge
            key={gen.number}
            variant={selectedGeneration === gen.number ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-all duration-300 hover:scale-105',
              selectedGeneration === gen.number && 'shadow-md'
            )}
            onClick={() => onGenerationSelect(gen.number === selectedGeneration ? null : gen.number)}
          >
            <span className="font-bold">Gen {gen.number}</span>
            <span className="ml-1 text-xs opacity-70">{gen.name}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export const getGenerationRange = (generation: number): { min: number; max: number } => {
  const ranges: Record<number, { min: number; max: number }> = {
    1: { min: 1, max: 151 },
    2: { min: 152, max: 251 },
    3: { min: 252, max: 386 },
    4: { min: 387, max: 493 },
    5: { min: 494, max: 649 },
    6: { min: 650, max: 721 },
    7: { min: 722, max: 809 },
    8: { min: 810, max: 905 },
    9: { min: 906, max: 1010 },
  };
  return ranges[generation] || { min: 1, max: 1010 };
};
