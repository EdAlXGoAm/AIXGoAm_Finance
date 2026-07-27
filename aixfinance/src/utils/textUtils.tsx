import React from 'react'
import styles from '../styles/utils/textUtils.module.css'
import { Row, Column } from './formatUtils'

export const Paragraph = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.paragraph}>
      {children}
    </div>
  )
}

export const TextLine = ({ children, variable, fontSize, mb, mt }: { children: React.ReactNode, variable?: string, fontSize?: string, mb?: string, mt?: string }) => {
  return (
    <Row mb={mb || '0'} mt={mt || '0'}>
      <Column mb={mb || '0'} mt={mt || '0'}>
        <span className={styles.textLine} style={{ fontSize: fontSize }}>
          {variable &&
            <span className={styles.variable}>
              {`${variable}: `}
            </span>
          }
          <span>{children}</span>
        </span>
      </Column>
    </Row>
  )
}

export const TextLineTwoLines = ({ children, variable, fontSize, mb, mt }: { children: React.ReactNode, variable?: string, fontSize?: string, mb?: string, mt?: string }) => {
  return (
    <Row mb={mb || '0'} mt={mt || '0'}>
      <Column mb={mb || '0'} mt={mt || '0'}>
        {variable &&
          <span className={styles.variable} style={{ fontSize: fontSize }}>
            {`${variable}: `}
          </span>
        }
        <span style={{ fontSize: fontSize }}>{children}</span>
      </Column>
    </Row>
  )
}
     
export const CenteredLabel = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className={styles.centeredLabel}>
      {children}
    </span>
  )
}

export const CenteredSelect = ({ children, label, width }: { children: React.ReactNode, label?: string, width?: string }) => {
  return (
    <React.Fragment>
      <div className={styles.centeredSelectContainer}>
        {label && <CenteredLabel>{label}</CenteredLabel>}
        <div className={styles.centeredSelect} style={{ width: width || 'auto' }}>
          {children}
        </div>
      </div>
    </React.Fragment>
  )
}

