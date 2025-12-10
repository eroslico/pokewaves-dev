import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface TypeFilterProps {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  onClear: () => void;
}

const POKEMON_TYPES = [
  { name: 'normal', color: 'hsl(var(--type-normal))' },
  { name: 'fire', color: 'hsl(var(--type-fire))' },
  { name: 'water', color: 'hsl(var(--type-water))' },
  { name: 'electric', color: 'hsl(var(--type-electric))' },
  { name: 'grass', color: 'hsl(var(--type-grass))' },
  { name: 'ice', color: 'hsl(var(--type-ice))' },
  { name: 'fighting', color: 'hsl(var(--type-fighting))' },
  { name: 'poison', color: 'hsl(var(--type-poison))' },
  { name: 'ground', color: 'hsl(var(--type-ground))' },
  { name: 'flying', color: 'hsl(var(--type-flying))' },
  { name: 'psychic', color: 'hsl(var(--type-psychic))' },
  { name: 'bug', color: 'hsl(var(--type-bug))' },
  { name: 'rock', color: 'hsl(var(--type-rock))' },
  { name: 'ghost', color: 'hsl(var(--type-ghost))' },
  { name: 'dragon', color: 'hsl(var(--type-dragon))' },
  { name: 'dark', color: 'hsl(var(--type-dark))' },
  { name: 'steel', color: 'hsl(var(--type-steel))' },
  { name: 'fairy', color: 'hsl(var(--type-fairy))' },
];

export const TypeFilter = ({ selectedTypes, onTypeToggle, onClear }: TypeFilterProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="glass-strong rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Type Filter</h3>
            {selectedTypes.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedTypes.length}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedTypes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="h-7 text-xs hover:text-destructive"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  isOpen && "rotate-180"
                )} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="space-y-0">
          <div className="flex flex-wrap gap-2">
            {POKEMON_TYPES.map((type) => {
              const isSelected = selectedTypes.includes(type.name);
              return (
                <Badge
                  key={type.name}
                  variant={isSelected ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all duration-300 hover:scale-105 capitalize',
                    isSelected && 'shadow-md ring-2 ring-primary/50'
                  )}
                  style={
                    isSelected
                      ? {
                          backgroundColor: type.color,
                          borderColor: type.color,
                          color: 'white',
                        }
                      : {
                          borderColor: type.color,
                          color: type.color,
                        }
                  }
                  onClick={() => onTypeToggle(type.name)}
                >
                  {type.name}
                </Badge>
              );
            })}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
