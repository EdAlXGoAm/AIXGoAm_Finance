import React, { useState, useEffect, useRef } from 'react';
import { PurchaseItemStoryModel, createPurchaseItemStory, updatePurchaseItemStory, RemotePurchaseItemStoryData } from '@/services/apiPurchaseItemStory';
import { RemoteSourceData } from '@/services/apiSource';
import { RemoteSourceItemData } from '@/services/apiSourceItem';
import { RemoteTrackingItemData } from '@/services/apiTrackingItem';
import { TrackingItemsElements } from './TrackingItemsElements';
import { RemoteCaducidadData } from '@/services/apiCaducidad';
import { RemoteConsumptionData } from '@/services/apiConsumption';
import { validateFloatQuantity, validatePriceInput } from '@/validationFunctions/validateInput';
import { toISOStringLocal } from '@/utils/dateUtils';
import { FloatingFormElements } from '@/commonForm/floatingFormElements';

interface PurchaseItemStoryFormElementsProps {
  onCleanElementToEdit: () => void,
  elementToEdit?: PurchaseItemStoryModel,
  onAddResponse: (response: any) => void,
  onUpdateResponse: (response: any) => void,
  onDeleteCaducidad?: (id: string) => void,
  openTriggeredFromExternalComponent: boolean,
  setOpenTriggeredFromExternalComponent: (value: boolean) => void,
  idSourceItemTriggeredFromExternalComponent?: RemoteSourceItemData | null,
}

