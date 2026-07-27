import React, { useState } from 'react';
import { Table, TableRow, TableCell, TableHead, TableBody, TableSortLabel, colors } from '@mui/material';
import { RelatedOperationModel, RemoteRelatedOperationData } from '@/services/apiRelatedOperations';
import DateTable from '@/constants/Operations/Table/DateTable';
import { TextLine } from '@/utils/textUtils';
import { Paragraph } from '@/utils/textUtils';
import { CodeContainer } from '@/commonTools/CodeContainer';
import { FaButtonDelete, FaButtonEdit } from '@/utils/buttonUtils';
import { FaButton } from '@/utils/buttonUtils';

interface RelatedOperationsTableProps {
  relatedOperations: RemoteRelatedOperationData[];
  onEditRelatedOperation: (relatedOperation: RelatedOperationModel, formulas: Map<string, string>) => void;
  onDeleteRelatedOperation: (id: string) => void;
  RemoteRelatedOperationDataToModel: (remoteRelatedOperation: RemoteRelatedOperationData) => RelatedOperationModel;
}

const RelatedOperationsTable: React.FC<RelatedOperationsTableProps> = ({ relatedOperations, onEditRelatedOperation, onDeleteRelatedOperation, RemoteRelatedOperationDataToModel }) => {

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('date');

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedRelatedOperations = relatedOperations.slice().sort((a: RemoteRelatedOperationData, b: RemoteRelatedOperationData) => {
    let comparator = 0;
    if (orderBy === 'date') {
      comparator = new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    else if (orderBy === 'name') {
      comparator = a.name.localeCompare(b.name);
    }
    else if (orderBy === 'amount') {
      comparator = a.amount - b.amount;
    }
    return order === 'asc' ? comparator : -comparator;
  });

  return (
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell
            sortDirection={orderBy === 'date' ? order : false}
            onClick={() => handleSort('date')}
          >
            <TableSortLabel
              active={orderBy === 'date'}
              direction={orderBy === 'date' ? order : 'asc'}
            >
              Fecha
            </TableSortLabel>
          </TableCell>
          <TableCell
            sortDirection={orderBy === 'name' ? order : false}
            onClick={() => handleSort('name')}
          >
            <TableSortLabel
              active={orderBy === 'name'}
              direction={orderBy === 'name' ? order : 'asc'}
            >
              Titulo
            </TableSortLabel>
          </TableCell>
          <TableCell
            sortDirection={orderBy === 'amount' ? order : false}
            onClick={() => handleSort('amount')}
          >
            <TableSortLabel
              active={orderBy === 'amount'}
              direction={orderBy === 'amount' ? order : 'asc'}
            >
              Monto
            </TableSortLabel>
          </TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedRelatedOperations.map((relatedOperation, index) => (
          <TableRow key={index}>
            <TableCell><DateTable date={relatedOperation.date} /></TableCell>
            <TableCell>
              <Paragraph>
                <TextLine variable="Tipo" fontSize="10px">
                  {relatedOperation.type}
                </TextLine>
                <TextLine variable="Tipo de Monto" fontSize="10px">
                  {relatedOperation.amountType}
                </TextLine>
                <TextLine variable="Nombre">
                  {relatedOperation.name}
                </TextLine>
                <TextLine variable="Fuente">
                  {relatedOperation.source}
                </TextLine>
              </Paragraph>
            </TableCell>
            <TableCell>
              {relatedOperation.amount}
              {relatedOperation.formula && <CodeContainer code={relatedOperation.formula} maxWidth='80px' />}
            </TableCell>
            <TableCell>
              <FaButton
                onClick={() => onEditRelatedOperation(RemoteRelatedOperationDataToModel(relatedOperation), new Map<string, string>())}
                beforeColor={colors.grey[500]}
                afterColor={colors.blue[700]}
              >
                <FaButtonEdit />
              </FaButton>
              <FaButton
                onClick={() => onDeleteRelatedOperation(relatedOperation._id)}
                beforeColor={colors.grey[500]}
                afterColor={colors.red[700]}
              >
                <FaButtonDelete />
              </FaButton> 
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RelatedOperationsTable;

