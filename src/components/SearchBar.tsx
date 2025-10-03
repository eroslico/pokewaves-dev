import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = 'Search Pokémon...' }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-md group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 pr-4 h-14 text-base border-2 rounded-2xl glass-strong shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300 hover:shadow-lg"
      />
      {/* Animated border on focus */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-focus-within:opacity-100 -z-10 blur-xl transition-opacity duration-500" />
    </div>
  );
};
