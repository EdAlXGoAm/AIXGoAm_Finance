import React, { useState, useEffect } from 'react';
import styles from '../../styles/Operations/OperationForm.module.css';
import { OperationModel } from '../../services/apiOperations';
import { OperationFormElements } from '../../constants/Operations/OperationFormElements';
import { RelatedOperationModel } from '../../services/apiRelatedOperations';
import { toISOStringLocal } from '../../utils/dateUtils';
import { Row, Column, RowForm, CustomAddButton, TableCRUD, CustomEditButton, CustomDeleteButton, TDCRUD } from '../../utils/formatUtils';
import { Switch, FormControlLabel, TableCell, TableBody, TableRow, TableHead, Table, colors } from '@mui/material';
import { formatCurrency, parseCurrency } from '../../utils/moneyUtils';
import ActionButtonsTable from '@/constants/Operations/Table/ActionButtonsTable';
import { FaButtonDelete, FaButtonEdit } from '@/utils/buttonUtils';
import { FaButton } from '@/utils/buttonUtils';
import { CodeContainer } from '@/commonTools/CodeContainer';

interface OperationFormProps {
  elementToEdit?: OperationModel;
  onCleanElement: () => void;
  onRefreshOperations: () => void;

  relatedOperationIds: string[];
  setRelatedOperationIds: React.Dispatch<React.SetStateAction<string[]>>;
  onAddRelatedOperation: (type: string, formulas: Map<string, string>) => void;
  onEditRelatedOperation: (element: RelatedOperationModel, formulas: Map<string, string>) => void;
  onDeleteRelatedOperation: (id: string) => void;
  refreshRelatedOperations: boolean;
}

