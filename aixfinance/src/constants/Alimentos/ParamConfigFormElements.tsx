import { ParamConfigModel, createParamConfig, updateParamConfig, RemoteParamConfigData } from '../../services/apiParamConfig';
import { FloatingFormElements } from '../../commonForm/floatingFormElements';

interface ParamConfigFormElementsProps {
  onCleanElementToEdit: () => void,
  elementToEdit?: ParamConfigModel,
  onAddResponse: (response: RemoteParamConfigData) => void,
  onUpdateResponse: (response: RemoteParamConfigData) => void,
}

export const ParamConfigFormElements = ({
  onCleanElementToEdit,
  elementToEdit,
  onAddResponse,
  onUpdateResponse,
}: ParamConfigFormElementsProps) => {

  const emptyElementData = {
    quantity_unit: "pz",
    weight_unit: "gr",
    volume_unit: "l",
    time_unit: "min",
    default_unit: "quantity_unit",
    reference_unit: "quantity_unit",
    states_list: ["Nuevo", "Abierto", "Consumido", "Deshechado"],
  };

  const {
    isOpen,
    error, setError,
    loadingSubmit, setLoadingSubmit,
    loadingForm, setLoadingForm,
    formData, setFormData,
    submitAction, setSubmitAction,
    overlayRef,
    modalRef,
    handleCreateNewElement,
    handleClose,
    handleChangeTextAndSelect,
    handleChangeList,
    handleAddListItem,
    handleRemoveListItem,
    handleSubmitWithResponse,
  } = FloatingFormElements({
    onCleanElementToEdit,
    elementToEdit,
    emptyElementData,
    apiCreate: createParamConfig,
    apiUpdate: updateParamConfig,
  });

  const onSubmitParamConfig = async () => {
    try {
      const response = await handleSubmitWithResponse();
      if (submitAction === 'create') {
        onAddResponse(response);
      } else if (submitAction === 'update') {
        onUpdateResponse(response);
      }
    } catch (error: any) {
      setError(error.message || 'Error al agregar el elemento');
    }
  }

  return {
    isOpen,
    error, setError,
    loadingSubmit, setLoadingSubmit,
    loadingForm, setLoadingForm,
    formData, setFormData,
    submitAction, setSubmitAction,
    overlayRef,
    modalRef,
    handleCreateNewElement,
    handleClose,
    handleChangeTextAndSelect,
    handleChangeList,
    handleAddListItem,
    handleRemoveListItem,
    handleSubmitWithResponse,
    onSubmitParamConfig,
  }
}
