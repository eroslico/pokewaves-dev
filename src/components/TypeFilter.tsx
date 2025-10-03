import { PokemonType } from '@/types/pokemon';
import { TypeBadge } from './TypeBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const allTypes: PokemonType[] = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

interface TypeFilterProps {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  onClear: () => void;
}

export const TypeFilter = ({ selectedTypes, onTypeToggle, onClear }: TypeFilterProps) => {
  return (
    <div className="w-full glass-strong rounded-2xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
          <span className="w-1 h-4 bg-gradient-to-b from-primary to-accent rounded-full" />
          Filter by Type
        </h3>
        {selectedTypes.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8 text-xs hover-lift rounded-full"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {allTypes.map((type) => (
            <button
              key={type}
              onClick={() => onTypeToggle(type)}
              className={`transition-all duration-500 ${
                selectedTypes.includes(type)
                  ? 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'opacity-60 hover:opacity-100 hover:scale-105'
              }`}
            >
              <TypeBadge type={type} size="md" />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
