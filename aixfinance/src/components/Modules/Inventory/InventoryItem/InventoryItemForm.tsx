import React from 'react';
import { useInventoryItem } from './InventoryItemContext';
import { RemoteInventoryItemData, emptyInventoryItemFormData, createInventoryItem, updateInventoryItem } from '@/services/api/inventory/apiInventoryItem';
import { AcquisitionProps, emptyAcquisitionProps } from '@/services/api/inventory/apiInventoryItem';
import { PurchaseProps, emptyPurchaseProps } from '@/services/api/inventory/apiInventoryItem';
import { SaleProps, emptySaleProps } from '@/services/api/inventory/apiInventoryItem';
import { ManufacturingProps, emptyManufacturingProps } from '@/services/api/inventory/apiInventoryItem';
import { ManufacturingOperation, emptyManufacturingOperation } from '@/services/api/inventory/apiInventoryItem';
import { AssetProps, emptyAssetProps } from '@/services/api/inventory/apiInventoryItem';
import { AssetRentOperation, emptyAssetRentOperation } from '@/services/api/inventory/apiInventoryItem';
import { AssetDepreciationOperation, emptyAssetDepreciationOperation } from '@/services/api/inventory/apiInventoryItem';
import { AssetMaintenanceOperation, emptyAssetMaintenanceOperation } from '@/services/api/inventory/apiInventoryItem';
import { ConsumableProps, emptyConsumableProps } from '@/services/api/inventory/apiInventoryItem';
import { ConsumableOperation, emptyConsumableOperation } from '@/services/api/inventory/apiInventoryItem';
import { FloatingFormElements } from '@/commonForm/floatingFormElements';
import { validatePriceInput, validateFloatQuantity } from '@/validationFunctions/validateInput';
import { FrontCloseButton, FrontModalContainer, FrontOverlayContainer } from "@/commonForm/frontContainer";
import { ErrorMessage } from '@/commonForm/FrontBody';
import { miniIconRound } from '@/commonIcons/icons';

const InventoryItemElementsForm = () => {
  const {
    elementToCreateInventoryItem, setElementToCreateInventoryItem,
    elementToEditInventoryItem, setElementToEditInventoryItem,
    inventoryItems, setInventoryItems
  } = useInventoryItem();

  const emptyDisplayData = {
    // Acquisition props
    quantity: { validation: validateFloatQuantity, initValue: '1' },
    // PurchaseProps
    purchasePrice: { validation: validatePriceInput, initValue: '$0' },
    // SaleProps
    saleCost: { validation: validatePriceInput, initValue: '$0' },
    saleProfit: { validation: validatePriceInput, initValue: '$0' },
    saleTax: { validation: validatePriceInput, initValue: '$0' },
    salePrice: { validation: validatePriceInput, initValue: '$0' },
    // ManufacturingProps
    manufacturingRemainingHours: { validation: validateFloatQuantity, initValue: '0' },
    // ManufacturingOperation
    valueProgress: { validation: validateFloatQuantity, initValue: '0' },
    // AssetProps
    assetMaintenanceValue: { validation: validatePriceInput, initValue: '$0' },
    assetDepreciationValue: { validation: validatePriceInput, initValue: '$0' },
    assetRentValue: { validation: validatePriceInput, initValue: '$0' },
    // AssetRentOperation
    valueRentUsage: { validation: validatePriceInput, initValue: '$0' },
    // AssetDepreciationOperation
    valueDepreciation: { validation: validatePriceInput, initValue: '$0' },
    // AssetMaintenanceOperation
    valueMaintenance: { validation: validatePriceInput, initValue: '$0' },
    // ConsumableProps
    consumableRemainingQuantity: { validation: validateFloatQuantity, initValue: '0' },
    // ConsumableOperation
    validConsumption: { validation: validateFloatQuantity, initValue: '0' },
    wasteConsumption: { validation: validateFloatQuantity, initValue: '0' },
    totalConsumption: { validation: validateFloatQuantity, initValue: '0' },
  };

  const {
    isOpen,
    error, setError,
    formData, setFormData,
    submitAction, setSubmitAction,
    overlayRef,
    modalRef,
    handleClose,
    handleSubmitWithResponse,
    renderButtonCircle,
    renderButtonSubmit,
    renderDateInputRow,
    renderTextInputRow,
    renderTextInputRowWithValidation,
    renderTextAreaRow,
    renderSelectRow,
    renderListBox
  } = FloatingFormElements({
    onCleanElementToEdit: () => setElementToEditInventoryItem(null),
    onCleanElementToCreate: () => setElementToCreateInventoryItem(null),
    elementToEdit: elementToEditInventoryItem,
    elementToCreate: elementToCreateInventoryItem,
    emptyElementData: emptyInventoryItemFormData,
    onCloseExternalActions: () => null,
    apiCreate: createInventoryItem,
    apiUpdate: updateInventoryItem,
    emptyDisplayData,
  });

  const handleSubmitInventoryItem = async () => {
    const handleAddInventoryItem = (inventoryItem: RemoteInventoryItemData) => {
      setInventoryItems([...inventoryItems, inventoryItem]);
    }
    const handleUpdateInventoryItem = (inventoryItem: RemoteInventoryItemData) => {
      setInventoryItems(inventoryItems.map((i) => i._id === inventoryItem._id ? inventoryItem : i));
    }
    let error = false;
    let message = '';
    if (formData.id_inventory === '' || formData.category === '') {
      message = 'Por favor, completa todos los campos. (Id Inventory, Date, Category, Id Source Item, Id Building Item)';
      error = true;
    }
    if (error) {
      setError(message);
      return;
    }
    const inventoryItem = await handleSubmitWithResponse();
    if (submitAction === 'create') {
      handleAddInventoryItem(inventoryItem);
    } else {
      handleUpdateInventoryItem(inventoryItem);
    }
  }

  return (
    <React.Fragment>
      {isOpen && (
        <React.Fragment>
          <FrontOverlayContainer overlayRef={overlayRef}>
            <FrontModalContainer modalRef={modalRef} maxWidth='600px'>
              <FrontCloseButton handleClose={handleClose} />
              <h2>{elementToEditInventoryItem ? 'Edit Inventory Item' : 'Add Inventory Item'}</h2>
              {formData.id_inventory && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {miniIconRound(formData.id_inventory.image, formData.id_inventory.name, 20)}
                  <span>Inventory: {formData.id_inventory.name}</span>
                </div>
              )}
              {renderDateInputRow('date', 'Date', true)}
              {renderSelectRow('category', 'Category', ['consumible', 'usable'], ['Consumible', 'Usable'])}
              {formData.id_sourceItem && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {miniIconRound(formData.id_sourceItem.image, formData.id_sourceItem.name, 20)}
                  <span>Source Item: {formData.id_sourceItem.name}</span>
                </div>
              )}
              {formData.id_buildingItem && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {miniIconRound(formData.id_buildingItem.image, formData.id_buildingItem.name, 20)}
                  <span>Building Item: {formData.id_buildingItem.name}</span>
                </div>
              )}
              {renderButtonSubmit(['Submit', 'Update'], handleSubmitInventoryItem)}
            </FrontModalContainer>
          </FrontOverlayContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default InventoryItemElementsForm;
