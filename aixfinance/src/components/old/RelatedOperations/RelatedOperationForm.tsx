import React, { useState, useEffect } from 'react';
import styles from '../../styles/Operations/RelatedOperationForm.module.css';
import { RelatedOperationModel } from '../../services/apiRelatedOperations';
import { RelatedOperationFormElements } from './RelatedOperationFormElements';
import { toISOStringLocal } from '../../utils/dateUtils';
import { Row, Column, RowForm, FormulasContainer, FormulaLabel, CustomForm } from '../../utils/formatUtils';

interface RelatedOperationFormProps {
  elementToEdit?: RelatedOperationModel;
  onCleanData: () => void;
  relatedOperationType: string;
  formulas: Map<string, string>;
  onCreateRelatedOperationId: (id: string) => void;
  onRefreshRelatedOperations: () => void;
}

const RelatedOperationForm: React.FC<RelatedOperationFormProps> = ({
  elementToEdit,
  onCleanData,
  relatedOperationType,
  formulas,
  onCreateRelatedOperationId,
  onRefreshRelatedOperations
}) => {
  const {
    isOpen, setIsOpen,
    error,
    loading,
    formData, setFormData,
    handleChange,
    handleSubmit,
    handleClose,
    handleFocus,
    handleBlur,
    handleFormulaLabelClick,
    formulaInputRef
  } = RelatedOperationFormElements({ onCleanData, elementToEdit, onCreateRelatedOperationId, onRefreshRelatedOperations });

  useEffect(() => {
    if (elementToEdit) {
      setFormData(elementToEdit.data);
      setIsOpen(true);
    }
  }, [elementToEdit]);

  useEffect(() => {
    if (relatedOperationType) setFormData((prev) => ({
      ...prev,
      type: relatedOperationType
    }));
  }, [relatedOperationType]);

  useEffect(() => {
    if (formData.amount < 0) {
      setFormData((prev) => ({ ...prev, amountType: 'Descuento' }));
    } else {
      setFormData((prev) => ({ ...prev, amountType: 'Aumento' }));
    }
  }, [formData.amount]);

  useEffect(() => {
    if (formData.formula) {
      try {
        // Expresión regular para encontrar patrones {key:value}
        const regex = /\{(\w+):([\d.]+)\}/g;
        let match;
        const variables: Record<string, number> = {};
        let formulaExpression = formData.formula;
        
        // Extraer variables y reemplazar en la fórmula
        while ((match = regex.exec(formData.formula)) !== null) {
          const key = match[1];
          const value = parseFloat(match[2]);
          variables[key] = value;
          // Reemplazar {key:value} con el valor numérico
          formulaExpression = formulaExpression.replace(match[0], value.toString());
        }
        // Evaluar la expresión matemática resultante
        // Nota: Usar el constructor Function puede ser inseguro si la entrada no es confiable.
        // Considera usar una librería de evaluación de expresiones como mathjs para mayor seguridad.
        const result = Function('"use strict"; return (' + formulaExpression + ')')();
        
        if (typeof result === 'number' && !isNaN(result)) {
          setFormData((prevData) => ({ ...prevData, amount: parseFloat(result.toFixed(2)) }));
        }
      } catch (error) {
        // Manejar errores en la evaluación de la fórmula
        console.error('Error al evaluar la fórmula:', error);
        // Opcional: Puedes establecer un estado de error adicional aquí
      }
    }
  }, [formData.formula, setFormData]);

  return (
    <>
      {!elementToEdit && (
        <button className={styles.addButton} onClick={() => setIsOpen(true)}>
          +
        </button>
      )}
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{elementToEdit ? `Editar ${relatedOperationType} Operación` : `Agregar ${relatedOperationType} Operación`}</h2>
            <CustomForm>
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
                <label>Fuente</label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                />
              </RowForm>
              <RowForm>
                <label>Formula</label>
                <input
                  type="text"
                  name="formula"
                  value={formData.formula}
                  ref={formulaInputRef}
                  onChange={handleChange}
                />
              </RowForm>
              <RowForm>
                <label>Monto</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </RowForm>
              <FormulasContainer>
                {Array.from(formulas.entries()).map(([key, value], i) => (
                  <FormulaLabel key={i} onClick={() => handleFormulaLabelClick(key, value)}>
                    {key}: {value}
                  </FormulaLabel>
                ))}
              </FormulasContainer>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.buttons}>
                <button className={`${styles.button} ${styles.submitButton}`} disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Actualizando...' : (elementToEdit ? 'Actualizar' : 'Agregar')}
                </button>
              </div>
            </CustomForm>
          </div>
        </div>
      )}
    </>
  );
}

export default RelatedOperationForm;
