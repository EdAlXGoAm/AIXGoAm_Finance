import React, { useState, useMemo, useEffect } from 'react';
import { useSourceItemCart } from './SourceItemCartContext';
import { Table, TableRow, TableCell, TableHead, TableBody, TableSortLabel } from '@mui/material';
import { RemoteSourceItemCartData, RemoteToModel, deleteSourceItemCart, emptySourceItemCartFormData } from '@/services/api/source/apiSourceItemsCart';
import { TextLine, Paragraph } from '@/utils/textUtils';
import { CodeContainer } from '@/commonTools/CodeContainer';
import { FloatingTableElements } from '@/commonTable/floatingTableElements';
import ActionButtonsSourceItemCartTable from '@/components/Modules/Source/SourceItem/SourceItemCart/ActionButtonsSourceItemCartTable';
import { FrontOverlayContainer, FrontModalContainer, FrontCloseButton } from '@/commonForm/frontContainer';
import { searchBar } from '@/commonTools/Tools';
import Fuse from 'fuse.js';
import { ButtonCircle } from '@/commonForm/FrontButtons';
const SourceItemCartTable: React.FC = () => {
  const {
    elementToEditSourceItemCart, setElementToEditSourceItemCart,
    sourceItemsCarts, setSourceItemsCarts,
    viewSourceItemCart, setViewSourceItemCart
  } = useSourceItemCart();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchedSourceItems, setSearchedSourceItems] = useState<RemoteSourceItemCartData[]>([]);

  useEffect(() => {
    if (viewSourceItemCart) {
      setIsOpen(true);
    }
  }, [viewSourceItemCart]);

  useEffect(() => {
    console.log('sourceItemsCarts', sourceItemsCarts);
    if (searchQuery.trim() === '') {
      const results = sourceItemsCarts
        .slice()
        .sort((a, b) => a.id_sourceItem.name.localeCompare(b.id_sourceItem.name))
        .slice(-10);
      setSearchedSourceItems(results);
    } else {
      const fuse = new Fuse(sourceItemsCarts, {
        keys: ['status'],
        threshold: 0.3,
      });
      const results = fuse.search(searchQuery);
      const matchedSourceItems = results.map(result => result.item);
      setSearchedSourceItems(
        matchedSourceItems
          .slice()
          .sort((a, b) => a.id_sourceItem.name.localeCompare(b.id_sourceItem.name))
          .slice(-10)
      );
    }
  }, [searchQuery, sourceItemsCarts]);

  interface SortedRule {
    orderBy: string;
    type: 'alphabetically' | 'numerically';
  }

  const sortedRules: SortedRule[] = [
    { orderBy: 'id_sourceItem.name', type: 'alphabetically' },
    { orderBy: 'quantity', type: 'numerically' },
    { orderBy: 'totalPrice', type: 'numerically' },
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
    grouped: false,
    sortedRules,
    onCloseExternalActions: () => setViewSourceItemCart(false),
  });

  return (
    <React.Fragment>
      <ButtonCircle textToShow='Carrito' positionX={100} positionY={180} action={() => setViewSourceItemCart(true)} />
      {isOpen && (
        <React.Fragment>
          <FrontOverlayContainer overlayRef={overlayRef}>
            <FrontModalContainer modalRef={modalRef} maxWidth='600px'>
              <FrontCloseButton handleClose={handleClose} />
                {searchBar(searchQuery, setSearchQuery, 'Buscar por proveedor, nombre, descripción o precio...')}
                <h2>Tabla de Items</h2>
                <Table
                  size='small'
                >
                  <TableHead>
                    <TableRow>
                      {renderHeaderCellAlphabetically('Source', 'id_sourceItem.name')}
                      {renderHeaderCellNumerically('Cantidad', 'quantity')}
                      {renderHeaderCellNumerically('Monto', 'totalPrice')}
                      <TableCell>Acciones</TableCell>
                      <TableCell>Imágen</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <>
                      {sortedElements && sortedElements.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5}>No se encontraron elementos en el carrito.</TableCell>
                        </TableRow>
                      )}
                      {sortedElements && sortedElements.map((item: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Paragraph>
                              <TextLine variable="Name">
                                {item.id_sourceItem.name}
                              </TextLine>
                              <TextLine variable="Proveedor">
                                {item.id_sourceItem.provider}
                              </TextLine>
                              {item.id_sourceItem.description && <CodeContainer code={item.id_sourceItem.description} maxWidth='80px' fontSize='10px' padding='1px' />}
                            </Paragraph>
                          </TableCell>
                          <TableCell>
                            <Paragraph>
                              <TextLine variable="Cantidad">
                                {item.quantity}
                              </TextLine>
                            </Paragraph>
                          </TableCell>
                          <TableCell>
                            <Paragraph>
                              <TextLine variable="Precio">
                                {`$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.totalPrice)}`}
                              </TextLine>
                            </Paragraph>
                          </TableCell>
                          <TableCell>
                            <Paragraph>
                              <TextLine variable="Prioridad">
                                {item.priority}
                              </TextLine>
                              <TextLine variable="Estado">
                                {item.status}
                              </TextLine>
                            </Paragraph>
                          </TableCell>
                          <TableCell>
                            <ActionButtonsSourceItemCartTable
                              item={item}
                              onEditItem={() => setElementToEditSourceItemCart(RemoteToModel(item))}
                              onDeleteItem={() => {
                                deleteSourceItemCart(item._id);
                                setSourceItemsCarts(sourceItemsCarts.filter(sourceItemCart => sourceItemCart._id !== item._id));
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <img src={item.id_sourceItem.image} alt={item.id_sourceItem.name}
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

export default SourceItemCartTable;