const OperationForm: React.FC<OperationFormProps> = ({
  elementToEdit,
  onCleanElement,
  onRefreshOperations,

  relatedOperationIds, setRelatedOperationIds,
  onAddRelatedOperation,
  onEditRelatedOperation,
  onDeleteRelatedOperation,
  refreshRelatedOperations
}) => {
  const {
    displayAmount, setDisplayAmount,
    emptyElementData,
    isOpen, setIsOpen,
    error, setError,
    loading, setLoading,
    formData, setFormData,
    handleCancel,
    handleChange,
    handleChangeCheckbox,
    handleSubmit,
    handleFocus,
    handleFocusAmount,
    handleBlur,
    getFormulas,
    tableGetRelatedOperations,
    RemoteRelatedOperationDataToModel,
    handleChangeAmount
  } = OperationFormElements({ onCleanElement, onRefreshOperations, elementToEdit, relatedOperationIds, setRelatedOperationIds });

  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    if(elementToEdit) {
      setRelatedOperationIds((prev) => {
        const preRelatedOperations = elementToEdit.data.preRelatedOperations.map((relatedOperation) => relatedOperation._id);
        const postRelatedOperations = elementToEdit.data.postRelatedOperations.map((relatedOperation) => relatedOperation._id);
        return [...preRelatedOperations, ...postRelatedOperations];
      });
      setFormData(elementToEdit.data);
      setDisplayAmount(formatCurrency(elementToEdit.data.amount));
      setIsOpen(true);
    }
  }, [elementToEdit]);

  useEffect(() => {
    tableGetRelatedOperations();
  }, [refreshRelatedOperations]);

  return (
    <>
      {!elementToEdit && (
        <button className={styles.addButton} onClick={() => setIsOpen(true)}>
          +
        </button>
      )}
      {isOpen && (
        <div className={styles.overlay} onClick={handleCancel}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{elementToEdit ? 'Editar Operación' : 'Agregar Operación'}</h2>
            <form onSubmit={handleSubmit}>
              <Row>
                <Column>
                  <label>Fecha</label>
                  <input
                    type="date"
                  name="date"
                  value={toISOStringLocal(formData.date).split('T')[0]}
                  onChange={handleChange}
                  required
                  />
                </Column>
                <Column>
                  <label>Hora</label>
                <input
                  type="time"
                  name="time"
                  value={toISOStringLocal(formData.date).split('T')[1].slice(0, 5)}
                  onChange={handleChange}
                  required
                  />
                </Column>
              </Row>
              <RowForm>
                <label>Tipo de Operación</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="Ingreso">Ingreso</option>
                  <option value="Gasto">Gasto</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </RowForm>
              <RowForm>
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{ color: formData.name === 'Desconocido' ? 'gray' : 'black'}}
                  required
                />
              </RowForm>
              <RowForm>
                <label>Monto</label>
                <input type="text" name="amount" value={displayAmount} onChange={handleChangeAmount} onFocus={handleFocusAmount} required />
              </RowForm>
              <RowForm>
                <label>Descripción</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} />
              </RowForm>
              <RowForm>
                <label>Cuenta</label>
                <input type="text" name="account" value={formData.account} onChange={handleChange} />
              </RowForm>
              <RowForm>
                <FormControlLabel control={<Switch name="deferred" checked={formData.deferred} onChange={handleChangeCheckbox} />} label="Diferido" />
              </RowForm>
              {formData.deferred && (
                <RowForm>
                  <label>Cantidad de Cuotas</label>
                  <input type="number" name="installments" value={formData.installments} onChange={handleChange} />
                </RowForm>
              )}
              <RowForm>
                <label>Pre Operaciones</label>
                <div className={styles.OperationsBox}>
                  <CustomAddButton onClick={() => onAddRelatedOperation("Pre", getFormulas())} />
                  <TableCRUD>
                    <Table
                      size='small'
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Monto</TableCell>
                          <TableCell>Formula</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.preRelatedOperations.map((relatedOperation, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{relatedOperation.name}</TableCell>
                            <TableCell>{formatCurrency(relatedOperation.amount)}</TableCell>
                            <TableCell>
                              <CodeContainer code={relatedOperation.formula} maxWidth='80px' />
                            </TableCell>
                            <TableCell style={{display: 'flex', gap: '10px'}}>
                              <FaButton
                                onClick={() => onEditRelatedOperation(RemoteRelatedOperationDataToModel(relatedOperation), getFormulas())}
                                beforeColor={colors.grey[500]}
                                afterColor={colors.blue[700]}
                              >
                                <FaButtonEdit />
                              </FaButton>
                              <FaButton
                                onClick={() => onDeleteRelatedOperation(relatedOperation._id)}
                                beforeColor={colors.grey[500]}
                                afterColor={colors.red[700]}
                              >
                                <FaButtonDelete />
                              </FaButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCRUD>
                </div>
              </RowForm>
              <RowForm>
                <label>Post Operaciones</label>
                <div className={styles.OperationsBox}>
                  <CustomAddButton onClick={() => onAddRelatedOperation("Post", getFormulas())} />
                  <TableCRUD>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Monto</TableCell>
                          <TableCell>Formula</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.postRelatedOperations.map((relatedOperation, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{relatedOperation.name}</TableCell>
                            <TableCell>{formatCurrency(relatedOperation.amount)}</TableCell>
                            <TableCell>
                              <CodeContainer code={relatedOperation.formula} maxWidth='80px' />
                            </TableCell>
                            <TableCell style={{display: 'flex', gap: '10px'}}>
                              <FaButton
                                onClick={() => onEditRelatedOperation(RemoteRelatedOperationDataToModel(relatedOperation), getFormulas())}
                                beforeColor={colors.grey[500]}
                                afterColor={colors.blue[700]}
                              >
                                <FaButtonEdit />
                              </FaButton>
                              <FaButton
                                onClick={() => onDeleteRelatedOperation(relatedOperation._id)}
                                beforeColor={colors.grey[500]}
                                afterColor={colors.red[700]}
                              >
                                <FaButtonDelete />
                              </FaButton>
                            </TableCell>  
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCRUD>
                </div>
              </RowForm>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.buttons}>
                <button type="submit" disabled={loading}>
                  {loading ? 'Actualizando...' : (elementToEdit ? 'Actualizar' : 'Agregar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default OperationForm;
