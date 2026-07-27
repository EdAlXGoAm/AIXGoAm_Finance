import React, { useState, useEffect } from 'react';
import { RemotePurchaseItemStoryData } from '@/services/apiPurchaseItemStory';
import { RemoteInventoryItemData } from '@/services/apiSourceItem';

interface AdditionalData {
  story: RemotePurchaseItemStoryData;
  copyInventoryItem: RemoteInventoryItemData;
}

export const PurchaseTableElementCantidad = ({story, copyInventoryItem}: AdditionalData) => {

  const [defaultUnit, setDefaultUnit] = useState<string>('');
  const [defaultUnitName, setDefaultUnitName] = useState<string>('');

  useEffect(() => {
    const fetchReferenceVariables = async () => {
      if (copyInventoryItem && Object.keys(copyInventoryItem).length > 0) {
        const defaultUnit = copyInventoryItem.idParamConfig.default_unit;
        setDefaultUnit(defaultUnit);
        if (defaultUnit === 'quantity_unit') {
          setDefaultUnitName(copyInventoryItem.idParamConfig.quantity_unit);
        } else if (defaultUnit === 'weight_unit') {
          setDefaultUnitName(copyInventoryItem.idParamConfig.weight_unit);
        } else if (defaultUnit === 'volume_unit') {
          setDefaultUnitName(copyInventoryItem.idParamConfig.volume_unit);
        } else if (defaultUnit === 'time_unit') {
          setDefaultUnitName(copyInventoryItem.idParamConfig.time_unit);
        }
      }
    }
    fetchReferenceVariables();
  }, [story]);

  return (
    <React.Fragment>
      {`${story.quantity} ${defaultUnitName}`}
    </React.Fragment>
  )
}

export default PurchaseTableElementCantidad;