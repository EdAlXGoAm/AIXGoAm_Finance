import React, { useState } from 'react';
import { Table, TableRow, TableCell, TableHead, TableBody, TableSortLabel, colors } from '@mui/material';
import { RemoteOperationModel } from '@/services/apiOperations';
import { toISOStringLocal } from '@/utils/dateUtils';
import ActionButtonsTable from '../../constants/Operations/Table/ActionButtonsTable';
import DateTable from '../../constants/Operations/Table/DateTable';
import { TextLine } from '@/utils/textUtils';
import { Paragraph } from '@/utils/textUtils';
import { CodeContainer } from '../CodeContainer';
interface OperationTableProps {
  operations: RemoteOperationModel[];
  isLoadingOperations: boolean;
  onEditOperation: (operation: RemoteOperationModel) => void;
  onDeleteOperation: (id: string) => void;
}


const OperationTable: React.FC<OperationTableProps> = ({operations, isLoadingOperations, onEditOperation, onDeleteOperation}) => {

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('date');
  
  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const sortedOperations = operations.slice().sort((a: RemoteOperationModel, b: RemoteOperationModel) => {
    let comparator = 0;
    if (orderBy === 'date') {
      comparator = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (orderBy === 'name') {
      comparator = a.name.localeCompare(b.name);
    } else if (orderBy === 'amount') {
      comparator = a.operationAmount - b.operationAmount;
    }
    return order === 'asc' ? comparator : -comparator;
  });
  
  return (
    <>
    <Table
      size='small'
      >
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
              Título
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
        {isLoadingOperations ? (
          <TableRow>
            <TableCell colSpan={4}>Loading...</TableCell>
          </TableRow>
        ) : (
          sortedOperations.map((operation, i) => (
            <TableRow key={i}>
              <TableCell><DateTable date={operation.date} /></TableCell>
              <TableCell>
                <Paragraph>
                  <TextLine variable="Tipo" fontSize="10px">
                    {operation.type}
                  </TextLine>
                  <TextLine variable="Nombre">
                    {operation.name}
                  </TextLine>
                  <TextLine variable="Cuenta" fontSize="10px">
                    {operation.account}
                  </TextLine>
                  {operation.deferred && <TextLine variable="MSI" fontSize="8px">
                    {operation.installments}
                  </TextLine>}
                  {operation.description && <CodeContainer code={operation.description} maxWidth='80px' fontSize='10px' padding='1px' />}
                </Paragraph>
              </TableCell>
              <TableCell>
                <Paragraph>
                  <TextLine variable="Monto">
                    {`$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(operation.operationAmount)}`}
                  </TextLine>
                  <TextLine variable="Pre" fontSize="10px">
                    {`$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(operation.preAmount)}`}
                  </TextLine>
                  <TextLine variable="Post" fontSize="10px">
                    {`$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(operation.postAmount)}`}
                  </TextLine>
                </Paragraph>
              </TableCell>
              <TableCell>
                <ActionButtonsTable
                  operation={operation}
                  onEditOperation={onEditOperation}
                  onDeleteOperation={onDeleteOperation}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      </Table>
    </>
  )
}

export default OperationTable;
