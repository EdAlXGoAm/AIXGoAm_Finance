import { useState } from 'react';
import { getTrackingItems, deleteTrackingItem, RemoteTrackingItemData, TrackingItemModel, getTrackingItemsByIdInventoryItem } from '@/services/apiTrackingItem';

interface TrackingItemsElementsProps {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const TrackingItemsElements = ({ refresh, setRefresh }: TrackingItemsElementsProps) => {
  const onRefreshTrackingItems = () => {
    setRefresh(!refresh);
  };
  
  const [elementToEditTrackingItem, setElementToEditTrackingItem] = useState<TrackingItemModel | undefined>(undefined);

  const onCleanElementToEditTrackingItem = () => {
    setElementToEditTrackingItem(undefined);
  };
  
  const onEditElementToEditTrackingItem = (trackingItem: RemoteTrackingItemData | TrackingItemModel) => {
    if ('data' in trackingItem) {
      setElementToEditTrackingItem(trackingItem);
    } else {
      setElementToEditTrackingItem(RemoteTrackingItemDataToModel(trackingItem));
    }
  };
  
  const [trackingItems, setTrackingItems] = useState<RemoteTrackingItemData[]>([]);
  const [isLoadingTrackingItems, setIsLoadingTrackingItems] = useState<boolean>(true);
  
  const fetchTrackingItems = async (idInventoryItem?: string) => {
    setIsLoadingTrackingItems(true);
    if (idInventoryItem) {
      const response = await getTrackingItemsByIdInventoryItem(idInventoryItem);
      setTrackingItems(response);
    } else {
      const response = await getTrackingItems();
      setTrackingItems(response.data);
    }
    setIsLoadingTrackingItems(false);
  };

  const onCreateTrackingItem = (response: RemoteTrackingItemData) => {
    setTrackingItems((prev) => {
      const newTrackingItems = [...prev, response];
      return newTrackingItems;
    });
  };

  const onUpdateTrackingItem = (response: RemoteTrackingItemData) => {
    setTrackingItems((prev) => {
      const newTrackingItems = prev.map((trackingItem) => trackingItem._id === response._id ? response : trackingItem);
      return newTrackingItems;
    });
  };

  const onDeleteTrackingItem = (id: string) => {
    deleteTrackingItem(id);
    setTrackingItems((prev) => {
      const newTrackingItems = prev.filter((trackingItem) => trackingItem._id !== id);
      return newTrackingItems;
    });
  };

  const RemoteTrackingItemDataToModel = (remoteTrackingItem: RemoteTrackingItemData): TrackingItemModel => {
    return {
      _id: remoteTrackingItem._id,
      data: {
        idSource: remoteTrackingItem.idSource,
        idInventoryItem: remoteTrackingItem.idInventoryItem,
        copyInventoryItem: remoteTrackingItem.copyInventoryItem,
        date: remoteTrackingItem.date,
        stock: remoteTrackingItem.stock,
        price: remoteTrackingItem.price
      }
    };
  };
  
  return {
    onRefreshTrackingItems,
    elementToEditTrackingItem, setElementToEditTrackingItem,
    onCleanElementToEditTrackingItem,
    onEditElementToEditTrackingItem,
    trackingItems, fetchTrackingItems,
    isLoadingTrackingItems,
    onCreateTrackingItem,
    onUpdateTrackingItem,
    onDeleteTrackingItem,
    RemoteTrackingItemDataToModel,
  };
};
