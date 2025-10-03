import { Pokemon, PokemonSpecies, EvolutionChain } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonApi = {
  async getPokemonList(limit: number = 151, offset: number = 0) {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data;
  },

  async getPokemon(idOrName: string | number): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
    const data = await response.json();
    return data;
  },

  async getPokemonSpecies(id: number): Promise<PokemonSpecies> {
    const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
    const data = await response.json();
    return data;
  },

  async getEvolutionChain(url: string): Promise<EvolutionChain> {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  },

  async getTypeData(type: string) {
    const response = await fetch(`${BASE_URL}/type/${type}`);
    const data = await response.json();
    return data;
  },

  extractIdFromUrl(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]);
  },
};
