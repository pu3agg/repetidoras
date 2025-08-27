export interface User {
  indicative: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface Repeater {
  id: string;
  callsign: string;
  frequency: string;
  offset: string;
  ctcss: string;
  location: string;
  latitude: number;
  longitude: number;
  power: string;
  coverage: string;
  status: 'Ativa' | 'Inativa' | 'Manutenção';
  owner: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface Log {
  action: string;
  user: string;
  repeaterId?: string;
  timestamp: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (indicative: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'password'> & { password: string; confirmPassword: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface RepeatersContextType {
  repeaters: Repeater[];
  addRepeater: (repeater: Omit<Repeater, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRepeater: (id: string, repeater: Partial<Repeater>) => void;
  deleteRepeater: (id: string) => void;
  searchRepeaters: (query: string) => Repeater[];
}