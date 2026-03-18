"use client";

import { createContext, useContext, useRef, ReactNode } from "react";
import { RootStore } from "./RootStore";

const RootStoreContext = createContext<RootStore | null>(null);

export function RootStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<RootStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = new RootStore();
  }

  return (
    <RootStoreContext.Provider value={storeRef.current}>
      {children}
    </RootStoreContext.Provider>
  );
}

export function useStore() {
    const store = useContext(RootStoreContext);

    if(!store) {
        throw new Error('useStore must be used within RootStoreProvider');
    }
    return store;
}
