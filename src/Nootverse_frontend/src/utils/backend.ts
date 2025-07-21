import { createActor } from '../../../declarations/Nootverse_backend';
import { NootverseBackend, Universe, UniverseInput, UniverseUI, Stats, StatsUI } from '../types';
import { Identity } from '@dfinity/agent';

// Get canister ID from environment or use local development ID
const canisterId = process.env.CANISTER_ID_NOOTVERSE_BACKEND || 'rrkah-fqaaa-aaaaa-aaaaq-cai';

// Determine the correct host based on environment
const getHost = () => {
  if (process.env.DFX_NETWORK === 'ic') {
    return 'https://ic0.app';
  }
  
  // For local development, always use localhost:4943 (the replica)
  return 'http://localhost:4943';
};

// Create authenticated actor
export const createBackendActor = (identity?: Identity): NootverseBackend => {
  return createActor(canisterId, {
    agentOptions: {
      host: getHost(),
      identity,
    },
  }) as NootverseBackend;
};

// Default backend instance (will be anonymous if no identity provided)
export const backend = createBackendActor();

// Utility functions to convert between backend and frontend types
export const convertUniverseToUI = (universe: Universe): UniverseUI => ({
  id: universe.id,
  title: universe.title,
  description: universe.description,
  content: universe.content,
  createdAt: new Date(Number(universe.createdAt) / 1000000), // Convert nanoseconds to milliseconds
  updatedAt: new Date(Number(universe.updatedAt) / 1000000),
  isPublic: universe.isPublic,
  tags: universe.tags,
});

export const convertUniversesToUI = (universes: Universe[]): UniverseUI[] => 
  universes.map(convertUniverseToUI);

export const convertStatsToUI = (stats: Stats): StatsUI => ({
  totalUniverses: Number(stats.totalUniverses),
  publicUniverses: Number(stats.publicUniverses),
  totalUsers: Number(stats.totalUsers),
});

// Backend service wrapper with error handling
export const nootverseService = {
  async createUniverse(input: UniverseInput): Promise<string> {
    try {
      const id = await backend.createUniverse(input);
      return id;
    } catch (error) {
      console.error('Error creating universe:', error);
      throw new Error('Failed to create universe');
    }
  },

  async getMyUniverses(): Promise<UniverseUI[]> {
    try {
      const universes = await backend.getMyUniverses();
      return convertUniversesToUI(universes);
    } catch (error) {
      console.error('Error fetching personal universes:', error);
      throw new Error('Failed to fetch personal universes');
    }
  },

  async getPublicUniverses(): Promise<UniverseUI[]> {
    try {
      const universes = await backend.getPublicUniverses();
      return convertUniversesToUI(universes);
    } catch (error) {
      console.error('Error fetching public universes:', error);
      throw new Error('Failed to fetch public universes');
    }
  },

  async updateUniverse(index: number, input: UniverseInput): Promise<boolean> {
    try {
      const result = await backend.updateUniverse(BigInt(index), input);
      return result;
    } catch (error) {
      console.error('Error updating universe:', error);
      throw new Error('Failed to update universe');
    }
  },

  async deleteUniverse(index: number): Promise<boolean> {
    try {
      const result = await backend.deleteUniverse(BigInt(index));
      return result;
    } catch (error) {
      console.error('Error deleting universe:', error);
      throw new Error('Failed to delete universe');
    }
  },

  async searchUniverses(query: string): Promise<UniverseUI[]> {
    try {
      const universes = await backend.searchUniverses(query);
      return convertUniversesToUI(universes);
    } catch (error) {
      console.error('Error searching universes:', error);
      throw new Error('Failed to search universes');
    }
  },

  async getStats(): Promise<StatsUI> {
    try {
      const stats = await backend.getStats();
      return convertStatsToUI(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw new Error('Failed to fetch stats');
    }
  },

  async whoami(): Promise<string> {
    try {
      const principal = await backend.whoami();
      return principal;
    } catch (error) {
      console.error('Error getting principal:', error);
      throw new Error('Failed to get principal');
    }
  },
};

// Create authenticated backend service
export const createAuthenticatedService = (identity: Identity) => {
  const authenticatedBackend = createBackendActor(identity);
  
  return {
    async createUniverse(input: UniverseInput): Promise<string> {
      try {
        const id = await authenticatedBackend.createUniverse(input);
        return id;
      } catch (error) {
        console.error('Error creating universe:', error);
        throw new Error('Failed to create universe');
      }
    },

    async getMyUniverses(): Promise<UniverseUI[]> {
      try {
        const universes = await authenticatedBackend.getMyUniverses();
        return convertUniversesToUI(universes);
      } catch (error) {
        console.error('Error fetching personal universes:', error);
        throw new Error('Failed to fetch personal universes');
      }
    },

    async updateUniverse(index: number, input: UniverseInput): Promise<boolean> {
      try {
        const result = await authenticatedBackend.updateUniverse(BigInt(index), input);
        return result;
      } catch (error) {
        console.error('Error updating universe:', error);
        throw new Error('Failed to update universe');
      }
    },

    async deleteUniverse(index: number): Promise<boolean> {
      try {
        const result = await authenticatedBackend.deleteUniverse(BigInt(index));
        return result;
      } catch (error) {
        console.error('Error deleting universe:', error);
        throw new Error('Failed to delete universe');
      }
    },
  };
};