export const PurchaseItemStoryFormElements = ({ onCleanElementToEdit, elementToEdit, onAddResponse, onUpdateResponse, onDeleteCaducidad, openTriggeredFromExternalComponent, setOpenTriggeredFromExternalComponent, idSourceItemTriggeredFromExternalComponent }: PurchaseItemStoryFormElementsProps) => {

  const emptyDisplayData = {
    quantity: { validation: validatePriceInput, initValue: '$0.0' },
    totalPrice: { validation: validateFloatQuantity, initValue: '0' },
  };

  const [validators, setValidators] = useState(emptyDisplayData);

  useEffect(() => {
    if (elementToEdit) {
      setValidators((prevValidators) => {
        const updatedValidators = { ...prevValidators };
        (Object.keys(updatedValidators) as (keyof typeof updatedValidators)[]).forEach((key) => {
          if (elementToEdit.data[key] !== undefined) {
            updatedValidators[key].initValue = String(elementToEdit.data[key]);
          }
        });
        return updatedValidators;
      });
    }
  }, [elementToEdit]);

  const emptyElementData = {
    idSource: {} as RemoteSourceData,
    idTrackingItem: {} as RemoteTrackingItemData,
    date: new Date(),
    quantity: 0,
    consumptionCost: 0,
    discount: 0,
    formulaDiscount: '',
    totalPrice: 0,
    categorized: false,
    itemLabel: '',
    itemType: '',
    budgetCategory: '',
    purpose: '',
    potential: '',
    potentialReason: '',
    expires: true,
    idExpiration: {} as RemoteCaducidadData,
    inventorized: false,
    idInventory: '',
    inventoryCategory1: '',
    inventoryCategory2: '',
    inventoryCategory3: '',
    inventoryCategory4: '',
    inventoryCategory5: '',
    measurable: false,
    measureType: '',
    idsConsumptionHistory: [] as RemoteConsumptionData[],
    leftQuantity: 0,
    status: '',
  };
  
  // TrackingItemElements
  
  const [activeTrackingItem, setActiveTrackingItem] = useState<boolean>(false);
  
  const handleChangeCheckboxActiveTrackingItem = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setActiveTrackingItem(e.target.checked);
  };
  
  const handleChangeDate = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'date') {
      const time = toISOStringLocal(formData.date).split('T')[1].slice(0, 5)
      setFormData((prevData: any) => ({ ...prevData, [name]: new Date(value + 'T' + time) }));
    } else if (name === 'time') {
      const date = toISOStringLocal(formData.date).split('T')[0]
      setFormData((prevData: any) => ({ ...prevData, ["date"]: new Date(date + 'T' + value) }));
    }
  }

  interface Option {
    value: RemoteTrackingItemData;
    label: string;
    image: string;
  }

  const { trackingItems, fetchTrackingItems } = TrackingItemsElements({ refresh: false, setRefresh: () => {} });
  const [trackingItemOptions, setTrackingItemOptions] = useState<Option[]>([]);

  useEffect(() => {
    setTrackingItemOptions([
      { value: {} as RemoteTrackingItemData, label: 'Seleccione un ítem', image: '' },
      ...trackingItems.map((trackingItem: RemoteTrackingItemData) => ({
        value: trackingItem,
        label: trackingItem.copySourceItem.name,
        image: trackingItem.copySourceItem.image
      }))
    ]);
  }, [trackingItems]);

  const formulaDiscountInputRef = useRef<HTMLInputElement>(null);
  
  const handleFormulaDiscountLabelClick = (key: string, value: string) => {
    if (!formulaDiscountInputRef.current) return;
    
    const input = formulaDiscountInputRef.current;
    const cursorPos = input.selectionStart || 0;
    const textToInsert = `{${key}:${value}}`;
    
    const newFormula = formData.formulaDiscount.slice(0, cursorPos) + textToInsert + formData.formulaDiscount.slice(cursorPos);
    
    setFormData((prevData: any) => ({ ...prevData, formulaDiscount: newFormula }));
    
    setTimeout(() => {
      if (input) {
        const newCursorPos = cursorPos + textToInsert.length;
        input.setSelectionRange(newCursorPos, newCursorPos);
        input.focus();
      }
    }, 0);
  };


  const onSubmitPurchaseItemStory = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      const referenceUnit = formData.copyInventoryItem.idParamConfig.reference_unit
      let referenceName = ""
      let referenceQuantity = 0
      if (referenceUnit === 'quantity_unit') {
        referenceName = formData.copyInventoryItem.idParamConfig.quantity_unit
        referenceQuantity = formData.copyInventoryItem.quantity
      } else if (referenceUnit === 'weight_unit') {
        referenceName = formData.copyInventoryItem.idParamConfig.weight_unit
        referenceQuantity = formData.copyInventoryItem.weight
      } else if (referenceUnit === 'volume_unit') {
        referenceName = formData.copyInventoryItem.idParamConfig.volume_unit
        referenceQuantity = formData.copyInventoryItem.volume
      } else if (referenceUnit === 'time_unit') {
        referenceName = formData.copyInventoryItem.idParamConfig.time_unit
        referenceQuantity = formData.copyInventoryItem.time
      }
      console.log("referenceQuantity", referenceQuantity)
      
      let newFormData = {
        ...formData,
        leftQuantity: referenceQuantity*formData.quantity,
      }
      if (!formData.expires) {
        delete newFormData.idExpiration;
      }

      const response = await handleSubmitWithResponse();
      if (submitAction === 'create') {
        onAddResponse(response);
      } else if (submitAction === 'update') {
        onUpdateResponse(response);
      }
    } catch (error) {
      setError('Error submitting form');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleCancel = () => {
    if (!elementToEdit && formData.idExpiration._id) {
      // onDeleteCaducidad(formData.idExpiration._id);
    }
    setDisplayData(emptyDisplayData);
  };
  
  const {
    isOpen,
    error, setError,
    loadingSubmit, setLoadingSubmit,
    loadingForm, setLoadingForm,
    formData, setFormData,
    submitAction, setSubmitAction,
    displayData, setDisplayData,
    displayError, setDisplayError,
    overlayRef,
    modalRef,
    handleCreateNewElement,
    handleClose,
    handleChangeCheckbox,
    handleChangeImageSelect,
    handleChangeTextAndSelect,
    handleChangeWithValidation,
    handleChangeList,
    handleAddListItem,
    handleRemoveListItem,
    handleSubmitWithResponse,
    handleFocus,
    handleBlur,
    handleChangeRichText,
  } = FloatingFormElements({
    onCleanElementToEdit,
    emptyElementData,
    elementToEdit,
    onCloseExternalActions: handleCancel,
    apiCreate: createPurchaseItemStory,
    apiUpdate: updatePurchaseItemStory,
    newTriggeredFromExternalComponent: openTriggeredFromExternalComponent,
    setNewTriggeredFromExternalComponent: setOpenTriggeredFromExternalComponent,
    validators,
  });

  useEffect(() => {
    if (isOpen) {
      if (idSourceItemTriggeredFromExternalComponent) {
        setFormData((prev: any) => ({ ...prev, idSourceItem: idSourceItemTriggeredFromExternalComponent }));
      }
      fetchTrackingItems();
    }
  }, [isOpen]);

  useEffect(() => {
    setFormData((prev: any) => ({ ...prev,
      totalPrice: (formData.quantity * formData.consumptionCost) - formData.discount,
    }));
  }, [formData.consumptionCost, formData.discount]);


  return {
    isOpen,
    error, setError,
    loadingSubmit, setLoadingSubmit,
    loadingForm, setLoadingForm,
    formData, setFormData,
    submitAction, setSubmitAction,
    displayData, setDisplayData,
    displayError, setDisplayError,
    overlayRef,
    modalRef,
    handleCreateNewElement,
    handleClose,
    handleChangeCheckbox,
    handleChangeImageSelect,
    handleChangeTextAndSelect,
    handleChangeWithValidation,
    handleChangeList,
    handleAddListItem,
    handleRemoveListItem,
    handleSubmitWithResponse,
    handleFocus,
    handleBlur,
    handleChangeRichText,

    activeTrackingItem,
    handleChangeDate,
    handleChangeCheckboxActiveTrackingItem,
    formulaDiscountInputRef,
    handleFormulaDiscountLabelClick,

    trackingItemOptions,

    onSubmitPurchaseItemStory,
  };
}
