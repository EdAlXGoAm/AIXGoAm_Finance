import React, { useEffect, useState } from 'react';
import { Table, TableRow, TableCell, TableHead, TableBody, TableSortLabel, IconButton } from '@mui/material';
import { PurchaseItemStoryModel, RemotePurchaseItemStoryData } from '@/services/apiPurchaseItemStory';
import DateTable from '@/constants/Operations/Table/DateTable';
import { TextLine } from '@/utils/textUtils';
import { FaButtonDelete, FaButtonEdit } from '@/utils/buttonUtils';
import PurchaseTableElement from './PurchaseTableElement';
import PurchaseTableGraph from './PurchaseTableGraph';
import PurchaseTableElementCantidad from './PurchaseTableElementCantidad';

interface PurchaseItemStoryTableProps {
  purchaseItemStories: RemotePurchaseItemStoryData[];
  onEditPurchaseItemStory: (purchaseItemStory: PurchaseItemStoryModel) => void;
  onDeletePurchaseItemStory: (id: string) => void;
  purchaseItemStoryDataToModel: (remotePurchaseItemStory: RemotePurchaseItemStoryData) => PurchaseItemStoryModel;
}

const PurchaseItemStoryTable: React.FC<PurchaseItemStoryTableProps> = ({
  purchaseItemStories,
  onEditPurchaseItemStory,
  onDeletePurchaseItemStory,
  purchaseItemStoryDataToModel
}) => {

  const handleEditPurchaseItemStory = (purchaseItemStory: PurchaseItemStoryModel) => {
    onEditPurchaseItemStory(purchaseItemStory);
  }

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('date');

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const [sortedPurchaseItemStories, setSortedPurchaseItemStories] = useState<RemotePurchaseItemStoryData[]>(purchaseItemStories);

  useEffect(() => {
    setSortedPurchaseItemStories(purchaseItemStories.slice().sort((a, b) => {
      let comparator = 0;
      if (orderBy === 'date') {
        comparator = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (orderBy === 'quantity') {
        comparator = a.quantity - b.quantity;
      } else if (orderBy === 'inventory') {
        comparator = a.idInventory.localeCompare(b.idInventory);
      }
      return order === 'asc' ? comparator : -comparator;
    }));
  }, [purchaseItemStories, orderBy, order]);

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
            sortDirection={orderBy === 'item' ? order : false}
            onClick={() => handleSort('item')}
          >
            <TableSortLabel
              active={orderBy === 'item'}
              direction={orderBy === 'item' ? order : 'asc'}
            >
              Costo
            </TableSortLabel>
          </TableCell>
          <TableCell
            sortDirection={orderBy === 'inventory' ? order : false}
            onClick={() => handleSort('inventory')}
          >
            <TableSortLabel
              active={orderBy === 'inventory'}
              direction={orderBy === 'inventory' ? order : 'asc'}
            >
              Inventario
            </TableSortLabel>
          </TableCell>
          <TableCell>Consumo</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedPurchaseItemStories.map((story) => (
          <TableRow key={story._id}>
            <TableCell>
              <DateTable date={story.date} />
            </TableCell>
            <TableCell>
              <TextLine variable="Item">
                {story.idInventoryItem.name}
              </TextLine>
              <TextLine variable="Cantidad">
                <PurchaseTableElementCantidad story={story} copyInventoryItem={story.copyInventoryItem} />
                <span style={{ fontSize: '0.8em' }}>&nbsp;&nbsp;{`($${story.consumptionCost.toFixed(2)} c/u)`}</span>
              </TextLine>
              {story.discount > 0 && (
                <React.Fragment>
                  <TextLine variable="Costo">
                    {`$${story.consumptionCost.toFixed(2)}`}
                  </TextLine>
                  <TextLine variable="Descuento">
                    {`$${story.discount.toFixed(2)}`}
                  </TextLine>
                </React.Fragment>
              )}
              <TextLine variable="Costo Final">
                {`$${story.totalPrice.toFixed(2)}`}
              </TextLine>
            </TableCell>
            <TableCell>
              <TextLine variable="Inventario">
                {story.idInventory}
              </TextLine>
              <TextLine variable="">
              &nbsp;
              </TextLine>
              <PurchaseTableElement story={story} copySourceItem={story.copySourceItem} />
            </TableCell>
            <TableCell>
              {(story.measureType === 'consumption' || story.measureType === 'usage') && (
                <PurchaseTableGraph story={story} copyInventoryItem={story.copyInventoryItem} measureType={story.measureType} />
              )}
            </TableCell>
            <TableCell>
              <IconButton onClick={() => handleEditPurchaseItemStory(purchaseItemStoryDataToModel(story))}>
                <FaButtonEdit />
              </IconButton>
              <IconButton onClick={() => onDeletePurchaseItemStory(story._id)}>
                <FaButtonDelete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PurchaseItemStoryTable;
