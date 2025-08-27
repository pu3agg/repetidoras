import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Repeater, RepeatersContextType, Log } from '@/types';
import { useAuth } from './AuthContext';

const RepeatersContext = createContext<RepeatersContextType | undefined>(undefined);

export const useRepeaters = () => {
  const context = useContext(RepeatersContext);
  if (!context) {
    throw new Error('useRepeaters must be used within a RepeatersProvider');
  }
  return context;
};

interface RepeatersProviderProps {
  children: ReactNode;
}

export const RepeatersProvider: React.FC<RepeatersProviderProps> = ({ children }) => {
  const [repeaters, setRepeaters] = useState<Repeater[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load repeaters from localStorage on app start
    const savedRepeaters = localStorage.getItem('repeaters');
    if (savedRepeaters) {
      setRepeaters(JSON.parse(savedRepeaters));
    } else {
      // Initialize with some sample data
      const sampleRepeaters: Repeater[] = [
        {
          id: '1',
          callsign: 'PY2ABC/R',
          frequency: '145.750',
          offset: '-0.600',
          ctcss: '88.5',
          location: 'São Paulo, SP',
          latitude: -23.5505,
          longitude: -46.6333,
          power: '25W',
          coverage: '50km',
          status: 'Ativa',
          owner: 'PY2ABC',
          notes: 'Repetidora metropolitana de São Paulo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'PY2ABC',
          lastModifiedBy: 'PY2ABC'
        },
        {
          id: '2',
          callsign: 'PY2DEF/R',
          frequency: '146.850',
          offset: '-0.600',
          ctcss: '103.5',
          location: 'Rio de Janeiro, RJ',
          latitude: -22.9068,
          longitude: -43.1729,
          power: '50W',
          coverage: '80km',
          status: 'Ativa',
          owner: 'PY2DEF',
          notes: 'Cobertura da região metropolitana do Rio',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'PY2DEF',
          lastModifiedBy: 'PY2DEF'
        }
      ];
      setRepeaters(sampleRepeaters);
      localStorage.setItem('repeaters', JSON.stringify(sampleRepeaters));
    }
  }, []);

  const addRepeater = (repeaterData: Omit<Repeater, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRepeater: Repeater = {
      ...repeaterData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser?.indicative || '',
      lastModifiedBy: currentUser?.indicative || ''
    };

    const updatedRepeaters = [...repeaters, newRepeater];
    setRepeaters(updatedRepeaters);
    localStorage.setItem('repeaters', JSON.stringify(updatedRepeaters));

    // Log the action
    if (currentUser) {
      const logs: Log[] = JSON.parse(localStorage.getItem('logs') || '[]');
      logs.push({
        action: 'add_repeater',
        user: currentUser.indicative,
        repeaterId: newRepeater.id,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('logs', JSON.stringify(logs));
    }
  };

  const updateRepeater = (id: string, repeaterData: Partial<Repeater>) => {
    const updatedRepeaters = repeaters.map(repeater =>
      repeater.id === id
        ? { 
            ...repeater, 
            ...repeaterData, 
            updatedAt: new Date().toISOString(),
            lastModifiedBy: currentUser?.indicative || ''
          }
        : repeater
    );

    setRepeaters(updatedRepeaters);
    localStorage.setItem('repeaters', JSON.stringify(updatedRepeaters));

    // Log the action
    if (currentUser) {
      const logs: Log[] = JSON.parse(localStorage.getItem('logs') || '[]');
      logs.push({
        action: 'update_repeater',
        user: currentUser.indicative,
        repeaterId: id,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('logs', JSON.stringify(logs));
    }
  };

  const deleteRepeater = (id: string) => {
    const updatedRepeaters = repeaters.filter(repeater => repeater.id !== id);
    setRepeaters(updatedRepeaters);
    localStorage.setItem('repeaters', JSON.stringify(updatedRepeaters));

    // Log the action
    if (currentUser) {
      const logs: Log[] = JSON.parse(localStorage.getItem('logs') || '[]');
      logs.push({
        action: 'delete_repeater',
        user: currentUser.indicative,
        repeaterId: id,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('logs', JSON.stringify(logs));
    }
  };

  const searchRepeaters = (query: string): Repeater[] => {
    if (!query.trim()) return repeaters;

    const lowerQuery = query.toLowerCase();
    return repeaters.filter(repeater =>
      repeater.callsign.toLowerCase().includes(lowerQuery) ||
      repeater.location.toLowerCase().includes(lowerQuery) ||
      repeater.frequency.includes(query) ||
      repeater.owner.toLowerCase().includes(lowerQuery)
    );
  };

  const value: RepeatersContextType = {
    repeaters,
    addRepeater,
    updateRepeater,
    deleteRepeater,
    searchRepeaters
  };

  return <RepeatersContext.Provider value={value}>{children}</RepeatersContext.Provider>;
};