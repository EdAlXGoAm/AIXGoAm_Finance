import React, {useState, useEffect} from 'react';
import { FaButton, FaButtonDelete, FaButtonEdit } from '@/utils/buttonUtils';
import { RemoteOperationModel } from '@/services/apiOperations';
import { colors } from '@mui/material';

interface ActionButtonsTableProps {
  operation: RemoteOperationModel;
  onEditOperation: (operation: RemoteOperationModel) => void;
  onDeleteOperation: (id: string) => void;
}

const ActionButtonsTable: React.FC<ActionButtonsTableProps> = ({operation, onEditOperation, onDeleteOperation}) => {

  const [editable, setEditable] = useState(false);
  const [deletable, setDeletable] = useState(false);

  const handleEditable = () => {
    setEditable(true);
    onEditOperation(operation);
    setEditable(false);
  }

  const handleDeletable = () => {
    setDeletable(true);
    onDeleteOperation(operation._id);
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

export default ActionButtonsTable;
