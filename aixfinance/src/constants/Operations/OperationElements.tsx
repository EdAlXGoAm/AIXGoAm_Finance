import React, { useState, useEffect } from 'react';
import { RemoteOperationModel, OperationModel, OperationData,
         getOperations, deleteOperation } from '../../services/apiOperations';
import { toISOStringLocal } from '../../utils/dateUtils';

interface OperationElementsProps {
}

export const OperationElements = ({ }: OperationElementsProps) => {

  const [operations, setOperations] = useState<RemoteOperationModel[]>([]);
  const [isLoadingOperations, setIsLoadingOperations] = useState(true);
  const [refreshOperations, setRefreshOperations] = useState(false);

  const fetchOperations = async () => {
    setIsLoadingOperations(true);
    const res = await getOperations();
    setOperations(res.data);
    setIsLoadingOperations(false);
  }
  
  const RemoteOperationModelToModel = (operation: RemoteOperationModel): OperationModel => {
    return {
      _id: operation._id,
      data: {
        date: operation.date,
        type: operation.type,
        name: operation.name,
        amount: operation.amount,
        description: operation.description,
        account: operation.account,
        deferred: operation.deferred,
        installments: operation.installments,
        preRelatedOperations: operation.preRelatedOperations,
        preAmount: operation.preAmount,
        postRelatedOperations: operation.postRelatedOperations,
        postAmount: operation.postAmount,
        operationAmount: operation.operationAmount,
        amountToShow: operation.amountToShow,
      }
    }
  }

  const [elementToEditOperation, setElementToEditOperation] = useState<OperationModel | null>(null);

  const onCleanOperation = () => {
    setElementToEditOperation(null);
  }

  const onEditOperation = (operation: RemoteOperationModel) => {
    setElementToEditOperation(RemoteOperationModelToModel(operation));
  }

  const onDeleteOperation = (id: string) => {
    deleteOperation(id);
    setOperations((prev) => prev.filter((operation) => operation._id !== id));
  }

  const onRefreshOperations = () => {
    setRefreshOperations((prev) => !prev);
  }

  return {
    operations, setOperations,
    isLoadingOperations,
    refreshOperations,
    fetchOperations,
    elementToEditOperation, setElementToEditOperation,
    onCleanOperation,
    onEditOperation,
    onDeleteOperation,
    onRefreshOperations
  }
}
