"use client";

import React, { useEffect, useState } from 'react';
import Canvas from '../components/Canvas';
import '../styles/globals.css';
import { MiddleColumn } from '@/utils/formatUtils';
import { Row } from '@/utils/utils';
import RelatedOperationForm from '@/components/RelatedOperations/RelatedOperationForm';
import { deleteRelatedOperation, getRelatedOperations, RelatedOperationModel, RemoteRelatedOperationData } from '@/services/apiRelatedOperations';
import RelatedOperationsTable from '@/components/RelatedOperations/RelatedOperationsTable';
import { RelatedOperationElements } from '@/components/RelatedOperations/RelatedOperationElements';
import ItemTable from '@/components/Items/ItemTable';
import { ItemElements } from '@/components/Items/ItemElements';
import SourceForm from '@/components/Sources/SourceForm';
import { SourceElements } from '@/components/Sources/SourceElements';
import CartItemsForm from '@/components/Sources/CartItemsForm';
import { CartItemsElements } from '@/components/Sources/CartItemsElements';
import { RemoteSourceItemData } from '@/services/apiSourceItem';
import SourceItemsForm from '@/components/Sources/SourceItemForm';
import { SourceItemElements } from '@/components/Sources/SourceItemElements';
import { TrackingItemsElements } from '@/components/Sources/TrackingItemsElements';
import TrackingItemsForm from '@/components/Sources/TrackingItemsForm';
import TrackingItemsTable from '@/components/Sources/TrackingItemsTable';
import { PurchaseItemStoryElements } from '@/components/Sources/PurchaseItemStoryElements';
import PurchaseItemStoryForm from '@/components/Sources/PurchaseItemStoryForm';
import { PurchaseItemStoryFormElements } from '@/components/Sources/PurchaseItemStoryFormElements';
import ParamConfigForm from '@/components/Alimentos/ParamConfigForm';
import { ParamConfigElements } from '@/components/Alimentos/ParamConfigElements';
import ItemsTable from '@/components/Sources/ItemsTable';
import { RemoteSourceData } from '@/services/apiSource';
import { RemoteTrackingItemData } from '@/services/apiTrackingItem';
import PurchaseItemStoryTable from '@/components/Sources/PurchaseItemStoryTable';
import SourcesShow from './officialApp/Sources/sourcesShow';

// **Importaciones para los componentes de Inventario**
import InventoryForm from '@/components/Inventario/inventoryForm';
import { InventoryElements } from '@/components/Inventario/inventoryElements';
import InventoryTable from '@/components/Inventario/inventoryTable';
import { RemoteInventoryData } from '@/services/Inventario/apiInventory';
import InventoriesShow from '@/components/Inventario/inventoryShow';

