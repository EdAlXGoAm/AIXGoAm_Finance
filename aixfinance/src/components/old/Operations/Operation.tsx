import React, {  useEffect } from 'react';
import { Container } from '../../utils/utils';
import { OperationElements } from '@/constants/Operations/OperationElements';
import OperationForm from './OperationForm';
import RelatedOperationForm from '../RelatedOperations/RelatedOperationForm';
import { RelatedOperationElements } from '@/constants/Operations/RelatedOperationElements';
import OperationTable from '@/components/Operations/OperationTable';

interface OperationProps {
}

const Operation: React.FC<OperationProps> = ({}) => {
  const {
    operations,
    isLoadingOperations,
    refreshOperations,
    fetchOperations,
    elementToEditOperation,
    onCleanOperation,
    onEditOperation,
    onDeleteOperation,
    onRefreshOperations
  } = OperationElements({});

  useEffect(() => {
    fetchOperations();
  }, []);

  useEffect(() => {
    fetchOperations();
  }, [refreshOperations]);

  useEffect(() => {
  }, [operations]);

  const {
    refreshItemsOperations,
    elementToEditItem,
    isOpenRelatedOperationForm, setIsOpenRelatedOperationForm,
    relatedOperationType,
    formulas,
    relatedOperationIds, setRelatedOperationIds,
    onCleanRelatedOperation,
    onAddRelatedOperation,
    onEditRelatedOperation,
    onDeleteRelatedOperation,
    onCreateRelatedOperationId,
    onRefreshRelatedOperations
  } = RelatedOperationElements({});

  return (
    <Container>
      <OperationTable
        operations={operations}
        isLoadingOperations={isLoadingOperations}
        onEditOperation={onEditOperation}
        onDeleteOperation={onDeleteOperation}
      />
      <OperationForm
        elementToEdit={elementToEditOperation || undefined}
        onCleanElement={onCleanOperation}
        onRefreshOperations={onRefreshOperations}
        
        relatedOperationIds={relatedOperationIds}
        setRelatedOperationIds={setRelatedOperationIds}
        onAddRelatedOperation={onAddRelatedOperation}
        onEditRelatedOperation={onEditRelatedOperation}
        onDeleteRelatedOperation={onDeleteRelatedOperation}
        refreshRelatedOperations={refreshRelatedOperations}
      />
      <RelatedOperationForm
        elementToEdit={elementToEditRelatedOperation || undefined}
        onCleanData={onCleanRelatedOperation}

        isOpenExternal={isOpenRelatedOperationForm}
        setIsOpenExternal={setIsOpenRelatedOperationForm}
        
        relatedOperationType={relatedOperationType}
        formulas={formulas}
        onCreateRelatedOperationId={onCreateRelatedOperationId}
        onRefreshRelatedOperations={onRefreshRelatedOperations}
      />
    </Container>
  );
}

export default Operation;
