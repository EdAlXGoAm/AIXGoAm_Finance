import React, { useEffect, useState } from 'react';
import { Table, TableRow, TableCell, TableHead, TableBody, TableSortLabel, colors } from '@mui/material';
import { toISOStringLocal } from '@/utils/dateUtils';
import ActionButtonsTrackingItemTable from '@/components/Modules/Source/SourceItem/ActionButtonsTrackingItemTable';
import DateTable from '@/constants/Operations/Table/DateTable';
import { TextLine, Paragraph, TextLineTwoLines } from '@/utils/textUtils';
import { deleteSourceItem, emptySourceItemFormData, RemoteSourceItemData, RemoteToModel, SourceItemFormData } from '@/services/api/source/apiSourceItem';
import styles from '../../../../styles/Sources/TrackingItemsTable.module.css';
import { FaButtonAdd } from '@/utils/buttonUtils';
import { Column, Row } from '@/utils/formatUtils';
import { useSourceItemTracker } from './SourceItemTrackerContext';
import { useSourceItem } from './SourceItemContext';

const TrackingItemsTable: React.FC = () => {
  const {
    sourceItemsTracker,
  } = useSourceItemTracker();
  const {
    setElementToCreateSourceItem,
    setElementToEditSourceItem,
    sourceItems, setSourceItems,
    selectedSourceItem, setSelectedSourceItem
  } = useSourceItem();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedSourceItem) {
      setIsOpen(true);
    }
  }, [selectedSourceItem]);

  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    fetchDates();
  }, [sourceItemsTracker]);

  const fetchDates = async () => {
    const dates = sourceItemsTracker.map((trackingItem) => {
      const date = toISOStringLocal(trackingItem.date).split('T')[0];
      return date;
    });
    setDates(dates);
  }

  const handleClose = () => {
    setIsOpen(false);
    setSelectedSourceItem(null);
  }
  
  // Calcular el número de parejas de columnas
  const maxPairs = 3;
  const [enableScroll, setEnableScroll] = useState(sourceItemsTracker.length > maxPairs);
  const [pairWidth, setPairWidth] = useState(25);
  const [tableWidth, setTableWidth] = useState('100%');

  useEffect(() => {
    const localEnableScroll = sourceItemsTracker.length > maxPairs;
    const localPairWidth = localEnableScroll ? 25 : 100 / sourceItemsTracker.length;
    
    const calculatedWidth = localEnableScroll
      ? Math.min(sourceItemsTracker.length * 1.25 * localPairWidth, 200)
      : 100;

    setEnableScroll(localEnableScroll);
    setPairWidth(localPairWidth);
    setTableWidth(`${calculatedWidth}%`);
  }, [sourceItemsTracker]);

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => {
              if (selectedSourceItem) {
                const model = RemoteToModel(selectedSourceItem);
                const formData = model.data as SourceItemFormData;
                formData.date = new Date();
                setElementToCreateSourceItem(formData);
              }
            }}>
              <FaButtonAdd />
            </button>
            <div className={enableScroll ? styles.tableContainerScroll : styles.tableContainer}>
              <h3>Items de seguimiento</h3>
              <Table
                size='small'
                className={styles.fixedTable}
                style={{ '--width-table': tableWidth } as React.CSSProperties}
              >
                <TableHead>
                  <TableRow>
                    {sourceItemsTracker.map((_trackingItem, index) => (
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
                    {sourceItemsTracker.map((trackingItem, index) => (
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
                              onEditItem={() => setElementToEditSourceItem(RemoteToModel(trackingItem))}
                              onDeleteItem={() => {
                                deleteSourceItem(trackingItem._id);
                                setSourceItems(sourceItems.filter((item: RemoteSourceItemData) => item._id !== trackingItem._id));
                              }}
                            />
                          </div>
                        </TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TrackingItemsTable;