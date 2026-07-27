import { useState, useEffect } from 'react';
import { RemotePurchaseItemStoryData } from '@/services/apiPurchaseItemStory';
import { RemoteInventoryItemData } from '@/services/apiSourceItem';
import { TextLine } from '../../utils/textUtils';
import PieChart from './PieChart';

interface AdditionalData {
  story: RemotePurchaseItemStoryData;
  copyInventoryItem: RemoteInventoryItemData;
  measureType: string;
}

const PurchaseTableGraph = ({story, copyInventoryItem, measureType}: AdditionalData) => {

const [referenceUnit, setReferenceUnit] = useState<string>('');
const [referenceQuantity, setReferenceQuantity] = useState<number>(0);
useEffect(() => {
  const fetchReferenceVariables = async () => {
    if (copyInventoryItem && Object.keys(copyInventoryItem).length > 0) {
      let varReferenceQuantity = 0;
      let varReferenceUnit = copyInventoryItem.idParamConfig.reference_unit;
      setReferenceUnit(varReferenceUnit);
      if (varReferenceUnit === 'quantity_unit') {
        varReferenceQuantity = copyInventoryItem.quantity;
      } else if (varReferenceUnit === 'weight_unit') {
        varReferenceQuantity = copyInventoryItem.weight;
      } else if (varReferenceUnit === 'volume_unit') {
        varReferenceQuantity = copyInventoryItem.volume;
      } else if (varReferenceUnit === 'time_unit') {
        varReferenceQuantity = copyInventoryItem.time;
      }
      setReferenceQuantity(varReferenceQuantity);
    }
  }
  fetchReferenceVariables();
}, [story]);

return (
  <>
    <div style={{ width: '150px', height: '200px' }}>
      <PieChart name={story.copyInventoryItem.name} remaining={story.leftQuantity} consumed={(referenceQuantity*story.quantity) - story.leftQuantity} size={150} measureType={measureType} />
    </div>
  </>
)

}

export default PurchaseTableGraph;