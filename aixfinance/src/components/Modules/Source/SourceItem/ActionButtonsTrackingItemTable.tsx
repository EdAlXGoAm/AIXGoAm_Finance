import React, {useState, useEffect} from 'react';
import { FaButton, FaButtonDelete, FaButtonEdit, FaButtonTracking } from '@/utils/buttonUtils';
import { RemoteSourceItemData } from '@/services/api/source/apiSourceItem';
import { colors } from '@mui/material';

interface ActionButtonsTrackingItemTableProps {
  item: RemoteSourceItemData;
  onEditItem: (item: RemoteSourceItemData) => void;
  onDeleteItem: (id: string) => void;
}

const ActionButtonsTrackingItemTable: React.FC<ActionButtonsTrackingItemTableProps> = ({item, onEditItem, onDeleteItem}) => {

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
    </>
  );
}

export default ActionButtonsTrackingItemTable;
