import { createContext, useContext, useState } from "react";

type Caballero = {
  _id: string;
  nombre: string;
  constelacion: string;
  nivel: string;
  descripcion: string;
  imagen: string;
};

type CaballerosContextType = {
  caballeroSeleccionado: Caballero | null;
  setCaballeroSeleccionado: (c: Caballero | null) => void;
};

const CaballerosContext = createContext<CaballerosContextType | undefined>(undefined);

export function CaballerosProvider({ children }: { children: React.ReactNode }) {
  const [caballeroSeleccionado, setCaballeroSeleccionado] = useState<Caballero | null>(null);

  return (
    <CaballerosContext.Provider value={{ caballeroSeleccionado, setCaballeroSeleccionado }}>
      {children}
    </CaballerosContext.Provider>
  );
}

export function useCaballero() {
  const context = useContext(CaballerosContext);
  if (!context) {
    throw new Error("useCaballero debe usarse dentro de un CaballerosProvider");
  }
  return context;
}
