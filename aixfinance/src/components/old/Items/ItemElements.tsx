import { useState } from "react";
import { ItemModel, RemoteItemData } from "@/services/apiItems";
import { getItems } from "@/services/apiItems";
import { deleteItem } from "@/services/apiItems";

interface ItemElementsProps {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const ItemElements = ({ refresh, setRefresh }: ItemElementsProps) => {

  const [elementToEditItem, setElementToEditItem] = useState<ItemModel | undefined>(undefined);
  
  const onCleanDataItem = () => {
    setElementToEditItem(undefined);
  };

  const [formulasItem, setFormulasItem] = useState<Map<string, string>>(new Map());

  const onCreateItemId = (id: string) => {
    console.log('id', id);
  };

  const onRefreshItems = () => {
    setRefresh(!refresh);
  };

  const RemoteItemDataToModel = (remoteItem: RemoteItemData) => {
    return {
      _id: remoteItem._id,
      data: {
        datePurchase: remoteItem.datePurchase,
        name: remoteItem.name,
        description: remoteItem.description,
        amountType: remoteItem.amountType,
        preAmount: remoteItem.preAmount,
        preRelatedOperations: remoteItem.preRelatedOperations,
        itemAmount: remoteItem.itemAmount,
        postRelatedOperations: remoteItem.postRelatedOperations,
        finalAmount: remoteItem.finalAmount,
        imageUrl: remoteItem.imageUrl,
        idSourceTransaction: remoteItem.idSourceTransaction,
        categorized: remoteItem.categorized,
        itemLabel: remoteItem.itemLabel,
        itemType: remoteItem.itemType,
        budgetCategory: remoteItem.budgetCategory,
        purpose: remoteItem.purpose,
        potential: remoteItem.potential,
        potentialReason: remoteItem.potentialReason,
        quantitized: remoteItem.quantitized,
        idParamConfig: remoteItem.idParamConfig,
        quantity: remoteItem.quantity,
        weight: remoteItem.weight,
        volume: remoteItem.volume,
        expires: remoteItem.expires,
        idExpiration: remoteItem.idExpiration,
        inventorized: remoteItem.inventorized,
        idInventory: remoteItem.idInventory,
        inventoryCategory1: remoteItem.inventoryCategory1,
        inventoryCategory2: remoteItem.inventoryCategory2,
        inventoryCategory3: remoteItem.inventoryCategory3,
        inventoryCategory4: remoteItem.inventoryCategory4,
        inventoryCategory5: remoteItem.inventoryCategory5,
        idsConsumptionHistory: remoteItem.idsConsumptionHistory
      }
    }
  };
  
  const [items, setItems] = useState<RemoteItemData[]>([]);

  const fetchItems = async () => {
    const response = await getItems();
    setItems(response.data);
  };

  const onEditItem = (element: ItemModel, formulas: Map<string, string>) => {
    setElementToEditItem(element);
    setFormulasItem(formulas);
  };

  const onDeleteItem = (id: string) => {
    deleteItem(id);
    setItems((prev) => {
      const newItems = prev.filter((item) => item._id !== id);
      onRefreshItems();
      return newItems;
    });
  };


  return {
    elementToEditItem, setElementToEditItem,
    onCleanDataItem,
    formulasItem,
    onCreateItemId,
    onRefreshItems,
    RemoteItemDataToModel,
    items, fetchItems,
    onEditItem,
    onDeleteItem
  }
}
