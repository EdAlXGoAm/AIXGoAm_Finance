import React, { useState, useEffect, useRef } from 'react';
import { OperationModel, createOperation, updateOperation } from '../../services/apiOperations';
import { RelatedOperationData, getRelatedOperation, RemoteRelatedOperationData, deleteRelatedOperation, getRelatedOperations } from '../../services/apiRelatedOperations';
import { toISOStringLocal } from '../../utils/dateUtils';

interface OperationFormElementsProps {
  onCleanElement: () => void,
  onRefreshOperations: () => void,
  elementToEdit?: OperationModel,
  relatedOperationIds: string[];
  setRelatedOperationIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const OperationFormElements = ({ onCleanElement, onRefreshOperations, elementToEdit, relatedOperationIds, setRelatedOperationIds }: OperationFormElementsProps) => {

  const emptyElementData = {
    date: new Date(),
    type: "Gasto",
    name: "Desconocido",
    amount: 0,
    description: "",
    account: "",
    deferred: false,
    installments: 0,
    preRelatedOperations: [] as RemoteRelatedOperationData[],
    preAmount: 0,
    postRelatedOperations: [] as RemoteRelatedOperationData[],
    postAmount: 0,
    operationAmount: 0,
    amountToShow: "operationAmount",
  };

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState(emptyElementData);

  const handleClose = () => {
    setError(null)
    setIsOpen(false);
    setFormData(emptyElementData);
    onCleanElement();
    setRelatedOperationIds([]);
    setDisplayAmount('$0.00');
  }

  const handleCancel = () => {
    if (elementToEdit === undefined)
      tableDeleteRelatedOperation();
    handleClose();
  }

  const [displayAmount, setDisplayAmount] = useState('$0.00');

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayAmount(e.target.value);
    try {
      setFormData((prevData) => ({ ...prevData, amount: parseFloat(e.target.value.replace(/\$/g, '')) }));
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "date") {
      const time = toISOStringLocal(formData.date).split('T')[1].slice(0, 5)
      setFormData((prevData) => ({ ...prevData, [name]: new Date(value + 'T' + time) }));
    } else if (name === "time") {
      const date = toISOStringLocal(formData.date).split('T')[0]
      setFormData((prevData) => ({ ...prevData, ["date"]: new Date(date + 'T' + value) }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleChangeCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
    setLoading(true);
    try {
      let preAmount = formData.amount;
      let operationAmount = formData.amount;
      formData.preRelatedOperations.forEach((relatedOperation) => {
        operationAmount -= relatedOperation.amount;
      });
      let postAmount = operationAmount;
      formData.postRelatedOperations.forEach((relatedOperation) => {
        postAmount -= relatedOperation.amount;
      });
      const newFormData = {
        ...formData,
        preAmount: preAmount,
        operationAmount: operationAmount,
        postAmount: postAmount
      };
      if(elementToEdit) {
        await updateOperation(elementToEdit._id, newFormData);
      } else {
        await createOperation(newFormData);
      }
      handleClose();
      onRefreshOperations();
    } catch (error: any) {
      setError(error.message || 'Error al agregar la operación');
    } finally {
      setLoading(false);
    }
  };

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
    formulas.set('amount', formData.amount.toFixed(2));
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
    let preAmount = formData.amount;
    let operationAmount = formData.amount;
    preRelatedOperations.forEach((relatedOperation) => {
      operationAmount -= relatedOperation.amount;
    });
    let postAmount = operationAmount;
    postRelatedOperations.forEach((relatedOperation) => {
      postAmount -= relatedOperation.amount;
    });
    setFormData((prev) => ({
      ...prev,
      preRelatedOperations: preRelatedOperations,
      postRelatedOperations: postRelatedOperations,
      preAmount: preAmount,
      operationAmount: operationAmount,
      postAmount: postAmount
    }));
  }

  const tableDeleteRelatedOperation = async () => {
    await Promise.all(relatedOperationIds.map(async (id) => {
      await deleteRelatedOperation(id);
    }));
    setRelatedOperationIds([]);
  }


  return {
    displayAmount, setDisplayAmount,
    emptyElementData,
    isOpen, setIsOpen,
    error, setError,
    loading, setLoading,
    formData, setFormData,
    handleChange,
    handleChangeCheckbox,
    handleSubmit,
    handleCancel,
    handleFocus,
    handleFocusAmount,
    handleBlur,
    getFormulas,
    tableGetRelatedOperations,
    tableDeleteRelatedOperation,
    RemoteRelatedOperationDataToModel,
    handleChangeAmount
  }
}