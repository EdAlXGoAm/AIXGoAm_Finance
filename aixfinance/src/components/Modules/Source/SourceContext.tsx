import React, { createContext, useContext, useEffect, useState } from 'react';
import { RemoteSourceData, SourceFormData, SourceModel, getSources } from '@/services/api/source/apiSource';

interface SourceContextProps {
  elementToCreateSource: SourceFormData | null;
  setElementToCreateSource: (element: SourceFormData | null) => void;
  elementToEditSource: SourceModel | null;
  setElementToEditSource: (element: SourceModel | null) => void;
  sources: RemoteSourceData[];
  setSources: (sources: RemoteSourceData[]) => void;
  selectedSource: RemoteSourceData | null;
  setSelectedSource: (source: RemoteSourceData | null) => void;
}

const SourceContext = createContext<SourceContextProps | undefined>(undefined);

export const SourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elementToCreateSource, setElementToCreateSource] = useState<SourceFormData | null>(null);
  const [elementToEditSource, setElementToEditSource] = useState<SourceModel | null>(null);
  const [sources, setSources] = useState<RemoteSourceData[]>([]);
  const [selectedSource, setSelectedSource] = useState<RemoteSourceData | null>(null);
  const fetchSources = async () => {
    const sources = await getSources();
    setSources(sources.data);
  }

  useEffect(() => {
    fetchSources();
  }, []);

  return (
    <SourceContext.Provider value={{
      elementToCreateSource, setElementToCreateSource,
      elementToEditSource, setElementToEditSource,
      sources, setSources,
      selectedSource, setSelectedSource,
    }}>
      {children}
    </SourceContext.Provider>
  );
};

export const useSource = () => {
  const context = useContext(SourceContext);
  if (!context) {
    throw new Error('useSource must be used within a SourceProvider');
  }
  return context;
};