import { useState } from "react";
import { getRelatedOperations, RelatedOperationModel, deleteRelatedOperation, RemoteRelatedOperationData, getRelatedOperation } from "../../services/apiRelatedOperations";

interface RelatedOperationElementsProps {
}

export const RelatedOperationElements = ({ }: RelatedOperationElementsProps) => {
  
  const [refreshRelatedOperations, setRefreshRelatedOperations] = useState(false);
  
  const [elementToEditRelatedOperation, setElementToEditRelatedOperation] = useState<RelatedOperationModel | null>(null);
  const [isOpenRelatedOperationForm, setIsOpenRelatedOperationForm] = useState(false);
  const [relatedOperationType, setRelatedOperationType] = useState<string>("Pre");
  const [formulas, setFormulas] = useState<Map<string, string>>(new Map());
  const [relatedOperationIds, setRelatedOperationIds] = useState<string[]>([]);

  const onCleanRelatedOperation = () => {
    setElementToEditRelatedOperation(null);
  }

  const onAddRelatedOperation = (type: string, formulas: Map<string, string>) => {
    setRelatedOperationType(type);
    setIsOpenRelatedOperationForm(true);
    setFormulas(formulas);
  }

  const onEditRelatedOperation = (element: RelatedOperationModel, formulas: Map<string, string>) => {
    setElementToEditRelatedOperation(element);
    setIsOpenRelatedOperationForm(true);
    setFormulas(formulas);
  }
  const onDeleteRelatedOperation = (id: string) => {
    deleteRelatedOperation(id);
    setRelatedOperationIds((prev) => prev.filter((idToDelete) => idToDelete !== id));
    setRefreshRelatedOperations((prev) => !prev);
  }

  const onCreateRelatedOperationId = (id: string) => {
    setRelatedOperationIds((prev) => [...prev, id]);
  }

  const onRefreshRelatedOperations = () => {
    setRefreshRelatedOperations((prev) => !prev);
  }

  return {
    refreshRelatedOperations, setRefreshRelatedOperations,
    elementToEditRelatedOperation, setElementToEditRelatedOperation,
    isOpenRelatedOperationForm, setIsOpenRelatedOperationForm,
    formulas, setFormulas,
    relatedOperationType, setRelatedOperationType,
    relatedOperationIds, setRelatedOperationIds,
    onCleanRelatedOperation,
    onAddRelatedOperation,
    onEditRelatedOperation,
    onDeleteRelatedOperation,
    onCreateRelatedOperationId,
    onRefreshRelatedOperations
  }
}

