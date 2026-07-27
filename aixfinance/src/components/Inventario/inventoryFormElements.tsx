import React, { useState, useEffect } from 'react';
import { InventoryModel, createInventory, updateInventory, RemoteInventoryData } from '@/services/Inventario/apiInventory';
import { FloatingFormElements } from '@/commonForm/floatingFormElements';

interface InventoryFormElementsProps {
  onCleanElementToEdit: () => void,
  elementToEdit?: InventoryModel,
  onAddResponse: (response: RemoteInventoryData) => void,
  onUpdateResponse: (response: RemoteInventoryData) => void,
  newTriggeredFromExternalComponent: boolean;
  setNewTriggeredFromExternalComponent: (value: boolean) => void;
}

export const InventoryFormElements = ({
  onCleanElementToEdit,
  elementToEdit,
  onAddResponse,
  onUpdateResponse,
  newTriggeredFromExternalComponent,
  setNewTriggeredFromExternalComponent,
}: InventoryFormElementsProps) => {

  const emptyElementData = {
    name: '',
    description: '',
    image: '',
    type: '',
    categories: [] as string[],
    categoriesWarningRules: [] as string[],
    warningItems: [] as string[],
  };

  const onSubmitInventory = async () => {
    const response = await handleSubmitWithResponse();
    if (submitAction === 'create') {
      onAddResponse(response);
    } else if (submitAction === 'update') {
      onUpdateResponse(response);
    }
  };

  const {
    isOpen,
    error, setError,
    loadingSubmit, setLoadingSubmit,
    formData, setFormData,
    submitAction, setSubmitAction,
    overlayRef,
    modalRef,
    handleCreateNewElement,
    handleClose,
    handleChangeTextAndSelect,
    handleSubmitWithResponse,
  } = FloatingFormElements({
    onCleanElementToEdit,
    emptyElementData,
    elementToEdit,
    apiCreate: createInventory,
    apiUpdate: updateInventory
  });

  useEffect(() => {
    console.log('formDataInventory', formData);
  }, [isOpen]);

  return {
    isOpen,
    error, setError,
    loadingSubmit, setLoadingSubmit,
    formData, setFormData,
    submitAction, setSubmitAction,
    overlayRef,
    modalRef,
    handleCreateNewElement,
    handleClose,
    handleChangeTextAndSelect,
    handleSubmitWithResponse,

    onSubmitInventory,
  };
};