const HomePage: React.FC = () => {

  const [refresh, setRefresh] = useState<boolean>(false);
  const [externalTriggers, setExternalTriggers] = useState({
    newTriggeredSource: false,
    openItemsTable: false,
    newTriggeredSourceItem: false,
    idSourceTriggered: null as RemoteSourceData | null,
    openTrackingItemsTable: false,
    newTriggeredTrackingItem: false,
    newTriggeredPurchaseItemStory: false,
    newTriggeredInventory: false,
    idSourceItemTriggered: null as RemoteSourceItemData | null,
  });

  const {
    elementToEditRelatedOperation, setElementToEditRelatedOperation,
    onCleanDataRelatedOperation,
    relatedOperationType,
    formulasRelatedOperation,
    onCreateRelatedOperationId,
    onRefreshRelatedOperations,
    RemoteRelatedOperationDataToModel,
    relatedOperations, fetchRelatedOperations,
    onEditRelatedOperation,
    onDeleteRelatedOperation
  } = RelatedOperationElements({ refresh, setRefresh });

  const {
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
  } = SourceElements({ refresh, setRefresh });

  const {
    elementToEditCartItem, setElementToEditCartItem,
    onCleanDataCartItem,
    onCreateCartItemId,
    onRefreshCartItems,
    RemoteCartItemDataToModel,
    cartItems, fetchCartItems,
    onEditCartItem,
    onDeleteCartItem
  } = CartItemsElements({ refresh, setRefresh });

  const {
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
  } = SourceItemElements({ refresh, setRefresh });

  const [itemToTracking, setItemToTracking] = useState<RemoteSourceItemData | null>(null);

  const [refreshTrackingItems, setRefreshTrackingItems] = useState<boolean>(false);

  const {
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
  } = TrackingItemsElements({ refresh: refreshTrackingItems, setRefresh: setRefreshTrackingItems });

  const {
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
  } = PurchaseItemStoryElements({ refresh, setRefresh });

  // **Elementos y estados para Inventario**
  const {
    onRefreshInventories,
    elementToEditInventory, setElementToEditInventory,
    onCleanElementToEditInventory,
    onEditElementToEditInventory,
    inventories, fetchInventories,
    isLoadingInventories,
    onCreateInventory,
    onUpdateInventory,
    onDeleteInventory,
    RemoteInventoryDataToModel,
  } = InventoryElements({ refresh, setRefresh });

  useEffect(() => {
    fetchRelatedOperations();
  }, []);
  useEffect(() => {
    fetchRelatedOperations();
  }, [refresh]);

  useEffect(() => {
    fetchSources();
  }, []);
  useEffect(() => {
    fetchSources();
  }, [refresh]);

  useEffect(() => {
    fetchCartItems();
  }, []);
  useEffect(() => {
    fetchCartItems();
  }, [refresh]);

  useEffect(() => {
    fetchSourceItems();
  }, []);
  useEffect(() => {
    fetchSourceItems();
  }, [refresh]);

  useEffect(() => {
    fetchTrackingItems();
  }, []);
  useEffect(() => {
    fetchTrackingItems();
  }, [refresh]);

  useEffect(() => {
    fetchPurchaseItemStories();
  }, []);
  useEffect(() => {
    fetchPurchaseItemStories();
  }, [refresh]);

  useEffect(() => {
    // **Efectos para cargar los inventarios**
    fetchInventories();
  }, []);

  useEffect(() => {
    fetchInventories();
  }, [refresh]);

  const onTrackingItem = (item: RemoteSourceItemData) => {
    setItemToTracking(item);
  }

  const onNewSource = () => {
    setExternalTriggers(prev => ({ ...prev, newTriggeredSource: true }));
  }

  const onNewSourceItem = () => {
    setExternalTriggers(prev => ({ ...prev, newTriggeredSourceItem: true }));
  }

  const onNewTrackingItem = () => {
    setExternalTriggers(prev => ({ ...prev, newTriggeredTrackingItem: true }));
  }

  const onNewInventory = () => {
    setExternalTriggers(prev => ({ ...prev, newTriggeredInventory: true }));
  };

  const [filterFuente, setFilterFuente] = useState<string>('');

  return (
    <div>
      <SourceForm
        onCleanElementToEdit={onCleanElementToEditSource}
        elementToEdit={elementToEditSource}
        hideButton={true}
        mode='floating'
        onAddResponse={onCreateSource}
        onUpdateResponse={onUpdateSource}
        newTriggeredFromExternalComponent={externalTriggers.newTriggeredSource}
        setNewTriggeredFromExternalComponent={(value: boolean) => setExternalTriggers(prev => ({ ...prev, newTriggeredSource: value }))}
      />
      <SourcesShow
        sources={sources}
        isLoadingSources={isLoadingSources}
        onEditSource={onEditElementToEditSource}
        onDeleteSource={onDeleteSource}
        onNewSource={onNewSource}
        mainFilter={filterFuente}
        setMainFilter={setFilterFuente}
        setOpenTriggeredFromExternalComponent={(value: boolean) => setExternalTriggers(prev => ({ ...prev, openItemsTable: value }))}
        setIdSourceTriggeredFromExternalComponent={(id: RemoteSourceData | null) => setExternalTriggers(prev => ({ ...prev, idSourceTriggered: id }))}
      />
      <ItemsTable
        items={sourceItems}
        isLoadingItems={isLoadingSourceItems}
        onEditItem={onEditElementToEditSourceItem}
        onDeleteItem={onDeleteSourceItem}
        mainFilter={filterFuente}
        openTriggeredFromExternalComponent={externalTriggers.openItemsTable}
        setOpenTriggeredFromExternalComponent={(value: boolean) => setExternalTriggers(prev => ({ ...prev, openItemsTable: value }))}
        onNewSourceItem={onNewSourceItem}
        setIdSourceTriggeredFromExternalComponent={(id: RemoteSourceData | null) => setExternalTriggers(prev => ({ ...prev, idSourceTriggered: id }))}
        setIdSourceItemTriggeredFromExternalComponent={(id: RemoteSourceItemData | null) => setExternalTriggers(prev => ({ ...prev, idSourceItemTriggered: id }))}
        setOpenTrackingItemsTableTriggeredFromExternalComponent={(value: boolean) => setExternalTriggers(prev => ({ ...prev, openTrackingItemsTable: value }))}
        setNewTriggeredPurchaseItemStoryFromExternalComponent={(value: boolean) => setExternalTriggers(prev => ({ ...prev, newTriggeredPurchaseItemStory: value }))}
      />
      <RelatedOperationForm
        elementToEdit={elementToEditRelatedOperation}
        onCleanData={onCleanDataRelatedOperation}
        relatedOperationType={relatedOperationType}
        formulas={formulasRelatedOperation}
        onCreateRelatedOperationId={onCreateRelatedOperationId}
        onRefreshRelatedOperations={onRefreshRelatedOperations}
      />
      {/* <CartItemsForm
        elementToEdit={elementToEditCartItem}
        onCleanData={onCleanDataCartItem}
        onCreateCartItemId={onCreateCartItemId}
        onRefreshCartItems={onRefreshCartItems}
      /> */}
      <SourceItemsForm
        onCleanElementToEdit={onCleanElementToEditSourceItem}
        elementToEdit={elementToEditSourceItem}
        hideButton={false}
        mode='floating'
        onAddResponse={onCreateSourceItem}
        onUpdateResponse={onUpdateSourceItem}
        newTriggeredFromExternalComponent={externalTriggers.newTriggeredSourceItem}
        setNewTriggeredFromExternalComponent={(value: boolean) => setExternalTriggers(prev => ({ ...prev, newTriggeredSourceItem: value }))}
        idSourceTriggeredFromExternalComponent={externalTriggers.idSourceTriggered}
      />
      <PurchaseItemStoryForm
        onCleanElementToEdit={onCleanElementToEditPurchaseItemStory}
        elementToEdit={elementToEditPurchaseItemStory}
        hideButton={false}
        mode='floating'
        onAddResponse={onCreatePurchaseItemStoryId}
        onUpdateResponse={onUpdatePurchaseItemStory}
        newTriggeredFromExternalComponent={externalTriggers.newTriggeredPurchaseItemStory}
        setNewTriggeredFromExternalComponent={(value: boolean) => setExternalTriggers(prev => ({ ...prev, newTriggeredPurchaseItemStory: value }))}
        idSourceItemTriggeredFromExternalComponent={externalTriggers.idSourceItemTriggered}
      />
      <TrackingItemsTable
        trackingItems={trackingItems}
        setItemToTracking={setItemToTracking}
        onEditTrackingItem={onEditElementToEditTrackingItem}
        onDeleteTrackingItem={onDeleteTrackingItem}
        onNewTrackingItem={onNewTrackingItem}
        idSourceItemTriggeredFromExternalComponent={externalTriggers.idSourceItemTriggered}
        openTriggeredFromExternalComponent={externalTriggers.openTrackingItemsTable}
        setOpenTriggeredFromExternalComponent={(value: boolean) => setExternalTriggers(prev => ({ ...prev, openTrackingItemsTable: value }))}
      />
      <TrackingItemsForm
        onCleanElementToEdit={onCleanElementToEditTrackingItem}
        elementToEdit={elementToEditTrackingItem}
        hideButton={false}
        mode='floating'
        onAddResponse={onCreateTrackingItem}
        onUpdateResponse={onUpdateTrackingItem}
        newTriggeredFromExternalComponent={externalTriggers.newTriggeredTrackingItem}
        setNewTriggeredFromExternalComponent={(value: boolean) => setExternalTriggers(prev => ({ ...prev, newTriggeredTrackingItem: value }))}
        idSourceItemTriggeredFromExternalComponent={externalTriggers.idSourceItemTriggered}
      />
      <PurchaseItemStoryTable
        purchaseItemStories={purchaseItemStories}
        onEditPurchaseItemStory={onEditElementToEditPurchaseItemStory}
        onDeletePurchaseItemStory={onDeletePurchaseItemStory}
        purchaseItemStoryDataToModel={RemotePurchaseItemStoryDataToModel}
      />
      <InventoryForm
        onCleanElementToEdit={onCleanElementToEditInventory}
        elementToEdit={elementToEditInventory}
        hideButton={true}
        mode='floating'
        onAddResponse={onCreateInventory}
        onUpdateResponse={onUpdateInventory}
        newTriggeredFromExternalComponent={externalTriggers.newTriggeredInventory}
        setNewTriggeredFromExternalComponent={(value: boolean) => setExternalTriggers(prev => ({ ...prev, newTriggeredInventory: value }))}
      />
      <InventoriesShow
        inventories={inventories}
        isLoadingInventories={isLoadingInventories}
        onEditInventory={onEditElementToEditInventory}
        onDeleteInventory={onDeleteInventory}
        onNewInventory={onNewInventory}
      />
    </div>
  );
};

export default HomePage;