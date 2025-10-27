import { createContext, useContext, useState } from "react";

type CounterContextType = {
  contador: number;
  setContador: (n: number) => void;
};

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [contador, setContador] = useState(0);
  return (
    <CounterContext.Provider value={{ contador, setContador }}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounter() {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error("useCounter debe usarse dentro de un CounterProvider");
  }
  return context;
}