import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pokemonApi } from '@/lib/pokeapi';
import { Pokemon } from '@/types/pokemon';
import { PokemonCard } from '@/components/PokemonCard';
import { PokemonCardSkeleton } from '@/components/PokemonCardSkeleton';
import { PokemonDetail } from '@/components/PokemonDetail';
import { SearchBar } from '@/components/SearchBar';
import { TypeFilter } from '@/components/TypeFilter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown, Sparkles } from 'lucide-react';

const POKEMON_PER_PAGE = 20;
const MAX_POKEMON = 1010; // Total Pokémon in Gen 9

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [displayCount, setDisplayCount] = useState(POKEMON_PER_PAGE);

  // Fetch initial list of Pokemon
  const { data: pokemonList } = useQuery({
    queryKey: ['pokemon-list'],
    queryFn: () => pokemonApi.getPokemonList(MAX_POKEMON, 0),
  });

  // Fetch details for all Pokemon to display
  const { data: allPokemon, isLoading } = useQuery({
    queryKey: ['all-pokemon', displayCount],
    queryFn: async () => {
      if (!pokemonList) return [];
      const promises = pokemonList.results
        .slice(0, displayCount)
        .map((p: any) => pokemonApi.getPokemon(p.name));
      return Promise.all(promises);
    },
    enabled: !!pokemonList,
  });

  // Filter Pokemon based on search and type
  const filteredPokemon = useMemo(() => {
    if (!allPokemon) return [];

    return allPokemon.filter((pokemon) => {
      const matchesSearch =
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pokemon.id.toString().includes(searchQuery);

      const matchesType =
        selectedTypes.length === 0 ||
        pokemon.types.some((t) => selectedTypes.includes(t.type.name));

      return matchesSearch && matchesType;
    });
  }, [allPokemon, searchQuery, selectedTypes]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + POKEMON_PER_PAGE, MAX_POKEMON));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 -z-10 opacity-30 dark:opacity-20">
        <div style={{ background: 'var(--gradient-mesh)' }} className="absolute inset-0" />
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b glass-strong shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-6">
            {/* Logo and Title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Sparkles className="w-10 h-10 text-primary animate-pulse-glow" />
                  <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-display font-black gradient-text">
                    PokéDex
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm md:text-base font-medium">
                    Discover all {MAX_POKEMON} Pokémon
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 glass px-4 py-2 rounded-full shadow-sm">
                  <span className="text-2xl font-display font-bold text-primary">{filteredPokemon.length}</span>
                  <span className="text-sm text-muted-foreground">results</span>
                </div>
                <ThemeToggle />
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name or number..."
              />
              <TypeFilter
                selectedTypes={selectedTypes}
                onTypeToggle={handleTypeToggle}
                onClear={() => setSelectedTypes([])}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="space-y-8">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="relative inline-block">
                  <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                  <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse" />
                </div>
                <p className="text-muted-foreground font-medium animate-pulse">
                  Loading amazing Pokémon...
                </p>
              </div>
            </div>
            
            {/* Skeleton Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <PokemonCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Pokemon Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredPokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={() => setSelectedPokemon(pokemon)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {displayCount < MAX_POKEMON && searchQuery === '' && selectedTypes.length === 0 && (
              <div className="flex justify-center mt-16">
                <Button
                  onClick={handleLoadMore}
                  size="lg"
                  className="gap-2 text-base px-8 py-6 rounded-2xl font-semibold hover-lift glow-primary group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-2">
                    Load More Pokémon
                    <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
                  </span>
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredPokemon.length === 0 && !isLoading && (
              <div className="text-center py-20 glass rounded-3xl max-w-md mx-auto">
                <div className="text-6xl mb-6 opacity-50">🔍</div>
                <p className="text-xl font-display font-semibold text-foreground mb-2">
                  No Pokémon Found
                </p>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTypes([]);
                  }}
                  className="hover-lift rounded-2xl"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Pokemon Detail Modal */}
      {selectedPokemon && (
        <PokemonDetail
          pokemon={selectedPokemon}
          isOpen={!!selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}

      {/* Footer */}
      <footer className="relative border-t glass-strong mt-20 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <p className="text-foreground font-medium">
              Powered by{' '}
              <a
                href="https://pokeapi.co"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold gradient-text hover:underline"
              >
                PokéAPI
              </a>
            </p>
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Pokémon and Pokémon character names are trademarks of Nintendo.
            <br />
            Built with ❤️ for Pokémon fans worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
