import { useState } from 'react';
import { PurchaseItemStoryModel, RemotePurchaseItemStoryData } from '@/services/apiPurchaseItemStory';
import { getPurchaseItemStories, deletePurchaseItemStory } from '@/services/apiPurchaseItemStory';

interface PurchaseItemStoryElementsProps {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const PurchaseItemStoryElements = ({ refresh, setRefresh }: PurchaseItemStoryElementsProps) => {1
  const onRefreshPurchaseItemStories = () => {
    setRefresh(!refresh);
  };
  
  const [elementToEditPurchaseItemStory, setElementToEditPurchaseItemStory] = useState<PurchaseItemStoryModel | undefined>(undefined);

  const onCleanElementToEditPurchaseItemStory = () => {
    setElementToEditPurchaseItemStory(undefined);
  };

  const onEditElementToEditPurchaseItemStory = (purchaseItemStory: PurchaseItemStoryModel | RemotePurchaseItemStoryData) => {
    if ('data' in purchaseItemStory) {
      setElementToEditPurchaseItemStory(purchaseItemStory);
    } else {
      setElementToEditPurchaseItemStory(RemotePurchaseItemStoryDataToModel(purchaseItemStory));
    }
  };

  const [purchaseItemStories, setPurchaseItemStories] = useState<RemotePurchaseItemStoryData[]>([]);
  const [isLoadingPurchaseItemStories, setIsLoadingPurchaseItemStories] = useState<boolean>(true);
  
  const fetchPurchaseItemStories = async () => {
    setIsLoadingPurchaseItemStories(true);
    const response = await getPurchaseItemStories();
    setPurchaseItemStories(response.data);
    setIsLoadingPurchaseItemStories(false);
  };

  const onCreatePurchaseItemStoryId = (response: RemotePurchaseItemStoryData) => {
    setPurchaseItemStories((prev) => {
      const newPurchaseItemStories = [...prev, response];
      return newPurchaseItemStories;
    });
  };

  const onUpdatePurchaseItemStory = (response: RemotePurchaseItemStoryData) => {
    setPurchaseItemStories((prev) => {
      const newPurchaseItemStories = prev.map((purchaseItemStory) => purchaseItemStory._id === response._id ? response : purchaseItemStory);
      return newPurchaseItemStories;
    });
  };

  const onDeletePurchaseItemStory = (id: string) => {
    deletePurchaseItemStory(id);
    setPurchaseItemStories((prev) => {
      const newPurchaseItemStories = prev.filter((purchaseItemStory) => purchaseItemStory._id !== id);
      return newPurchaseItemStories;
    });
  };

  const RemotePurchaseItemStoryDataToModel = (remotePurchaseItemStory: RemotePurchaseItemStoryData): PurchaseItemStoryModel => {
    return {
      _id: remotePurchaseItemStory._id,
      data: {
        idSource: remotePurchaseItemStory.idSource,
        idInventoryItem: remotePurchaseItemStory.idInventoryItem,
        copyInventoryItem: remotePurchaseItemStory.copyInventoryItem,
        date: remotePurchaseItemStory.date,
        quantity: remotePurchaseItemStory.quantity,
        consumptionCost: remotePurchaseItemStory.consumptionCost,
        discount: remotePurchaseItemStory.discount,
        formulaDiscount: remotePurchaseItemStory.formulaDiscount,
        totalPrice: remotePurchaseItemStory.totalPrice,
        categorized: remotePurchaseItemStory.categorized,
        itemLabel: remotePurchaseItemStory.itemLabel,
        itemType: remotePurchaseItemStory.itemType,
        budgetCategory: remotePurchaseItemStory.budgetCategory,
        purpose: remotePurchaseItemStory.purpose,
        potential: remotePurchaseItemStory.potential,
        potentialReason: remotePurchaseItemStory.potentialReason,
        expires: remotePurchaseItemStory.expires,
        idExpiration: remotePurchaseItemStory.idExpiration,
        inventorized: remotePurchaseItemStory.inventorized,
        idInventory: remotePurchaseItemStory.idInventory,
        inventoryCategory1: remotePurchaseItemStory.inventoryCategory1,
        inventoryCategory2: remotePurchaseItemStory.inventoryCategory2,
        inventoryCategory3: remotePurchaseItemStory.inventoryCategory3,
        inventoryCategory4: remotePurchaseItemStory.inventoryCategory4,
        inventoryCategory5: remotePurchaseItemStory.inventoryCategory5,
        idsConsumptionHistory: remotePurchaseItemStory.idsConsumptionHistory,
        leftQuantity: remotePurchaseItemStory.leftQuantity,
        status: remotePurchaseItemStory.status,
        measurable: remotePurchaseItemStory.measurable,
        measureType: remotePurchaseItemStory.measureType,
      }
    };
  };

  return {
    onRefreshPurchaseItemStories,
    elementToEditPurchaseItemStory, setElementToEditPurchaseItemStory,
    onCleanElementToEditPurchaseItemStory,
    onEditElementToEditPurchaseItemStory,
    purchaseItemStories, fetchPurchaseItemStories,
    isLoadingPurchaseItemStories,
    onCreatePurchaseItemStoryId,
    onUpdatePurchaseItemStory,
    onDeletePurchaseItemStory,  
    RemotePurchaseItemStoryDataToModel,
  };
};
