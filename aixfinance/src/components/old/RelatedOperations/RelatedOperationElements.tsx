import { useState } from 'react';
import { RelatedOperationModel, RemoteRelatedOperationData } from '@/services/apiRelatedOperations';
import { getRelatedOperations, deleteRelatedOperation } from '@/services/apiRelatedOperations';

interface RelatedOperationElementsProps {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const RelatedOperationElements = ({ refresh, setRefresh }: RelatedOperationElementsProps) => {

  const [elementToEditRelatedOperation, setElementToEditRelatedOperation] = useState<RelatedOperationModel | undefined>(undefined);

  const onCleanDataRelatedOperation = () => {
    setElementToEditRelatedOperation(undefined);
  };

  const [relatedOperationType, setRelatedOperationType] = useState<string>("Pre");
  const [formulasRelatedOperation, setFormulasRelatedOperation] = useState<Map<string, string>>(new Map());

  const onCreateRelatedOperationId = (id: string) => {
    console.log('id', id);
  };

  const onRefreshRelatedOperations = () => {
    setRefresh(!refresh);
  };

  const RemoteRelatedOperationDataToModel = (remoteRelatedOperation: RemoteRelatedOperationData) => {
    return {
      _id: remoteRelatedOperation._id,
      data: {
        date: remoteRelatedOperation.date,
        type: remoteRelatedOperation.type,
        amountType: remoteRelatedOperation.amountType,
        name: remoteRelatedOperation.name,
        amount: remoteRelatedOperation.amount,
        source: remoteRelatedOperation.source,
        formula: remoteRelatedOperation.formula
      }
    }
  };

  const [relatedOperations, setRelatedOperations] = useState<RemoteRelatedOperationData[]>([]);

  const fetchRelatedOperations = async () => {
    const response = await getRelatedOperations();
    setRelatedOperations(response.data);
  };


  const onEditRelatedOperation = (element: RelatedOperationModel, formulas: Map<string, string>) => {
    setElementToEditRelatedOperation(element);
    setFormulasRelatedOperation(formulas);
  };

  const onDeleteRelatedOperation = (id: string) => {
    deleteRelatedOperation(id);
    setRelatedOperations((prev) => {
      const newRelatedOperations = prev.filter((relatedOperation) => relatedOperation._id !== id);
      onRefreshRelatedOperations();
      return newRelatedOperations;
    });
  };

  return {
    elementToEditRelatedOperation, setElementToEditRelatedOperation,
    onCleanDataRelatedOperation,
    relatedOperationType,
    formulasRelatedOperation,
    onCreateRelatedOperationId,
    onRefreshRelatedOperations,
    RemoteRelatedOperationDataToModel,
    relatedOperations, fetchRelatedOperations,
    onEditRelatedOperation,
    onDeleteRelatedOperation
  }
}