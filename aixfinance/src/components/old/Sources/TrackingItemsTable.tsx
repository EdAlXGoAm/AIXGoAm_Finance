import React, { useEffect, useState } from 'react';
import { Table, TableRow, TableCell, TableHead, TableBody, TableSortLabel, colors } from '@mui/material';
import { getTrackingItemsByIdSourceItem, deleteTrackingItem, RemoteTrackingItemData } from '@/services/apiTrackingItem';
import { toISOStringLocal } from '@/utils/dateUtils';
import ActionButtonsTrackingItemTable from '@/components/Modules/Source/SourceItem/ActionButtonsTrackingItemTable';
import DateTable from '@/constants/Operations/Table/DateTable';
import { TextLine, Paragraph, TextLineTwoLines } from '@/utils/textUtils';
import { CodeContainer } from '@/commonTools/CodeContainer';
import { RemoteSourceItemData } from '@/services/apiSourceItem';
import styles from '@/styles/Sources/TrackingItemsTable.module.css';
import { FaButtonAdd } from '@/utils/buttonUtils';
import { Column, Row } from '@/utils/utils';

interface TrackingItemsTableProps {
  trackingItems: RemoteTrackingItemData[];
  setItemToTracking: (item: RemoteSourceItemData | null) => void;
  onEditTrackingItem: (trackingItem: RemoteTrackingItemData) => void;
  onDeleteTrackingItem: (id: string) => void;
  onNewTrackingItem: () => void;
  idSourceItemTriggeredFromExternalComponent?: RemoteSourceItemData | null;
  openTriggeredFromExternalComponent?: boolean;
  setOpenTriggeredFromExternalComponent?: (value: boolean) => void;
}

const TrackingItemsTable: React.FC<TrackingItemsTableProps> = ({trackingItems, setItemToTracking, onEditTrackingItem, onDeleteTrackingItem, onNewTrackingItem, idSourceItemTriggeredFromExternalComponent, openTriggeredFromExternalComponent, setOpenTriggeredFromExternalComponent}) => {
  const [loadingTable, setLoadingTable] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [filteredTrackingItems, setFilteredTrackingItems] = useState<RemoteTrackingItemData[]>([]);

  useEffect(() => {
    if (openTriggeredFromExternalComponent) {
      setIsOpen(true);
      if (setOpenTriggeredFromExternalComponent) {
        setOpenTriggeredFromExternalComponent(false);
      }
    }
  }, [openTriggeredFromExternalComponent]);

  useEffect(() => {
    setLoadingTable(true);
    if (idSourceItemTriggeredFromExternalComponent && idSourceItemTriggeredFromExternalComponent._id) {
      const filtered = trackingItems.filter(
        (item) => item.idSourceItem._id === idSourceItemTriggeredFromExternalComponent._id
      );
      setFilteredTrackingItems(filtered);
    } else {
      setFilteredTrackingItems(trackingItems);
    }
    setLoadingTable(false);
  }, [trackingItems, idSourceItemTriggeredFromExternalComponent]);

  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    fetchDates();
  }, [filteredTrackingItems]);

  const fetchDates = async () => {
    const dates = filteredTrackingItems.map((trackingItem) => {
      const date = toISOStringLocal(trackingItem.date).split('T')[0];
      return date;
    });
    setDates(dates);
  }

  const handleClose = () => {
    handleCleanItemToTracking();
    setIsOpen(false);
  }

  const handleCleanItemToTracking = () => {
    setItemToTracking(null);
  }
  
  // Calcular el número de parejas de columnas
  const pairCount = filteredTrackingItems.length;
  const maxPairs = 4;
  const enableScroll = pairCount > maxPairs;

  // Calcular el ancho de cada par de columnas
  const pairWidth = enableScroll ? 100 / maxPairs : 100 / pairCount;

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={onNewTrackingItem}>
              <FaButtonAdd />
            </button>
            {!loadingTable ? (
              <div className={enableScroll ? styles.tableContainerScroll : styles.tableContainer}>
                <h3>Items de seguimiento</h3>
                <Table
                  size='small'
                  className={styles.fixedTable}
                  style={{ '--width-table': `${filteredTrackingItems.length * 1.3 * 25}%` } as React.CSSProperties}
                >
                  <TableHead>
                    <TableRow>
                      {filteredTrackingItems.map((_trackingItem, index) => (
                        <React.Fragment key={index}>
                          <TableCell style={{ width: `${pairWidth}%` }}>
                            <div className={styles.cellContent}>
                              {`Track ${index + 1}. ${dates[index]}`}
                            </div>
                          </TableCell>
                          <TableCell style={{ width: `${pairWidth * 0.3}%` }}>
                            <div className={styles.cellContent}>
                              Acciones
                            </div>
                          </TableCell>
                        </React.Fragment>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {filteredTrackingItems.map((trackingItem, index) => (
                        <React.Fragment key={index}>
                          <TableCell style={{ width: `${pairWidth}%` }}>
                            <div className={styles.cellContent}>
                              <DateTable date={trackingItem.date} fontSize="13px" />
                            </div>
                            <div className={styles.cellContent}>
                              <Row>
                                <TextLineTwoLines variable="Stock" fontSize="13px">
                                  {trackingItem.stock}
                                </TextLineTwoLines>
                              </Row>
                              <Row>
                                <TextLineTwoLines variable="Precio" fontSize="13px">
                                  {trackingItem.price}
                                </TextLineTwoLines>
                              </Row>
                            </div>
                          </TableCell>
                          <TableCell style={{ width: `${pairWidth * 0.3}%` }}>
                            <div className={styles.cellContent}>
                              <ActionButtonsTrackingItemTable
                                item={trackingItem}
                                onEditItem={() => onEditTrackingItem(trackingItem)}
                                onDeleteItem={() => onDeleteTrackingItem(trackingItem._id)}
                              />
                            </div>
                          </TableCell>
                        </React.Fragment>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p>Cargando...</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default TrackingItemsTable;