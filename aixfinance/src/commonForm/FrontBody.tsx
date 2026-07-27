import styles from './frontBody.module.css';
import { Row, Column } from '@/utils/formatUtils';
import { ListBoxRemoveButton } from './FrontButtons';

export const CustomForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>{children}</div>
  )
}

export const RowForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <Row>
      <Column>{children}</Column>
    </Row>
  )
}

export const ErrorMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.error}>{children}</div>
  )
}

export const FormulasContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Row>
      <div className={styles.formulasContainer}>{children}</div>
    </Row>
  )
}

export const FormulaLabel = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => {
  return (
    <div className={styles.formulaLabel} onClick={onClick}>{children}</div>
  )
}


export const ListBoxContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.listBoxContainer}>{children}</div>
  )
}

export const ListBoxElementInput = ({ children, key, value, handleChangeList, onClick }: { children: React.ReactNode, key: string | number, value: string, handleChangeList: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void, onClick: () => void }) => {
  return (
    <div className={styles.listBoxElement} key={key}>
      <input type="text" className={styles.listBoxInput} value={value} onChange={handleChangeList} />
      {children}
      <ListBoxRemoveButton text='Eliminar' onClick={onClick} />
    </div>
  )
}

export const ListBoxElement = ({ children, key, onClick }: { children: React.ReactNode, key: string | number, onClick: () => void }) => {
  return (
    <div className={styles.listBoxElement} key={key}>
      {children}
      <ListBoxRemoveButton text='Eliminar' onClick={onClick} />
    </div>
  )
}
