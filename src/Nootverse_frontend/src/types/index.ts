import { Identity } from '@dfinity/agent';
import { ActorSubclass } from '@dfinity/agent';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  identity: Identity | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  principal: string | null;
}

export interface NootverseBackend extends ActorSubclass<any> {
  addNote: (id: string, title: string, content: string, tags: string[]) => Promise<void>;
  getAllOwnedNotes: () => Promise<Note[]>;
  updateNote: (keyId: bigint, id: string, title: string, content: string, tags: string[]) => Promise<void>;
  deleteNote: (index: bigint) => Promise<void>;
  searchNotes: (queryString: string) => Promise<Note[]>;
  whoami: () => Promise<string>;
}

export interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface AppState {
  selectedNote: Note | null;
  isEditing: boolean;
  currentView: 'notes' | 'about';
}