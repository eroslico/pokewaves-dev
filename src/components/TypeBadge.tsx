import { PokemonType } from '@/types/pokemon';
import { typeColors } from '@/lib/pokemon-utils';
import { cn } from '@/lib/utils';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TypeBadge = ({ type, size = 'md', className }: TypeBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const typeColor = typeColors[type as PokemonType] || typeColors.normal;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold text-white shadow-md',
        'transition-all duration-500 hover:scale-110 hover:shadow-lg hover:-translate-y-0.5',
        'relative overflow-hidden group',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: typeColor }}
    >
      {/* Shine effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      <span className="relative z-10">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    </span>
  );
};
