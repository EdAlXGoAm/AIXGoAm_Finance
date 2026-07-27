import React, {useState, useEffect} from 'react';
import { FaButton, FaButtonDelete, FaButtonEdit } from '@/utils/buttonUtils';
import { RemoteSourceItemCartData } from '@/services/api/source/apiSourceItemsCart';
import { colors } from '@mui/material';

interface ActionButtonsItemTableProps {
  item: RemoteSourceItemCartData;
  onEditItem: (item: RemoteSourceItemCartData) => void;
  onDeleteItem: (id: string) => void;
}

const ActionButtonsItemTable: React.FC<ActionButtonsItemTableProps> = ({item, onEditItem, onDeleteItem}) => {

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

export default ActionButtonsItemTable;
