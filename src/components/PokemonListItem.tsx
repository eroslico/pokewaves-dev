import { Pokemon } from '@/types/pokemon';
import { TypeBadge } from './TypeBadge';
import { formatPokemonId } from '@/lib/pokemon-utils';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PokemonListItemProps {
  pokemon: Pokemon;
  onClick: (e: React.MouseEvent) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const PokemonListItem = ({ 
  pokemon, 
  onClick, 
  isFavorite, 
  onToggleFavorite 
}: PokemonListItemProps) => {
  return (
    <div
      className="group relative overflow-hidden cursor-pointer border-2 rounded-2xl hover-lift animate-fade-in glass-strong shadow-md hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-center gap-6 p-4">
        {/* Pokemon Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <div className="absolute inset-0 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity bg-primary/30" />
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            className="relative w-full h-full object-contain drop-shadow-lg transition-all duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Pokemon Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-muted-foreground">
              {formatPokemonId(pokemon.id)}
            </span>
            <h3 className="text-2xl font-display font-bold text-foreground capitalize truncate">
              {pokemon.name}
            </h3>
          </div>

          {/* Types */}
          <div className="flex gap-2 flex-wrap">
            {pokemon.types.map((type) => (
              <TypeBadge key={type.type.name} type={type.type.name} size="sm" />
            ))}
          </div>
        </div>

        {/* Stats Preview */}
        <div className="hidden lg:flex flex-col gap-2 min-w-[200px]">
          {pokemon.stats.slice(0, 3).map((stat) => (
            <div key={stat.stat.name} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-12 truncate capitalize">
                {stat.stat.name.replace('-', ' ')}
              </span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold w-8 text-right">
                {stat.base_stat}
              </span>
            </div>
          ))}
        </div>

        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className={cn(
            'p-3 rounded-full transition-all duration-300 flex-shrink-0',
            'glass-strong shadow-md hover:scale-110',
            isFavorite && 'text-red-500'
          )}
        >
          <Heart
            className={cn('w-6 h-6 transition-all duration-300', isFavorite && 'fill-current')}
          />
        </button>
      </div>
    </div>
  );
};
