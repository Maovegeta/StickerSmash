import React, { createContext, useContext, useState } from 'react';

interface Hunter {
  _id?: string;
  nombre: string;
  edad?: number | string;
  anime?: string;
  nen?: { tipo?: string; habilidad?: string };
  personalidad?: string;
  objetivo?: string;
  mejorAmigo?: string;
  imagen?: string;
  active?: boolean;
}

interface HunterContextType {
  hunters: Hunter[];
  hunterSeleccionado: Hunter | null;
  setHunterSeleccionado: (h: Hunter | null) => void;
  addHunter: (hunter: Omit<Hunter, '_id'>) => void;
  updateHunter: (hunter: Hunter) => void;
  deleteHunter: (id: string) => void;
  getHunterById: (id: string) => Hunter | undefined;
}

const HunterContext = createContext<HunterContextType | undefined>(undefined);

export function useHunter() {
  const context = useContext(HunterContext);
  if (!context) {
    throw new Error('useHunter debe usarse dentro de un HunterProvider');
  }
  return context;
}

export function HunterProvider({ children }: { children: React.ReactNode }) {
  const [hunters, setHunters] = useState<Hunter[]>([]);
  const [hunterSeleccionado, setHunterSeleccionado] = useState<Hunter | null>(null);

  const addHunter = (hunter: Omit<Hunter, 'id'>) => {
    const newHunter: Hunter = {
      ...hunter,
      _id: Date.now().toString(),
    };
    setHunters([...hunters, newHunter]);
  };

  const updateHunter = (updatedHunter: Hunter) => {
    setHunters(hunters.map(hunter => 
      hunter._id === updatedHunter._id ? updatedHunter : hunter
    ));
  };

  const deleteHunter = (id: string) => {
    setHunters(hunters.filter(hunter => hunter._id !== id));
  };

  const getHunterById = (id: string) => {
    return hunters.find(hunter => hunter._id === id);
  };

  return (
    <HunterContext.Provider value={{ hunters, hunterSeleccionado, setHunterSeleccionado, addHunter, updateHunter, deleteHunter, getHunterById }}>
      {children}
    </HunterContext.Provider>
  );
}
