import { SourceModel, createSource, updateSource, RemoteSourceData } from '../../services/apiSource';
import { RemoteCartItemData } from '../../services/apiCartItem';
import { RemoteTrackingItemData } from '@/services/apiTrackingItem';
import { RemoteInventoryItemData } from '@/services/apiSourceItem';
import { RemotePurchaseItemStoryData } from '@/services/apiPurchaseItemStory';
import { FloatingFormElements } from '../../commonForm/floatingFormElements';
interface SourceFormElementsProps {
  onCleanElementToEdit: () => void,
  elementToEdit?: SourceModel,
  onAddResponse: (remoteSource: RemoteSourceData) => void,
  onUpdateResponse: (remoteSource: RemoteSourceData) => void,
  newTriggeredFromExternalComponent?: boolean,
  setNewTriggeredFromExternalComponent?: (value: boolean) => void,
}

export const SourceFormElements = ({ onCleanElementToEdit, elementToEdit, onAddResponse, onUpdateResponse, newTriggeredFromExternalComponent, setNewTriggeredFromExternalComponent }: SourceFormElementsProps) => {

  const emptyElementData = {
    name: 'Desconocido',
    description: '',
    image: '',
    itemsCart: [] as RemoteCartItemData[],
    itemsTracking: [] as RemoteTrackingItemData[],
    itemsInventory: [] as RemoteInventoryItemData[],
    purchaseHistory: [] as RemotePurchaseItemStoryData[]
  };

  const onSubmitSource = async () => {
    const response = await handleSubmitWithResponse();
    console.log('response', response);
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
  } = FloatingFormElements({
    onCleanElementToEdit,
    elementToEdit,
    emptyElementData,
    apiCreate: createSource,
    apiUpdate: updateSource,
    newTriggeredFromExternalComponent,
    setNewTriggeredFromExternalComponent,
  });

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
    onSubmitSource,
  };
}
