import { useState } from 'react';
import { CartItemModel, RemoteCartItemData } from '@/services/apiCartItem';
import { getCartItems, deleteCartItem } from '@/services/apiCartItem';

interface CartItemsElementsProps {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const CartItemsElements = ({ refresh, setRefresh }: CartItemsElementsProps) => {
  
  const [elementToEditCartItem, setElementToEditCartItem] = useState<CartItemModel | undefined>(undefined);

  const onCleanDataCartItem = () => {
    setElementToEditCartItem(undefined);
  };

  const onCreateCartItemId = (id: string) => {
    console.log('id', id);
  };

  const onRefreshCartItems = () => {
    setRefresh(true);
  };

  const RemoteCartItemDataToModel = (remoteCartItem: RemoteCartItemData): CartItemModel => {
    return {
      _id: remoteCartItem._id,
      data: {
        idSource: remoteCartItem.idSource,
        idInventoryItem: remoteCartItem.idInventoryItem,
        quantity: remoteCartItem.quantity,
        totalPrice: remoteCartItem.totalPrice,
        priority: remoteCartItem.priority
      }
    };
  };

  const [cartItems, setCartItems] = useState<RemoteCartItemData[]>([]);

  const fetchCartItems = async () => {
    const response = await getCartItems();
    setCartItems(response.data);
  };

  const onEditCartItem = (cartItem: CartItemModel) => {
    setElementToEditCartItem(cartItem);
  };

  const onDeleteCartItem = (id: string) => {
    deleteCartItem(id);
    setCartItems((prev) => {
      const newCartItems = prev.filter((cartItem) => cartItem._id !== id);
      onRefreshCartItems();
      return newCartItems;
    });
  };

  return {
    elementToEditCartItem, setElementToEditCartItem,
    onCleanDataCartItem,
    onCreateCartItemId,
    onRefreshCartItems,
    RemoteCartItemDataToModel,
    cartItems, fetchCartItems,
    onEditCartItem,
    onDeleteCartItem
  };
};
