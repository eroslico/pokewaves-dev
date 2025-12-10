import { Pokemon } from '@/types/pokemon';
import { TypeBadge } from './TypeBadge';
import { formatPokemonId, typeGradients } from '@/lib/pokemon-utils';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLazyImage } from '@/hooks/useLazyImage';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (e: React.MouseEvent) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const PokemonCard = ({ pokemon, onClick, isFavorite, onToggleFavorite }: PokemonCardProps) => {
  const primaryType = pokemon.types[0].type.name;
  const gradient = typeGradients[primaryType as keyof typeof typeGradients];
  
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
  const { imgRef, imageSrc, isLoaded } = useLazyImage({ 
    src: imageUrl,
    placeholder: '/placeholder-pokemon.png' 
  });

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer border-2 hover-lift animate-fade-in backdrop-blur-sm"
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, 
          hsla(0, 0%, 100%, 0.9) 0%, 
          ${typeGradients[primaryType as keyof typeof typeGradients].split(',')[0].replace('linear-gradient(135deg,', '').trim()} 100%)`,
        boxShadow: 'var(--shadow-soft)',
      }}
    >
      {/* Animated Background Gradient */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: typeGradients[primaryType as keyof typeof typeGradients],
        }}
      />
      
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent dark:from-black/20" />

      {/* Favorite Button */}
      <button
        onClick={onToggleFavorite}
        className={cn(
          'absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-500',
          'glass-strong shadow-md hover:scale-110 hover:rotate-12',
          isFavorite && 'text-red-500 animate-pulse-glow'
        )}
      >
        <Heart
          className={cn('w-5 h-5 transition-all duration-300', isFavorite && 'fill-current scale-110')}
        />
      </button>

      {/* Pokemon ID */}
      <div className="absolute top-3 left-3 z-10">
        <span className="text-xs font-semibold text-foreground/70 glass-strong px-3 py-1.5 rounded-full shadow-sm">
          {formatPokemonId(pokemon.id)}
        </span>
      </div>

      {/* Pokemon Image */}
      <div className="relative pt-16 pb-6 px-4 z-10">
        <div className="relative w-full aspect-square flex items-center justify-center">
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
               style={{ backgroundColor: typeGradients[primaryType as keyof typeof typeGradients].split(',')[0].replace('linear-gradient(135deg,', '').trim() }} />
          
          <img
            ref={imgRef}
            src={imageSrc || imageUrl}
            alt={pokemon.name}
            className={cn(
              "relative w-full h-full object-contain drop-shadow-2xl transition-all duration-500",
              "group-hover:scale-125 group-hover:drop-shadow-[0_25px_40px_rgba(0,0,0,0.4)] group-hover:rotate-3 animate-float",
              !isLoaded && "opacity-0",
              isLoaded && "opacity-100 animate-fade-in"
            )}
            loading="lazy"
          />
        </div>
      </div>

      {/* Pokemon Info */}
      <div className="relative p-4 pt-0 z-10">
        <h3 className="text-xl font-display font-bold text-foreground capitalize mb-3 text-center tracking-tight">
          {pokemon.name}
        </h3>

        {/* Types */}
        <div className="flex gap-2 justify-center flex-wrap">
          {pokemon.types.map((type) => (
            <TypeBadge key={type.type.name} type={type.type.name} size="sm" />
          ))}
        </div>
      </div>

      {/* Shimmer Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </Card>
  );
};
