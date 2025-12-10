import { useState, useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';

const COMPARE_KEY = 'pokemonCompare';
const MAX_COMPARE = 3;

export const useCompare = () => {
  const [compareList, setCompareList] = useState<Pokemon[]>(() => {
    try {
      const stored = localStorage.getItem(COMPARE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (pokemon: Pokemon) => {
    if (compareList.length >= MAX_COMPARE) {
      return false;
    }
    if (compareList.some(p => p.id === pokemon.id)) {
      return false;
    }
    setCompareList(prev => [...prev, pokemon]);
    return true;
  };

  const removeFromCompare = (pokemonId: number) => {
    setCompareList(prev => prev.filter(p => p.id !== pokemonId));
  };

  const clearCompare = () => setCompareList([]);

  const isInCompare = (pokemonId: number) => compareList.some(p => p.id === pokemonId);

  const canAddMore = compareList.length < MAX_COMPARE;

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    canAddMore,
    compareCount: compareList.length,
  };
};
