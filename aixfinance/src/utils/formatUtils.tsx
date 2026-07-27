import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/utils/formatUtils.module.css';
import { Property } from 'csstype'

export const Row = ({ children, mt, mb }: { children: React.ReactNode, mt?: string, mb?: string }) => {
  return (
    <div 
      style={{
        display: 'flex',
        gap: '16px',
        marginBottom: mb || '0px',
        marginTop: mt || '0px'
      }}
    >
      {children}
    </div>
  )
}

export const Column = ({
  children,
  width,
  alignment,
  border,
  mt,
  mb
}: {
  children: React.ReactNode
  width?: string
  alignment?: Property.TextAlign
  border?: boolean
  mt?: string
  mb?: string
}) => {
  return (
    <div style={{ width: width || '100%', margin: '0 auto', textAlign: alignment || 'left',
      marginTop: mt || '0px',
      marginBottom: mb || '0px',
      ...(border ? {
        marginBottom: '10px',
        padding: '10px',
        border: '2px solid #2d2d2d',
        borderRadius: '10px',
        backgroundColor: '#f0f0f0'
      } : {})
    }}
    >
      {children}
    </div>
  )
}

export const MiddleColumn = ({ children, width, mt, mb }: { children: React.ReactNode, width: string, mt?: string, mb?: string }) => {
  return (
    <div style={{ flex: 1, width, marginTop: mt || "0px", marginBottom: mb || "0px" }}>
      {children}
    </div>
  )
}

export const VariableText = ({ variable, value, mt, mb, fontSize }: { variable: String, value: String, mt?: string, mb?: string, fontSize?: string }) => {
  return (
    <>
      <span className={styles.paddingSpanText} style={{ marginBottom: mb || '0px', marginTop: mt || '0px', paddingTop: '0px', paddingBottom: '0px', fontSize: fontSize || '0.8rem' }}>
        <span className={styles.textSmallBold} style={{ marginBottom: '0px', fontSize: fontSize || '0.8rem' }}>
          {`${variable}: `}
        </span>
        <span className={styles.textSmall} style={{ fontSize: fontSize || '0.8rem' }}>
          {value !== '' ? (
          ` ${value}`
          ) : (
            <span className={styles.textSmallItalic} style={{ fontSize: fontSize || '0.8rem' }}>
              {` empty`}
            </span>
          )}
        </span>
      </span>
    </>
  )
}

export const CustomAddButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={styles.custAddButton} onClick={onClick}>
      <a>Agregar</a>
    </div>
  )
}

export const CustomEditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={styles.faContainer}>
      <div className={styles.faButtons} onClick={onClick}>
        <FontAwesomeIcon icon={faEdit} size="sm" />
      </div>
    </div>
  )
}

export const CustomDeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={styles.faContainer}>
      <div className={styles.faButtons} onClick={onClick}>
        <FontAwesomeIcon icon={faTrash} size="sm" />
      </div>
    </div>
  )
}

export const CustomClipboardButton = ({ onClick, copied }: { onClick: () => void, copied: boolean }) => {
  return (
    <div className={styles.faContainer}>
      <div className={styles.faButtons} onClick={onClick}>
        <FontAwesomeIcon icon={faClipboard} size="sm" />
      </div>
    </div>
  )
}

export const TableCRUD = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.tableCRUD}>{children}</div>
  )
}

export const TDCRUD = ({ children }: { children: React.ReactNode }) => {
  return (
    <td className={styles.tdCRUD}>{children}</td>
  )
}
