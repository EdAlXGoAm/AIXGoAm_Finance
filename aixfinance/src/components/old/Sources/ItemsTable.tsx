import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Table, TableRow, TableCell, TableHead, TableBody, TableSortLabel, colors } from '@mui/material';
import { RemoteSourceItemData, SourceItemModel } from '@/services/apiSourceItem';
import { toISOStringLocal } from '@/utils/dateUtils';
import ActionButtonsItemTable from '../Modules/Source/SourceItem/ActionButtonsSourceItemTable';
import DateTable from '../../constants/Operations/Table/DateTable';
import { TextLine } from '@/utils/textUtils';
import { Paragraph } from '@/utils/textUtils';
import { CodeContainer } from '../CodeContainer';
import styles from '../../commonTable/floatingTable.module.css';
import { FloatingTableElements } from '../../commonTable/floatingTableElements';
import { RemoteSourceData } from '@/services/apiSource';

interface ItemsTableProps {
  items: RemoteSourceItemData[];
  isLoadingItems: boolean;
  onEditItem: (item: RemoteSourceItemData | SourceItemModel) => void;
  onDeleteItem: (id: string) => void;
  mainFilter?: string;
  openTriggeredFromExternalComponent?: boolean;
  setOpenTriggeredFromExternalComponent?: (value: boolean) => void;
  onNewSourceItem?: () => void;
  setIdSourceTriggeredFromExternalComponent?: (value: RemoteSourceData | null) => void;
  setIdSourceItemTriggeredFromExternalComponent: (value: RemoteSourceItemData | null) => void;
  setOpenTrackingItemsTableTriggeredFromExternalComponent: (value: boolean) => void;
  setNewTriggeredPurchaseItemStoryFromExternalComponent: (value: boolean) => void;
} 

const ItemsTable: React.FC<ItemsTableProps> = ({
  items,
  isLoadingItems,
  onEditItem,
  onDeleteItem,
  setIdSourceItemTriggeredFromExternalComponent,
  setOpenTrackingItemsTableTriggeredFromExternalComponent,
  mainFilter,
  openTriggeredFromExternalComponent,
  setOpenTriggeredFromExternalComponent,
  onNewSourceItem,
  setIdSourceTriggeredFromExternalComponent,
  setNewTriggeredPurchaseItemStoryFromExternalComponent
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    isOpen, setIsOpen,
    loadingTable, setLoadingTable,
    order, setOrder,
    orderBy, setOrderBy,
    sortedElements = [],
    overlayRef,
    modalRef,
    handleSort,
    handleClose,
  } = FloatingTableElements({ 
    openTriggeredFromExternalComponent,
    setOpenTriggeredFromExternalComponent,
    elements: items,
    sortedRules: { 
      order: 'asc', 
      orderBy: 'idSource.name',
      elements: items 
    }, 
    sortFunction: (a: any, b: any, orderBy: string, order: 'asc' | 'desc') => {
      const getValue = (obj: any, path: string) => path.split('.').reduce((o, key) => o[key], obj);

      const aValue = getValue(a, orderBy);
      const bValue = getValue(b, orderBy);
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      return 0;
    },
    mainFilter
  });

  // Filtrar los elementos según la consulta de búsqueda
  const filteredElements = useMemo(() => {
    if (!searchQuery) return sortedElements;

    return sortedElements.filter(item => {
      const { providerName, name, description, price } = item;
      const query = searchQuery.toLowerCase();

      return (
        providerName.toLowerCase().includes(query) ||
        name.toLowerCase().includes(query) ||
        (description && description.toLowerCase().includes(query)) ||
        price.toString().includes(query)
      );
    });
  }, [searchQuery, sortedElements]);

  useEffect(() => {
    if (setIdSourceTriggeredFromExternalComponent && !isOpen) {
      setIdSourceTriggeredFromExternalComponent(null);
    }
    if (setIdSourceItemTriggeredFromExternalComponent && !isOpen) {
      setIdSourceItemTriggeredFromExternalComponent(null);
    }
  }, [isOpen]);

  return (
    <React.Fragment>
      
      {isOpen && (
        <div className={styles.overlay} ref={overlayRef}>
          <div className={styles.modal} ref={modalRef} style={{ '--max-width-modal': '800px' } as React.CSSProperties}>
            <button className={styles.closeButton} onClick={handleClose}>
              X
            </button>
            {mainFilter && (
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  onClick={() => {
                    onNewSourceItem && onNewSourceItem();
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Agregar Nuevo Elemento
                </button>
              </div>
            )}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Buscar por proveedor, nombre, descripción o precio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '8px', width: '100%', maxWidth: '400px' }}
              />
            </div>
            <h2>Tabla de Items</h2>
            <Table
              size='small'
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sortDirection={orderBy === 'idSource.name' ? order : false}
                    onClick={() => handleSort('idSource.name')}
                  >
                    <TableSortLabel
                      active={orderBy === 'idSource.name'}
                      direction={orderBy === 'idSource.name' ? order : 'asc'}
                    >
                      Fuente
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
                      Nombre
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === 'price' ? order : false}
                    onClick={() => handleSort('price')}
                  >
                    <TableSortLabel
                      active={orderBy === 'price'}
                      direction={orderBy === 'price' ? order : 'asc'}
                    >
                      Monto
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Acciones</TableCell>
                  <TableCell>
                    Imágen
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingItems ? (
                  <TableRow>
                    <TableCell colSpan={5}>Cargando...</TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredElements.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5}>No se encontraron elementos con la fuente especificada.</TableCell>
                      </TableRow>
                    )}
                    {filteredElements.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Paragraph>
                            <TextLine variable="Fuente">
                              {item.idSource.name}
                            </TextLine>
                          </Paragraph>
                        </TableCell>
                        <TableCell>
                          <Paragraph>
                            <TextLine variable="Nombre">
                              {item.name}
                            </TextLine>
                            <TextLine variable="Proveedor">
                              {item.providerName}
                            </TextLine>
                            {item.description && <CodeContainer code={item.description} maxWidth='80px' fontSize='10px' padding='1px' />}
                          </Paragraph>
                        </TableCell>
                        <TableCell>
                          <Paragraph>
                            <TextLine variable="Precio">
                              {`$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.price)}`}
                            </TextLine>
                          </Paragraph>
                        </TableCell>
                        <TableCell>
                          <ActionButtonsItemTable
                            item={item}
                            onEditItem={() => onEditItem(item)}
                            onDeleteItem={() => onDeleteItem(item._id)}
                            onTrackingItem={() => {
                              setIdSourceItemTriggeredFromExternalComponent(item);
                              setOpenTrackingItemsTableTriggeredFromExternalComponent(true);
                            }}
                            onPurchaseItem={() => {
                              setIdSourceItemTriggeredFromExternalComponent(item);
                              setNewTriggeredPurchaseItemStoryFromExternalComponent(true);
                            }}
                            onAddToCart={() => {
                              null;
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <img src={item.image} alt={item.name}
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default ItemsTable;
