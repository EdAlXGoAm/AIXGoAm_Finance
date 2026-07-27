import React, { useState } from 'react';
import { Table, TableRow, TableCell, TableHead, TableBody, TableSortLabel, colors } from '@mui/material';
import { ItemModel, RemoteItemData } from '@/services/apiItems';
import DateTable from '@/constants/Operations/Table/DateTable';
import { TextLine } from '@/utils/textUtils';
import { Paragraph } from '@/utils/textUtils';
import { FaButtonDelete, FaButtonEdit } from '@/utils/buttonUtils';
import { FaButton } from '@/utils/buttonUtils';

interface ItemTableProps {
  items: RemoteItemData[];
  onEditItem: (item: ItemModel, formulas: Map<string, string>) => void;
  onDeleteItem: (id: string) => void;
  RemoteItemDataToModel: (remoteItem: RemoteItemData) => ItemModel;
}

const ItemTable: React.FC<ItemTableProps> = ({ items, onEditItem, onDeleteItem, RemoteItemDataToModel }) => {

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('date');

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedItems = items.slice().sort((a: RemoteItemData, b: RemoteItemData) => {
    let comparator = 0;
    if (orderBy === 'date') {
      comparator = new Date(a.datePurchase).getTime() - new Date(b.datePurchase).getTime();
    }
    else if (orderBy === 'name') {
      comparator = a.name.localeCompare(b.name);
    }
    else if (orderBy === 'amount') {
      comparator = a.itemAmount - b.itemAmount;
    }
    return order === 'asc' ? comparator : -comparator;
  });

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <TableSortLabel
              active={orderBy === 'date'}
              direction={orderBy === 'date' ? order : 'asc'}
              onClick={() => handleSort('date')}
            >
              Fecha
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === 'name'}
              direction={orderBy === 'name' ? order : 'asc'}
              onClick={() => handleSort('name')}
            >
              Nombre
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === 'amount'}
              direction={orderBy === 'amount' ? order : 'asc'}
              onClick={() => handleSort('amount')}
            >
              Monto
            </TableSortLabel>
          </TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedItems.map((item, index) => (
          <TableRow key={index}>
            <TableCell><DateTable date={item.datePurchase} /></TableCell>
            <TableCell>
              <Paragraph>
                <TextLine variable="Nombre">
                  {item.name}
                </TextLine>
                <TextLine variable="Descripción">
                  {item.description}
                </TextLine>
                <TextLine variable="Cantidad">
                  {item.quantity}
                </TextLine>
                <TextLine variable="Peso">
                  {item.weight}
                </TextLine>
                <TextLine variable="Volumen">
                  {item.volume}
                </TextLine>
              </Paragraph>
            </TableCell>
            <TableCell>
              <Paragraph>
                <TextLine variable="Monto">
                  {item.itemAmount}
                </TextLine>
                  <TextLine variable="Tipo de Monto">
                  {item.amountType}
                </TextLine>
                <TextLine variable="Pre-Monto">
                  {item.preAmount}
                </TextLine>
                <TextLine variable="Post-Monto">
                  {item.finalAmount}
                </TextLine>
              </Paragraph>
            </TableCell>
            <TableCell>
              <FaButton
                onClick={() => onEditItem(RemoteItemDataToModel(item), new Map())}
                beforeColor={colors.grey[500]}
                afterColor={colors.blue[700]}
              >
                <FaButtonEdit />
              </FaButton>
              <FaButton
                onClick={() => onDeleteItem(item.idSourceTransaction)}
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

export default ItemTable;
