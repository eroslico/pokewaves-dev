import { useQuery } from '@tanstack/react-query';
import { Pokemon } from '@/types/pokemon';
import { pokemonApi } from '@/lib/pokeapi';
import { TypeBadge } from './TypeBadge';
import { StatsChart } from './StatsChart';
import { formatPokemonId, formatStatName, getStatColor, calculateStatPercentage, typeGradients } from '@/lib/pokemon-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Ruler, Weight, Zap, BarChart3 } from 'lucide-react';

interface PokemonDetailProps {
  pokemon: Pokemon;
  isOpen: boolean;
  onClose: () => void;
}

export const PokemonDetail = ({ pokemon, isOpen, onClose }: PokemonDetailProps) => {
  const { data: species } = useQuery({
    queryKey: ['pokemon-species', pokemon.id],
    queryFn: () => pokemonApi.getPokemonSpecies(pokemon.id),
    enabled: isOpen,
  });

  const primaryType = pokemon.types[0].type.name;
  const gradient = typeGradients[primaryType as keyof typeof typeGradients];

  const description = species?.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  )?.flavor_text.replace(/\f/g, ' ');

  const genus = species?.genera.find((g) => g.language.name === 'en')?.genus;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div
          className="relative"
          style={{
            background: gradient,
          }}
        >
          {/* Header with Pokemon Image */}
          <div className="relative px-6 pt-6 pb-24">
            <DialogHeader className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <DialogTitle className="text-4xl font-bold text-white capitalize mb-2">
                    {pokemon.name}
                  </DialogTitle>
                  <p className="text-white/90 text-lg">{genus}</p>
                </div>
                <span className="text-2xl font-bold text-white/80">
                  {formatPokemonId(pokemon.id)}
                </span>
              </div>
              <div className="flex gap-2">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type.type.name} type={type.type.name} size="lg" />
                ))}
              </div>
            </DialogHeader>

            {/* Pokemon Image */}
            <div className="absolute right-6 top-6 w-64 h-64 pointer-events-none">
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-full h-full object-contain drop-shadow-2xl animate-bounce-in"
              />
            </div>
          </div>

          {/* White Content Area */}
          <div className="bg-background rounded-t-3xl -mt-16 relative z-10">
            <ScrollArea className="h-[calc(90vh-300px)]">
              <div className="p-6">
                {/* Description */}
                {description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{description}</p>
                  </div>
                )}

                {/* Physical Attributes */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Ruler className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Height</p>
                      <p className="font-semibold">{(pokemon.height / 10).toFixed(1)} m</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Weight className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="font-semibold">{(pokemon.weight / 10).toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="stats" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="visual">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Visual
                    </TabsTrigger>
                    <TabsTrigger value="abilities">Abilities</TabsTrigger>
                    <TabsTrigger value="moves">Moves</TabsTrigger>
                  </TabsList>

                  <TabsContent value="stats" className="space-y-4 mt-4">
                    {pokemon.stats.map((stat) => {
                      const statName = stat.stat.name;
                      const percentage = calculateStatPercentage(stat.base_stat);
                      const color = getStatColor(statName);

                      return (
                        <div key={statName}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">
                              {formatStatName(statName)}
                            </span>
                            <span className="font-bold text-sm">{stat.base_stat}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all duration-500 rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-lg text-primary">
                          {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="visual" className="mt-4">
                    <div className="flex justify-center py-6">
                      <StatsChart pokemon={pokemon} size="lg" />
                    </div>
                  </TabsContent>

                  <TabsContent value="abilities" className="mt-4">
                    <div className="grid gap-3">
                      {pokemon.abilities.map((ability) => (
                        <div
                          key={ability.ability.name}
                          className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                        >
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="capitalize font-medium">
                            {ability.ability.name.replace('-', ' ')}
                          </span>
                          {ability.is_hidden && (
                            <Badge variant="secondary" className="ml-auto">
                              Hidden
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="moves" className="mt-4">
                    <ScrollArea className="h-[300px]">
                      <div className="grid grid-cols-2 gap-2">
                        {pokemon.moves.slice(0, 50).map((move) => (
                          <Badge key={move.move.name} variant="outline" className="justify-start">
                            {move.move.name.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                      {pokemon.moves.length > 50 && (
                        <p className="text-xs text-muted-foreground text-center mt-4">
                          + {pokemon.moves.length - 50} more moves
                        </p>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
