import React, { useState, useEffect } from 'react';
import { RemotePurchaseItemStoryData } from '@/services/apiPurchaseItemStory';
import { RemoteSourceItemData } from '@/services/apiSourceItem';
import { TextLine } from '../../utils/textUtils';

interface AdditionalData {
  story: RemotePurchaseItemStoryData;
  copySourceItem: RemoteSourceItemData;
}

export const PurchaseTableElement = ({story, copySourceItem}: AdditionalData) => {

  const [referenceUnit, setReferenceUnit] = useState<string>('');
  const [referenceUnitName, setReferenceUnitName] = useState<string>('');
  const [referenceQuantity, setReferenceQuantity] = useState<number>(0);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [leftQuantity, setLeftQuantity] = useState<number>(0);
  const [consumedQuantity, setConsumedQuantity] = useState<number>(0);
  useEffect(() => {
    const fetchReferenceVariables = async () => {
      if (copySourceItem && Object.keys(copySourceItem).length > 0) {
        let varReferenceQuantity = 0;
        const varReferenceUnit = copySourceItem.idParamConfig.reference_unit;
        setReferenceUnit(varReferenceUnit);
        if (varReferenceUnit === 'quantity_unit') {
          setReferenceUnitName(copySourceItem.idParamConfig.quantity_unit);
          varReferenceQuantity = copySourceItem.quantity;
        } else if (varReferenceUnit === 'weight_unit') {
          setReferenceUnitName(copySourceItem.idParamConfig.weight_unit);
          varReferenceQuantity = copySourceItem.weight;
        } else if (varReferenceUnit === 'volume_unit') {
          setReferenceUnitName(copySourceItem.idParamConfig.volume_unit);
          varReferenceQuantity = copySourceItem.volume;
        } else if (varReferenceUnit === 'time_unit') {
          setReferenceUnitName(copySourceItem.idParamConfig.time_unit);
          varReferenceQuantity = copySourceItem.time;
        }
        setReferenceQuantity(varReferenceQuantity);
        const varTotalQuantity = varReferenceQuantity * story.quantity;
        setTotalQuantity(varTotalQuantity);
        setLeftQuantity(story.leftQuantity);
        const varConsumedQuantity = varTotalQuantity - story.leftQuantity;
        setConsumedQuantity(varConsumedQuantity);
      }
    }
    fetchReferenceVariables();
  }, [story, copySourceItem]);

  return (
    <React.Fragment>
      <TextLine variable="Cantidad Inicial">
        {`${totalQuantity} ${referenceUnitName}`}
      </TextLine>
      <TextLine variable="Consumida">
        {`${consumedQuantity} ${referenceUnitName}`}
      </TextLine>
      <TextLine variable="Restante">
        {`${leftQuantity} ${referenceUnitName}`}
      </TextLine>
    </React.Fragment>
  )

}

export default PurchaseTableElement;