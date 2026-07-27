import React, {useState, useEffect} from 'react';
import { FaButton, FaButtonAddToCart, FaButtonDelete, FaButtonEdit, FaButtonPurchase, FaButtonTracking } from '@/utils/buttonUtils';
import { RemoteSourceItemData } from '@/services/api/source/apiSourceItem';
import { colors } from '@mui/material';

interface ActionButtonsItemTableProps {
  item: RemoteSourceItemData;
  onEditItem: (item: RemoteSourceItemData) => void;
  onDeleteItem: (id: string) => void;
  onTrackingItem: (item: RemoteSourceItemData) => void;
  onPurchaseItem: (item: RemoteSourceItemData) => void;
  onAddToCart: (item: RemoteSourceItemData) => void;
}

const ActionButtonsItemTable: React.FC<ActionButtonsItemTableProps> = ({item, onEditItem, onDeleteItem, onTrackingItem, onPurchaseItem, onAddToCart}) => {

  const [editable, setEditable] = useState(false);
  const [deletable, setDeletable] = useState(false);

  const handleEditable = () => {
    setEditable(true);
    onEditItem(item);
    setEditable(false);
  }

  const handleDeletable = () => {
    setDeletable(true);
    onDeleteItem(item._id);
    setDeletable(false);
  }

  const handleTrackingItem = () => {
    onTrackingItem(item);
  }

  const handlePurchaseItem = () => {
    onPurchaseItem(item);
  }

  const handleAddToCart = () => {
    onAddToCart(item);
  }

  return (
    <>
      <FaButton
        onClick={handleEditable}
        beforeColor={colors.grey[500]}
        afterColor={colors.blue[700]}
        loading={editable}
      >
        <FaButtonEdit />
      </FaButton>
      <FaButton
        onClick={handleDeletable}
        beforeColor={colors.grey[500]}
        afterColor={colors.red[700]}
        loading={deletable}
      >
        <FaButtonDelete />
      </FaButton>
      <FaButton
        onClick={handleTrackingItem}
        beforeColor={colors.grey[500]}
        afterColor={colors.green[700]}
      >
        <FaButtonTracking />
      </FaButton>
      <FaButton
        onClick={handlePurchaseItem}
        beforeColor={colors.grey[500]}
        afterColor={colors.purple[700]}
      >
        <FaButtonPurchase />
      </FaButton>
      <FaButton
        onClick={handleAddToCart}
        beforeColor={colors.grey[500]}
        afterColor={colors.orange[700]}
      >
        <FaButtonAddToCart />
      </FaButton>
    </>
  );
}

export default ActionButtonsItemTable;
