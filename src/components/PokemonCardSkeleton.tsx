import { Card } from '@/components/ui/card';

export const PokemonCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-2 animate-pulse">
      <div className="relative pt-16 pb-6 px-4">
        {/* ID Placeholder */}
        <div className="absolute top-3 left-3 h-6 w-16 bg-muted rounded-full" />
        
        {/* Heart Placeholder */}
        <div className="absolute top-3 right-3 h-9 w-9 bg-muted rounded-full" />
        
        {/* Image Placeholder */}
        <div className="relative w-full aspect-square flex items-center justify-center">
          <div className="w-32 h-32 bg-muted rounded-full" />
        </div>
      </div>

      {/* Name Placeholder */}
      <div className="p-4 pt-0 space-y-3">
        <div className="h-6 bg-muted rounded-lg w-3/4 mx-auto" />
        
        {/* Type Badges Placeholder */}
        <div className="flex gap-2 justify-center">
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-16 bg-muted rounded-full" />
        </div>
      </div>
    </Card>
  );
};
