import React, { useState } from 'react';
import { Table, TableRow, TableCell, TableHead, TableBody, TableSortLabel, colors } from '@mui/material';
import { InventoryModel, RemoteInventoryData } from '@/services/Inventario/apiInventory';
import { TextLine } from '@/utils/textUtils';
import { Paragraph } from '@/utils/textUtils';
import { FaButtonDelete, FaButtonEdit } from '@/utils/buttonUtils';
import { FaButton } from '@/utils/buttonUtils';

interface InventoryTableProps {
  inventories: RemoteInventoryData[];
  onEditInventory: (inventory: InventoryModel) => void;
  onDeleteInventory: (id: string) => void;
  RemoteInventoryDataToModel: (remoteInventory: RemoteInventoryData) => InventoryModel;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ inventories, onEditInventory, onDeleteInventory, RemoteInventoryDataToModel }) => {

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedInventories = inventories.slice().sort((a, b) => {
    let comparator = 0;
    if (orderBy === 'name') {
      comparator = a.name.localeCompare(b.name);
    } else if (orderBy === 'type') {
      comparator = a.type.localeCompare(b.type);
    }
    return order === 'asc' ? comparator : -comparator;
  });

  return (
    <Table>
      <TableHead>
        <TableRow>
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
              active={orderBy === 'type'}
              direction={orderBy === 'type' ? order : 'asc'}
              onClick={() => handleSort('type')}
            >
              Tipo
            </TableSortLabel>
          </TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedInventories.map((inventory, index) => (
          <TableRow key={index}>
            <TableCell>
              <Paragraph>
                <TextLine variable="Nombre">
                  {inventory.name}
                </TextLine>
                <TextLine variable="Descripción">
                  {inventory.description}
                </TextLine>
              </Paragraph>
            </TableCell>
            <TableCell>{inventory.type}</TableCell>
            <TableCell>
              <FaButton
                onClick={() => onEditInventory(RemoteInventoryDataToModel(inventory))}
                beforeColor={colors.grey[500]}
                afterColor={colors.blue[700]}
              >
                <FaButtonEdit />
              </FaButton>
              <FaButton
                onClick={() => onDeleteInventory(inventory._id)}
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

export default InventoryTable;
