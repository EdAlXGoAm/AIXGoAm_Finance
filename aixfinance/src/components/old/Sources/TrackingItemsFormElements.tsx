import React, { useState, useEffect } from 'react';
import { TrackingItemModel, createTrackingItem, updateTrackingItem, RemoteTrackingItemData } from '@/services/apiTrackingItem';
import { RemoteSourceData, getSourceById } from '@/services/apiSource';
import { RemoteSourceItemData } from '@/services/apiSourceItem';
import { SourceItemElements } from './SourceItemElements';
import { toISOStringLocal } from '@/utils/dateUtils';
import { validateFloatQuantity, validatePriceInput } from '@/validationFunctions/validateInput';
import { FloatingFormElements } from '@/commonForm/floatingFormElements';
import { getDaysBetweenDates, getDatePlusDays, evaluateIfDate2IsGreaterThanDate1 } from '@/utils/dateUtils';

interface TrackingItemsFormElementsProps {
  onCleanElementToEdit: () => void,
  elementToEdit?: TrackingItemModel,
  onAddResponse: (response: RemoteTrackingItemData) => void,
  onUpdateResponse: (response: RemoteTrackingItemData) => void,
  newTriggeredFromExternalComponent?: boolean,
  setNewTriggeredFromExternalComponent?: (value: boolean) => void,
  idSourceItemTriggeredFromExternalComponent?: RemoteSourceItemData,
}

export const TrackingItemsFormElements = ({ onCleanElementToEdit, elementToEdit, onAddResponse, onUpdateResponse, newTriggeredFromExternalComponent, setNewTriggeredFromExternalComponent, idSourceItemTriggeredFromExternalComponent }: TrackingItemsFormElementsProps) => {

  const emptyElementData = {
    idSource: {} as RemoteSourceData,
    idSourceItem: {} as RemoteSourceItemData,
    copySourceItem: {} as RemoteSourceItemData,
    date: new Date(),
    stock: 1,
    price: 0
  };

  const emptyDisplayData = {
    price: { validation: validatePriceInput, initValue: '$0.0' },
    stock: { validation: validateFloatQuantity, initValue: '1' },
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

  // InventoryItemElements

  const { sourceItems, fetchSourceItems } = SourceItemElements({ refresh: false, setRefresh: () => {} });

  interface Option {
    value: RemoteSourceItemData;
    label: string;
    image: string;
  }
  const [sourceItemOptions, setSourceItemOptions] = useState<Option[]>([]);

  useEffect(() => {
    setSourceItemOptions([
      { value: {} as RemoteSourceItemData, label: 'Seleccione un ítem', image: '' },
      ...sourceItems.map(sourceItem => ({
        value: sourceItem,
        label: sourceItem.name,
        image: sourceItem.image
      }))
    ]);
  }, [sourceItems]);

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
  };

  const handleCancel = () => {
    setValidators(emptyDisplayData);
  };

  const onSubmitTrackingItem = async () => {
    const response = await handleSubmitWithResponse();
    if (submitAction === 'create') {
      onAddResponse(response);
    } else if (submitAction === 'update') {
      onUpdateResponse(response);
    }
  }

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
    apiCreate: createTrackingItem,
    apiUpdate: updateTrackingItem,
    newTriggeredFromExternalComponent,
    setNewTriggeredFromExternalComponent,
    validators,
  });

  useEffect(() => {
    fetchSourceItems();
    if (!elementToEdit) {
      setValidators(emptyDisplayData);
    }
    if (!elementToEdit && idSourceItemTriggeredFromExternalComponent) {
      setFormData((prevData: any) => ({
        ...prevData,
        idSourceItem: idSourceItemTriggeredFromExternalComponent,
        idSource: idSourceItemTriggeredFromExternalComponent.idSource,
        price: idSourceItemTriggeredFromExternalComponent.price
      }));
      const newValidators = {
        price: { validation: validatePriceInput, initValue: `$${idSourceItemTriggeredFromExternalComponent.price}` },
        stock: { validation: validateFloatQuantity, initValue: `1` },
      };
      setValidators(newValidators);
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof formData.idSourceItem.idSource === 'string') {
      getSourceById(formData.idSourceItem.idSource)
        .then((response) => {
          setFormData((prevData: any) => ({
            ...prevData,
            idSource: response.data,
            price: formData.idSourceItem.price,
            copySourceItem: formData.idSourceItem
          }));
          displayData.price = `$${formData.idSourceItem.price}`;
        })
        .catch((error) => {
          console.error('Error fetching source:', error);
        });
    }
    else {
      setFormData((prevData: any) => ({
        ...prevData,
        idSource: formData.idSourceItem.idSource,
        price: formData.idSourceItem.price,
        copySourceItem: formData.idSourceItem
      }));
      displayData.price = `$${formData.idSourceItem.price}`;
    }
  }, [formData.idSourceItem]);

  useEffect(() => {
    setFormData((prevData: any) => ({
      ...prevData,  
      copySourceItem: {
        ...prevData.copySourceItem,
        price: formData.price
      }
    }));
  }, [formData.price]);

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

    onSubmitTrackingItem,

    sourceItemOptions,
    handleChangeDate,
  };
}
