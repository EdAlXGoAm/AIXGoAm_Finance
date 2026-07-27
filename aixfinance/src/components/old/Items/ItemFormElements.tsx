import { useState, useEffect } from 'react';
import { ItemModel } from '@/services/apiItems';
import { createItem, updateItem } from '@/services/apiItems';
import { RemoteRelatedOperationData, deleteRelatedOperation, getRelatedOperation } from '@/services/apiRelatedOperations';
import { RemoteCaducidadData } from '@/services/apiCaducidad';
import { RemoteParamConfigData } from '@/services/apiParamConfig';
import { toISOStringLocal } from '@/utils/dateUtils';

interface ItemFormElementsProps {
  onCleanData: () => void,
  elementToEdit?: ItemModel,
  relatedOperationIds: string[],
  setRelatedOperationIds: React.Dispatch<React.SetStateAction<string[]>>,
  setIsOpenExternal: (value: boolean) => void,
}

export const ItemFormElements = ({ onCleanData, elementToEdit, relatedOperationIds, setRelatedOperationIds, setIsOpenExternal }: ItemFormElementsProps) => {
    // tipo de monto - amount_type
    // {
    //  Ingreso
    //  Gasto
    // }
    // etiqueta de articulo - item_label
    // {
    //  Alimento
    //  Consumible
    //  Streaming
    //  Mueble
    //  Servicio
    //  Videojuego
    // }
    // tipo de articulo - item_type
    // {
    //  Servicio
    //  Producto perecedero
    //  Producto consumible
    //  Producto duradero
    // }
    // categoria_de_presupuesto - budget_category
    // {
    //  Necesarios - Basic
    //  Deseos - Desires
    //  Ajenos - External
    //  Filantrópicos - Philanthropic
    //  Inversiones - Investments
    // }
    // proposito - purpose
    // {
    //  Necesidades - Needs
    //  Entrenamiento - Training
    //  Negocio - Business
    //  Viaje - Travel
    //  Regalos - Gifts
    //  Otros - Others
    // }
    // Potencialidad - Potential
    // {
    //  No vendible - Non-sellable
    //  Vendible - Sellable
    //  Invertible - Investible
    // }
    // Razon de potencialidad - Potential reason
    // {
    //  Consumible - Consumable
    //  Perecedero - Perishable
    //  Oferta - Supply
    //  Servicio - Service
    // }

  const emptyItemData = {
    datePurchase: new Date(),
    *name: "",
    *description: "",
    amountType: "",
    preAmount: 0,
    preRelatedOperations: [] as RemoteRelatedOperationData[],
    itemAmount: 0,
    postRelatedOperations: [] as RemoteRelatedOperationData[],
    finalAmount: 0,
    *imageUrl: "",
    // id source transaction
    *idSourceTransaction: "", // TODO: change to RemoteSourceTransactionData
    // categorization
    categorized: false,
    itemLabel: "",
    itemType: "",
    budgetCategory: "",
    purpose: "",
    potential: "",
    potentialReason: "",
    // Quantity
    *quantitized: false,
    *idParamConfig: {} as RemoteParamConfigData, // TODO: change to RemoteParamConfigData
    *quantity: 0,
    *weight: 0,
    *volume: 0,
    // date of expiration
    expires: false,
    idExpiration: {} as RemoteCaducidadData, // TODO: change to RemoteCaducidadData
    // id inventory
    inventorized: false,
    idInventory: "",
    inventoryCategory1: "",
    inventoryCategory2: "",
    inventoryCategory3: "",
    inventoryCategory4: "",
    inventoryCategory5: "",
    // ids consumption history
    idsConsumptionHistory: [] as string[] // TODO: change to RemoteConsumptionHistoryData
  }

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState(emptyItemData);
  
  const handleClose = () => {
    setError(null); 
    setIsOpen(false);
    setFormData(emptyItemData);
    onCleanData();
    setIsOpenExternal(false);
  }

  const handleCancel = () => {
    if (elementToEdit === undefined)
      tableDeleteRelatedOperation();
    handleClose();
  }

  const [displayAmount, setDisplayAmount] = useState('$0.00');

  const handleChangeAmount = (value: string) => {
    setDisplayAmount(value);
    try {
      setFormData((prevData) => ({ ...prevData, itemAmount: parseFloat(value.replace(/\$/g, '')) }));
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'datePurchase') {
      const time = toISOStringLocal(formData.datePurchase).split('T')[1].slice(0, 5)
      setFormData((prevData) => ({ ...prevData, [name]: new Date(value + 'T' + time) }));
    } else if (name === 'time') {
      const date = toISOStringLocal(formData.datePurchase).split('T')[0]
      setFormData((prevData) => ({ ...prevData, ["datePurchase"]: new Date(date + 'T' + value) }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  }

  const handleChangeCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let preAmount = formData.preAmount;
      let itemAmount = formData.itemAmount;
      formData.preRelatedOperations.forEach((relatedOperation) => {
        preAmount -= relatedOperation.amount;
      });
      let finalAmount = itemAmount - preAmount;
      const newFormData = {
        ...formData,
        preAmount: preAmount,
        finalAmount: finalAmount
      };
      if(elementToEdit) {
        await updateItem(elementToEdit._id, newFormData);
      } else {
        await createItem(newFormData);
      }
      handleClose();
    } catch (error: any) {
      setError(error.message || 'Error al agregar el artículo');
    } finally {
      setLoading(false);
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === 'Desconocido') {
      setFormData({ ...formData, name: '' });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === '') {
      setFormData({ ...formData, name: 'Desconocido' });
    }
  };

  const handleFocusAmount = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '$0.00') {
      setDisplayAmount('');
    }
  }

  const getFormulas = () => {
    const formulas = new Map<string, string>();
    formulas.set('preAmount', formData.preAmount.toFixed(2));
    formulas.set('itemAmount', formData.itemAmount.toFixed(2));
    formData.preRelatedOperations.forEach((relatedOperation) => {
      formulas.set(relatedOperation.name, relatedOperation.amount.toFixed(2));
    });
    formData.postRelatedOperations.forEach((relatedOperation) => {
      formulas.set(relatedOperation.name, relatedOperation.amount.toFixed(2));
    });
    return formulas;
  };

  const tableGetRelatedOperations = async () => {
    let remoteRelatedOperations: RemoteRelatedOperationData[] = [];
    await Promise.all(relatedOperationIds.map(async (id) => { 
      const relatedOperation = await getRelatedOperation(id);
      remoteRelatedOperations.push(relatedOperation.data);
    }));
    let preRelatedOperations: RemoteRelatedOperationData[] = [];
    let postRelatedOperations: RemoteRelatedOperationData[] = [];
    remoteRelatedOperations.forEach((relatedOperation) => {
      if(relatedOperation.type === "Pre") {
        preRelatedOperations.push(relatedOperation);
      } else {
        postRelatedOperations.push(relatedOperation);
      }
    });
    let preAmount = formData.preAmount;
    let itemAmount = formData.itemAmount;
    preRelatedOperations.forEach((relatedOperation) => {
      preAmount -= relatedOperation.amount;
    });
    let finalAmount = itemAmount - preAmount;
    postRelatedOperations.forEach((relatedOperation) => {
      finalAmount -= relatedOperation.amount;
    });
    setFormData((prevData) => ({
      ...prevData, 
      preRelatedOperations: preRelatedOperations, 
      postRelatedOperations: postRelatedOperations,
      preAmount: preAmount,
      itemAmount: itemAmount,
      finalAmount: finalAmount
    }));
  }


  const tableDeleteRelatedOperation = async () => {
    await Promise.all(relatedOperationIds.map(async (id) => {
      await deleteRelatedOperation(id);
    }));
    setRelatedOperationIds([]);
  }

  const RemoteRelatedOperationDataToModel = (remoteRelatedOperation: RemoteRelatedOperationData) => {
    return {
      _id: remoteRelatedOperation._id,
      data: {
        date: remoteRelatedOperation.date,
        type: remoteRelatedOperation.type,
        name: remoteRelatedOperation.name,
        amount: remoteRelatedOperation.amount,
        source: remoteRelatedOperation.source,
        formula: remoteRelatedOperation.formula
      }
    }
  }

  return {
    emptyItemData,
    isOpen, setIsOpen,
    error, setError,
    loading, setLoading,
    formData, setFormData,
    handleClose,
    handleCancel,
    tableDeleteRelatedOperation,
  }
}
