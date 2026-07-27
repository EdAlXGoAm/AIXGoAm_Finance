import { useState } from 'react';
import { SourceModel, RemoteSourceData } from '@/services/apiSource';
import { getSources, deleteSource } from '@/services/apiSource';

interface SourceElementsProps {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const SourceElements = ({ refresh, setRefresh }: SourceElementsProps) => {
  const onRefreshSources = () => {
    setRefresh(!refresh);
  };
  
  const [elementToEditSource, setElementToEditSource] = useState<SourceModel | undefined>(undefined);

  const onCleanElementToEditSource = () => {
    setElementToEditSource(undefined);
  };

  const onEditElementToEditSource = (source: RemoteSourceData | SourceModel) => {
    if ('data' in source) {
      setElementToEditSource(source);
    } else {
      setElementToEditSource(RemoteSourceDataToModel(source));
    }
  };

  const [sources, setSources] = useState<RemoteSourceData[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState<boolean>(true);

  const fetchSources = async () => {
    setIsLoadingSources(true);
    const response = await getSources();
    setSources(response.data);
    setIsLoadingSources(false);
  };

  const onCreateSource = (response: RemoteSourceData) => {
    setSources((prev) => {
      const newSources = [...prev, response];
      return newSources;
    });
  };

  const onUpdateSource = (response: RemoteSourceData) => {
    setSources((prev) => {
      const newSources = prev.map((source) => source._id === response._id ? response : source);
      return newSources;
    });
  };

  const onDeleteSource = (id: string) => {
    deleteSource(id);
    setSources((prev) => {
      const newSources = prev.filter((source) => source._id !== id);
      return newSources;
    });
  };

  const RemoteSourceDataToModel = (remoteSource: RemoteSourceData): SourceModel => {
    return {
      _id: remoteSource._id,
      data: {
        name: remoteSource.name,
        description: remoteSource.description,
        image: remoteSource.image,
        itemsCart: remoteSource.itemsCart,
        itemsTracking: remoteSource.itemsTracking,
        itemsInventory: remoteSource.itemsInventory,
        purchaseHistory: remoteSource.purchaseHistory
      }
    };
  };

  return {
    onRefreshSources,
    elementToEditSource, setElementToEditSource,
    onCleanElementToEditSource,
    onEditElementToEditSource,
    sources, fetchSources,
    isLoadingSources,
    onCreateSource,
    onUpdateSource,
    onDeleteSource,
    RemoteSourceDataToModel,
  };
};
