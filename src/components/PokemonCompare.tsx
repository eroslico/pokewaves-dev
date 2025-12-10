import { Pokemon } from '@/types/pokemon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TypeBadge } from './TypeBadge';
import { formatPokemonId, formatStatName } from '@/lib/pokemon-utils';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PokemonCompareProps {
  pokemon: Pokemon[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: number) => void;
}

export const PokemonCompare = ({ pokemon, isOpen, onClose, onRemove }: PokemonCompareProps) => {
  if (pokemon.length === 0) return null;

  const statNames = pokemon[0]?.stats.map(s => s.stat.name) || [];

  const getStatComparison = (statName: string, pokemonIndex: number) => {
    const currentStat = pokemon[pokemonIndex].stats.find(s => s.stat.name === statName)?.base_stat || 0;
    const otherStats = pokemon
      .filter((_, i) => i !== pokemonIndex)
      .map(p => p.stats.find(s => s.stat.name === statName)?.base_stat || 0);
    
    const maxOther = Math.max(...otherStats);
    const minOther = Math.min(...otherStats);

    if (otherStats.length === 0) return 'neutral';
    if (currentStat > maxOther) return 'higher';
    if (currentStat < minOther) return 'lower';
    return 'neutral';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-3xl font-bold gradient-text">
            Compare Pokémon
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pokemon.map((poke, index) => (
                <div key={poke.id} className="relative glass-strong rounded-2xl p-6 animate-fade-in">
                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(poke.id)}
                    className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  {/* Pokemon Header */}
                  <div className="text-center mb-4">
                    <div className="relative w-32 h-32 mx-auto mb-3">
                      <img
                        src={poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default}
                        alt={poke.name}
                        className="w-full h-full object-contain drop-shadow-lg"
                      />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {formatPokemonId(poke.id)}
                    </span>
                    <h3 className="text-2xl font-display font-bold capitalize mb-2">
                      {poke.name}
                    </h3>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {poke.types.map((type) => (
                        <TypeBadge key={type.type.name} type={type.type.name} size="sm" />
                      ))}
                    </div>
                  </div>

                  {/* Physical Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Height</p>
                      <p className="font-bold">{(poke.height / 10).toFixed(1)} m</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Weight</p>
                      <p className="font-bold">{(poke.weight / 10).toFixed(1)} kg</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Base Stats</h4>
                    {statNames.map((statName) => {
                      const stat = poke.stats.find(s => s.stat.name === statName);
                      const comparison = getStatComparison(statName, index);
                      
                      return (
                        <div key={statName} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium capitalize">
                              {formatStatName(statName)}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">{stat?.base_stat}</span>
                              {comparison === 'higher' && (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              )}
                              {comparison === 'lower' && (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              )}
                              {comparison === 'neutral' && pokemon.length > 1 && (
                                <Minus className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${((stat?.base_stat || 0) / 255) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Total Stats */}
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">Total</span>
                        <span className="font-bold text-lg text-primary">
                          {poke.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pokemon.length < 3 && (
              <div className="mt-6 text-center p-8 glass rounded-2xl">
                <p className="text-muted-foreground">
                  You can compare up to 3 Pokémon. Click on more Pokémon cards while holding <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl</kbd> to add them to comparison.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
