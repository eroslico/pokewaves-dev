import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pokemonApi } from '@/lib/pokeapi';
import { Pokemon } from '@/types/pokemon';
import { PokemonCard } from '@/components/PokemonCard';
import { PokemonListItem } from '@/components/PokemonListItem';
import { PokemonCardSkeleton } from '@/components/PokemonCardSkeleton';
import { PokemonDetail } from '@/components/PokemonDetail';
import { PokemonCompare } from '@/components/PokemonCompare';
import { SearchBar } from '@/components/SearchBar';
import { TypeFilter } from '@/components/TypeFilter';
import { GenerationFilter, getGenerationRange } from '@/components/GenerationFilter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronDown, Sparkles, Heart, GitCompare } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useViewMode } from '@/hooks/useViewMode';
import { useCompare } from '@/hooks/useCompare';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

const INITIAL_LOAD = 151; // Gen 1 by default
const LOAD_MORE_COUNT = 50; // Load 50 more at a time
const MAX_POKEMON = 1010;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [loadedCount, setLoadedCount] = useState(INITIAL_LOAD);
  
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { viewMode, toggleViewMode } = useViewMode();
  const { compareList, addToCompare, removeFromCompare, clearCompare, isInCompare, canAddMore, compareCount } = useCompare();

  // Fetch initial list of Pokemon
  const { data: pokemonList } = useQuery({
    queryKey: ['pokemon-list'],
    queryFn: () => pokemonApi.getPokemonList(MAX_POKEMON, 0),
  });

  // Determine how many Pokemon to load based on filters
  const pokemonToLoad = useMemo(() => {
    if (!pokemonList) return 0;
    
    // If generation is selected, load only that generation
    if (selectedGeneration) {
      const range = getGenerationRange(selectedGeneration);
      return range.max - range.min + 1;
    }
    
    // If filters are active, load all to ensure proper filtering
    if (selectedTypes.length > 0 || showFavoritesOnly || searchQuery) {
      return MAX_POKEMON;
    }
    
    // Otherwise, load incrementally
    return loadedCount;
  }, [pokemonList, selectedGeneration, selectedTypes.length, showFavoritesOnly, searchQuery, loadedCount]);

  // Determine which Pokemon to fetch
  const pokemonToFetch = useMemo(() => {
    if (!pokemonList) return [];
    
    let filtered = pokemonList.results;
    
    // Filter by generation if selected
    if (selectedGeneration) {
      const range = getGenerationRange(selectedGeneration);
      filtered = filtered.filter((_: any, index: number) => {
        const id = index + 1;
        return id >= range.min && id <= range.max;
      });
    } else {
      // Otherwise, take only the amount we want to load
      filtered = filtered.slice(0, pokemonToLoad);
    }
    
    return filtered;
  }, [pokemonList, selectedGeneration, pokemonToLoad]);

  // Fetch Pokemon details
  const { data: allPokemon, isLoading } = useQuery({
    queryKey: ['pokemon-batch', selectedGeneration, pokemonToLoad],
    queryFn: async () => {
      if (!pokemonList) return [];
      
      // Load in batches for better performance
      const batchSize = 50;
      const allResults = [];
      
      for (let i = 0; i < pokemonToFetch.length; i += batchSize) {
        const batch = pokemonToFetch.slice(i, i + batchSize);
        const promises = batch.map((p: any) => pokemonApi.getPokemon(p.name));
        const results = await Promise.all(promises);
        allResults.push(...results);
      }
      
      return allResults;
    },
    enabled: !!pokemonList && pokemonToFetch.length > 0,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });

  // Filter Pokemon based on search, type, generation, and favorites
  const filteredPokemon = useMemo(() => {
    if (!allPokemon) return [];

    return allPokemon.filter((pokemon) => {
      const matchesSearch =
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pokemon.id.toString().includes(searchQuery);

      const matchesType =
        selectedTypes.length === 0 ||
        pokemon.types.some((t) => selectedTypes.includes(t.type.name));

      const matchesGeneration = selectedGeneration === null || (() => {
        const range = getGenerationRange(selectedGeneration);
        return pokemon.id >= range.min && pokemon.id <= range.max;
      })();

      const matchesFavorites = !showFavoritesOnly || isFavorite(pokemon.id);

      return matchesSearch && matchesType && matchesGeneration && matchesFavorites;
    });
  }, [allPokemon, searchQuery, selectedTypes, selectedGeneration, showFavoritesOnly, isFavorite]);

  // Get Pokemon names for autocomplete
  const pokemonNames = useMemo(() => {
    return allPokemon?.map(p => p.name) || [];
  }, [allPokemon]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handlePokemonClick = (pokemon: Pokemon, ctrlKey: boolean) => {
    if (ctrlKey && canAddMore) {
      addToCompare(pokemon);
    } else {
      setSelectedPokemon(pokemon);
    }
  };

  const handleLoadMore = () => {
    setLoadedCount(prev => Math.min(prev + LOAD_MORE_COUNT, MAX_POKEMON));
  };

  const canLoadMore = !selectedGeneration && !searchQuery && selectedTypes.length === 0 && !showFavoritesOnly && loadedCount < MAX_POKEMON;

  // Infinite scroll
  const loadMoreRef = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore: canLoadMore,
    isLoading,
  });

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
              
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 glass px-4 py-2 rounded-full shadow-sm">
                  <span className="text-2xl font-display font-bold text-primary">{filteredPokemon.length}</span>
                  <span className="text-sm text-muted-foreground">results</span>
                </div>
                {favorites.length > 0 && (
                  <Badge 
                    variant={showFavoritesOnly ? "default" : "outline"}
                    className="cursor-pointer hover:scale-105 transition-transform px-3 py-1.5"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                    {favorites.length}
                  </Badge>
                )}
                {compareCount > 0 && (
                  <Badge 
                    variant="secondary"
                    className="cursor-pointer hover:scale-105 transition-transform px-3 py-1.5 relative"
                    onClick={() => setShowCompare(true)}
                  >
                    <GitCompare className="w-4 h-4 mr-1" />
                    Compare ({compareCount})
                  </Badge>
                )}
                <ViewModeToggle viewMode={viewMode} onToggle={toggleViewMode} />
                <ThemeToggle />
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name or number..."
                suggestions={pokemonNames}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TypeFilter
                  selectedTypes={selectedTypes}
                  onTypeToggle={handleTypeToggle}
                  onClear={() => setSelectedTypes([])}
                />
                <GenerationFilter
                  selectedGeneration={selectedGeneration}
                  onGenerationSelect={setSelectedGeneration}
                />
              </div>
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
                  {selectedGeneration 
                    ? `Loading Generation ${selectedGeneration} Pokémon...` 
                    : 'Loading all Pokémon...'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This may take a moment
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
            {/* Pokemon Grid/List */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6'
                : 'flex flex-col gap-4'
            }>
              {filteredPokemon.map((pokemon) => {
                const handleToggleFavorite = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  toggleFavorite(pokemon.id);
                };

                const handleClick = (e: React.MouseEvent) => {
                  handlePokemonClick(pokemon, e.ctrlKey || e.metaKey);
                };

                return viewMode === 'grid' ? (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={handleClick}
                    isFavorite={isFavorite(pokemon.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ) : (
                  <PokemonListItem
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={handleClick}
                    isFavorite={isFavorite(pokemon.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                );
              })}
            </div>

            {/* Load More Button */}
            {canLoadMore && !isLoading && (
              <div className="flex flex-col items-center gap-4 mt-12">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Showing {loadedCount} of {MAX_POKEMON} Pokémon
                  </p>
                  <Button
                    onClick={handleLoadMore}
                    size="lg"
                    className="gap-2 text-base px-8 py-6 rounded-2xl font-semibold hover-lift glow-primary group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10 flex items-center gap-2">
                      Load {Math.min(LOAD_MORE_COUNT, MAX_POKEMON - loadedCount)} More
                      <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
                    </span>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3 opacity-70">
                    Or scroll down to load automatically
                  </p>
                </div>
                {/* Infinite scroll trigger */}
                <div ref={loadMoreRef} className="h-4 w-full" />
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
                    setSelectedGeneration(null);
                    setShowFavoritesOnly(false);
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

      {/* Pokemon Compare Modal */}
      <PokemonCompare
        pokemon={compareList}
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        onRemove={removeFromCompare}
      />

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
