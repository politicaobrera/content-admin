'use client'

import { createContext, useState, useEffect } from 'react';
import getSections from '../actions/data/sections/getSections';

const SectionsContext = createContext({sections: []});

interface SectionsProviderProps {
  children: React.ReactNode
}

export function SectionsProvider({ children }: SectionsProviderProps) {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      const {data, error} = await getSections();
      if (error) {
        console.log("error obteniendo secciones")
        return
      }
      setSections(data);
    };

    fetchSections();
  }, []);

  return (
    <SectionsContext.Provider value={{ sections }}>
      {children}
    </SectionsContext.Provider>
  );
}

export default SectionsContext;