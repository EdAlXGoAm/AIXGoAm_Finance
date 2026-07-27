import React, { useState, useEffect } from 'react';
import { SourceItemModel, createSourceItem, updateSourceItem, RemoteSourceItemData } from '@/services/apiSourceItem';
import { RemoteSourceData } from '@/services/apiSource';
import { SourceElements } from './SourceElements';
import { RemoteParamConfigData } from '@/services/apiParamConfig';
import { validatePriceInput, validateFloatQuantity } from '@/validationFunctions/validateInput';
import { FloatingFormElements } from '@/commonForm/floatingFormElements';
import { getParamConfigById } from '@/services/apiParamConfig';
import { ParamConfigElements } from '../Alimentos/ParamConfigElements';

interface SourceItemFormElementsProps {
  onCleanElementToEdit: () => void,
  elementToEdit?: SourceItemModel,
  onAddResponse: (response: RemoteSourceItemData) => void,
  onUpdateResponse: (response: RemoteSourceItemData) => void,
  newTriggeredFromExternalComponent?: boolean,
  setNewTriggeredFromExternalComponent?: (value: boolean) => void,
  idSourceTriggeredFromExternalComponent?: RemoteSourceData | null,
}

export const SourceItemFormElements = ({ onCleanElementToEdit, elementToEdit, onAddResponse, onUpdateResponse, newTriggeredFromExternalComponent, setNewTriggeredFromExternalComponent, idSourceTriggeredFromExternalComponent }: SourceItemFormElementsProps) => {
  
  // Función de validación para la descripción
  const validateDescriptionInput = (input: string) => {
    if (input.length < 10) { // Ejemplo de validación: mínimo 10 caracteres
      return { valid: false, error: 'La descripción debe tener al menos 10 caracteres.' };
    }
    return { valid: true };
  };

  const emptyDisplayData = {
    price: { validation: validatePriceInput, initValue: '$0.0' },
    quantity: { validation: validateFloatQuantity, initValue: '0' },
    weight: { validation: validateFloatQuantity, initValue: '0' },
    volume: { validation: validateFloatQuantity, initValue: '0' },
    time: { validation: validateFloatQuantity, initValue: '0' },
    description: { validation: validateDescriptionInput, initValue: '' },
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
    idParamConfig: {} as RemoteParamConfigData,
    providerName: '',
    name: 'Desconocido',
    description: '',
    image: '',
    link: '',
    price: 0,
    quantity: 0,
    weight: 0,
    volume: 0,
    time: 0,
  };


  // Sources
  const { sources, fetchSources } = SourceElements({ refresh: false, setRefresh: () => {} });
  
  interface Option {
    value: RemoteSourceData;
    label: string;
    image: string;
  }
  const [sourceOptions, setSourceOptions] = useState<Option[]>([]);
  
  useEffect(() => {
    setSourceOptions([
      { value: {} as RemoteSourceData, label: 'Seleccione una fuente', image: '' },
      ...sources.map(source => ({
        value: source,
        label: source.name,
        image: source.image
      }))
    ]);
  }, [sources]);

  const [refreshParamConfig, setRefreshParamConfig] = useState<boolean>(false);
  const {
    onRefreshParamConfigs,
    elementToEditParamConfig, setElementToEditParamConfig,
    onCleanElementToEditParamConfig,
    onEditElementToEditParamConfig,
    paramConfigs, fetchParamConfigs,
    onCreateParamConfig,
    onUpdateParamConfig,
    onDeleteParamConfig,
    RemoteParamConfigDataToModel,
  } = ParamConfigElements({
    refresh: refreshParamConfig, setRefresh: setRefreshParamConfig,
  });

  const handleCancel = () => {
    if (!elementToEdit && formData.idParamConfig._id) {
      onDeleteParamConfig(formData.idParamConfig._id);
    }
    setValidators(emptyDisplayData);
  };

  const onSubmitSourceItem = async () => {
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
    apiCreate: createSourceItem,
    apiUpdate: updateSourceItem,
    newTriggeredFromExternalComponent,
    setNewTriggeredFromExternalComponent,
    validators,
  });

  useEffect(() => {
    console.log('formDataSourceItem', formData);
    fetchSources();
    if (!elementToEdit && idSourceTriggeredFromExternalComponent) {
      setFormData((prevData: any) => ({ ...prevData, idSource: idSourceTriggeredFromExternalComponent }));
    }
  }, [isOpen]);

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
    sourceOptions,
    elementToEditParamConfig,
    onCleanElementToEditParamConfig,
    onEditElementToEditParamConfig,
    RemoteParamConfigDataToModel,

    onSubmitSourceItem,
  }
};
