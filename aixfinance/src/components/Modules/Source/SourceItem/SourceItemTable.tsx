import React, { useState, useMemo, useEffect } from 'react';
import { useSource } from '../SourceContext';
import { useSourceItem } from './SourceItemContext';
import { Table, TableRow, TableCell, TableHead, TableBody, TableSortLabel } from '@mui/material';
import { RemoteSourceItemData, RemoteToModel, deleteSourceItem, emptySourceItemFormData } from '@/services/api/source/apiSourceItem';
import { TextLine, Paragraph } from '@/utils/textUtils';
import { CodeContainer } from '@/commonTools/CodeContainer';
import styles from '@/commonTable/floatingTable.module.css';
import { FloatingTableElements } from '@/commonTable/floatingTableElements';
import ActionButtonsSourceItemTable from '@/components/Modules/Source/SourceItem/ActionButtonsSourceItemTable';
import { FrontOverlayContainer, FrontModalContainer, FrontCloseButton } from '@/commonForm/frontContainer';
import { searchBar } from '@/commonTools/Tools';
import Fuse from 'fuse.js';
import { useSourceItemCart } from '@/components/Modules/Source/SourceItem/SourceItemCart/SourceItemCartContext';
import { emptySourceItemCartFormData } from '@/services/api/source/apiSourceItemsCart';

const SourceItemTable: React.FC = () => {
  const {
    setElementToCreateSourceItemCart,
  } = useSourceItemCart();
  const {
    setElementToCreateSourceItem,
    setElementToEditSourceItem,
    sourceItems, setSourceItems,
    selectedSourceItem, setSelectedSourceItem
  } = useSourceItem();
  const {
    selectedSource,
    setSelectedSource,
  } = useSource();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchedSourceItems, setSearchedSourceItems] = useState<RemoteSourceItemData[]>([]);
  
  const [mainFilter, setMainFilter] = useState<string>('');

  useEffect(() => {
    if (selectedSource) {
      setIsOpen(true);
      setMainFilter(selectedSource.name);
    }
  }, [selectedSource]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchedSourceItems(
        sourceItems
          .slice()
          .filter(sourceItem => sourceItem.name)
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(-100)
      );
    } else {
      const fuse = new Fuse(sourceItems, {
        keys: ['name', 'description'],
        threshold: 0.3,
      });
      const results = fuse.search(searchQuery);
      const matchedSourceItems = results.map(result => result.item);
      setSearchedSourceItems(
        matchedSourceItems
          .slice()
          .filter(sourceItem => sourceItem.name)
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(-100)
      );
    }
  }, [searchQuery, sourceItems]);

  interface SortedRule {
    orderBy: string;
    type: 'alphabetically' | 'numerically';
  }

  const sortedRules: SortedRule[] = [
    { orderBy: 'name', type: 'alphabetically' },
    { orderBy: 'price', type: 'numerically' },
    { orderBy: 'id_source.name', type: 'alphabetically' },
  ];

  const {
    isOpen, setIsOpen,
    sortedElements,
    overlayRef,
    modalRef,
    handleClose,
    renderButtonRectangle,
    renderHeaderCellAlphabetically,
    renderHeaderCellNumerically,
  } = FloatingTableElements({
    elements: searchedSourceItems,
    grouped: true,
    mainFilterKey: 'id_source.name',
    mainFilterValue: mainFilter,
    sortedRules,
    onCloseExternalActions: () => setSelectedSource(null),
  });

  return (
    <React.Fragment>
      
      {isOpen && (
        <React.Fragment>
          <FrontOverlayContainer overlayRef={overlayRef}>
            <FrontModalContainer modalRef={modalRef} maxWidth='600px'>
              <FrontCloseButton handleClose={handleClose} />
                {mainFilter && (
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-start' }}>
                    {renderButtonRectangle('Agregar Nuevo Elemento', () => {
                      if (selectedSource) {
                        setElementToCreateSourceItem({
                          ...emptySourceItemFormData,
                          id_source: selectedSource,
                        });
                      }
                    })}
                  </div>
                )}
                {searchBar(searchQuery, setSearchQuery, 'Buscar por proveedor, nombre, descripción o precio...')}
                <h2>Tabla de Items</h2>
                <Table
                  size='small'
                >
                  <TableHead>
                    <TableRow>
                      {renderHeaderCellAlphabetically('Source', 'id_source.name')}
                      {renderHeaderCellAlphabetically('Nombre', 'name')}
                      {renderHeaderCellNumerically('Monto', 'price')}
                      <TableCell>Acciones</TableCell>
                      <TableCell>Imágen</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <>
                      {sortedElements && sortedElements.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5}>No se encontraron elementos con la Source especificada.</TableCell>
                        </TableRow>
                      )}
                      {sortedElements && sortedElements.map((item: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Paragraph>
                              <TextLine variable="Source">
                                {item.id_source.name}
                              </TextLine>
                            </Paragraph>
                          </TableCell>
                          <TableCell>
                            <Paragraph>
                              <TextLine variable="Name">
                                {item.name}
                              </TextLine>
                              <TextLine variable="Proveedor">
                                {item.provider}
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
                            <ActionButtonsSourceItemTable
                              item={item}
                              onEditItem={() => setElementToEditSourceItem(RemoteToModel(item))}
                              onDeleteItem={() => {
                                deleteSourceItem(item._id);
                                setSourceItems(sourceItems.filter(sourceItem => sourceItem._id !== item._id));
                              }}
                              onTrackingItem={() => {
                                setSelectedSourceItem(item);
                              }}
                              onPurchaseItem={() => {null;}}
                              onAddToCart={() => {
                                setElementToCreateSourceItemCart({
                                  ...emptySourceItemCartFormData,
                                  id_sourceItem: item,
                                });
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
                  </TableBody>
                </Table>
            </FrontModalContainer>
          </FrontOverlayContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default SourceItemTable;
