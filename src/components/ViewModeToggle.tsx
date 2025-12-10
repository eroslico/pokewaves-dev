import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewMode } from '@/hooks/useViewMode';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onToggle: () => void;
}

export const ViewModeToggle = ({ viewMode, onToggle }: ViewModeToggleProps) => {
  return (
    <div className="glass-strong rounded-full p-1 shadow-sm flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={cn(
          'rounded-full transition-all duration-300',
          viewMode === 'grid' && 'bg-primary text-primary-foreground shadow-md'
        )}
        title="Grid View"
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={cn(
          'rounded-full transition-all duration-300',
          viewMode === 'list' && 'bg-primary text-primary-foreground shadow-md'
        )}
        title="List View"
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
};
