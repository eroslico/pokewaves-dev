import { PokemonType } from '@/types/pokemon';

export const typeColors: Record<PokemonType, string> = {
  normal: 'hsl(var(--type-normal))',
  fire: 'hsl(var(--type-fire))',
  water: 'hsl(var(--type-water))',
  electric: 'hsl(var(--type-electric))',
  grass: 'hsl(var(--type-grass))',
  ice: 'hsl(var(--type-ice))',
  fighting: 'hsl(var(--type-fighting))',
  poison: 'hsl(var(--type-poison))',
  ground: 'hsl(var(--type-ground))',
  flying: 'hsl(var(--type-flying))',
  psychic: 'hsl(var(--type-psychic))',
  bug: 'hsl(var(--type-bug))',
  rock: 'hsl(var(--type-rock))',
  ghost: 'hsl(var(--type-ghost))',
  dragon: 'hsl(var(--type-dragon))',
  dark: 'hsl(var(--type-dark))',
  steel: 'hsl(var(--type-steel))',
  fairy: 'hsl(var(--type-fairy))',
};

export const typeGradients: Record<PokemonType, string> = {
  normal: 'linear-gradient(135deg, hsl(var(--type-normal)) 0%, hsl(var(--type-normal)) 100%)',
  fire: 'linear-gradient(135deg, hsl(25 85% 55%) 0%, hsl(15 85% 45%) 100%)',
  water: 'linear-gradient(135deg, hsl(210 85% 55%) 0%, hsl(200 85% 45%) 100%)',
  electric: 'linear-gradient(135deg, hsl(48 100% 50%) 0%, hsl(43 100% 45%) 100%)',
  grass: 'linear-gradient(135deg, hsl(120 50% 45%) 0%, hsl(110 50% 35%) 100%)',
  ice: 'linear-gradient(135deg, hsl(180 50% 70%) 0%, hsl(185 50% 60%) 100%)',
  fighting: 'linear-gradient(135deg, hsl(0 60% 45%) 0%, hsl(355 60% 35%) 100%)',
  poison: 'linear-gradient(135deg, hsl(285 50% 50%) 0%, hsl(280 50% 40%) 100%)',
  ground: 'linear-gradient(135deg, hsl(40 50% 45%) 0%, hsl(35 50% 35%) 100%)',
  flying: 'linear-gradient(135deg, hsl(210 70% 70%) 0%, hsl(220 70% 60%) 100%)',
  psychic: 'linear-gradient(135deg, hsl(330 70% 60%) 0%, hsl(325 70% 50%) 100%)',
  bug: 'linear-gradient(135deg, hsl(70 55% 45%) 0%, hsl(65 55% 35%) 100%)',
  rock: 'linear-gradient(135deg, hsl(40 30% 45%) 0%, hsl(35 30% 35%) 100%)',
  ghost: 'linear-gradient(135deg, hsl(270 45% 45%) 0%, hsl(265 45% 35%) 100%)',
  dragon: 'linear-gradient(135deg, hsl(260 70% 50%) 0%, hsl(255 70% 40%) 100%)',
  dark: 'linear-gradient(135deg, hsl(240 25% 30%) 0%, hsl(235 25% 20%) 100%)',
  steel: 'linear-gradient(135deg, hsl(220 15% 60%) 0%, hsl(215 15% 50%) 100%)',
  fairy: 'linear-gradient(135deg, hsl(320 70% 75%) 0%, hsl(315 70% 65%) 100%)',
};

export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(4, '0')}`;
};

export const formatPokemonName = (name: string): string => {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatStatName = (name: string): string => {
  const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
  };
  return statNames[name] || name;
};

export const getStatColor = (statName: string): string => {
  const colors: Record<string, string> = {
    hp: 'hsl(120 50% 45%)',
    attack: 'hsl(0 60% 45%)',
    defense: 'hsl(210 85% 55%)',
    'special-attack': 'hsl(285 50% 50%)',
    'special-defense': 'hsl(70 55% 45%)',
    speed: 'hsl(48 100% 50%)',
  };
  return colors[statName] || 'hsl(var(--primary))';
};

export const calculateStatPercentage = (stat: number): number => {
  // Max base stat is usually 255
  return Math.min((stat / 255) * 100, 100);
};
