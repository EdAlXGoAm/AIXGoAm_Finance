import { useState } from 'react';
import { SourceItemModel, RemoteSourceItemData } from '@/services/apiSourceItem';
import { getSourceItems, deleteSourceItem } from '@/services/apiSourceItem';

interface SourceItemElementsProps {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

  export const SourceItemElements = ({ refresh, setRefresh }: SourceItemElementsProps) => {
  const onRefreshSourceItems = () => {
    setRefresh(!refresh);
  };
  
  const [elementToEditSourceItem, setElementToEditSourceItem] = useState<SourceItemModel | undefined>(undefined);

  const onCleanElementToEditSourceItem = () => {
    setElementToEditSourceItem(undefined);
  };

  const onEditElementToEditSourceItem = (sourceItem: RemoteSourceItemData | SourceItemModel) => {
    if ('data' in sourceItem) {
      setElementToEditSourceItem(sourceItem);
    } else {
      setElementToEditSourceItem(RemoteSourceItemDataToModel(sourceItem));
    }
  };
  
  const [sourceItems, setSourceItems] = useState<RemoteSourceItemData[]>([]);
  const [isLoadingSourceItems, setIsLoadingSourceItems] = useState<boolean>(true);
  
  const fetchSourceItems = async () => {
    setIsLoadingSourceItems(true);
    const response = await getSourceItems();
    setSourceItems(response.data);
    setIsLoadingSourceItems(false);
  };
  
  const onCreateSourceItem = (response: RemoteSourceItemData) => {
    setSourceItems((prev) => {
      const newSourceItems = [...prev, response];
      return newSourceItems;
    });
  };
  
  const onUpdateSourceItem = (response: RemoteSourceItemData) => {
    setSourceItems((prev) => {
      const newSourceItems = prev.map((sourceItem) => sourceItem._id === response._id ? response : sourceItem);
      return newSourceItems;
    });
  };
  
  const onDeleteSourceItem = (id: string) => {
    deleteSourceItem(id);
    setSourceItems((prev) => {
      const newSourceItems = prev.filter((sourceItem) => sourceItem._id !== id);
      return newSourceItems;
    });
  };
  
  const RemoteSourceItemDataToModel = (remoteSourceItem: RemoteSourceItemData): SourceItemModel => {
    return {
      _id: remoteSourceItem._id,
      data: {
        idSource: remoteSourceItem.idSource,
        idParamConfig: remoteSourceItem.idParamConfig,
        providerName: remoteSourceItem.providerName,
        name: remoteSourceItem.name,
        description: remoteSourceItem.description,
        image: remoteSourceItem.image,
        link: remoteSourceItem.link,
        price: remoteSourceItem.price,
        quantity: remoteSourceItem.quantity,
        weight: remoteSourceItem.weight,
        volume: remoteSourceItem.volume,
        time: remoteSourceItem.time,
      }
    };
  };
  
  return {
    onRefreshSourceItems,
    elementToEditSourceItem, setElementToEditSourceItem,
    onCleanElementToEditSourceItem,
    onEditElementToEditSourceItem,
    sourceItems, fetchSourceItems,
    isLoadingSourceItems,
    onCreateSourceItem,
    onUpdateSourceItem,
    onDeleteSourceItem,
    RemoteSourceItemDataToModel,
  };
};

