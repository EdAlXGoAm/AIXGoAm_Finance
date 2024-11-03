
export const Row = ({ children }: { children: React.ReactNode }) => {
  return (
    <div 
      style={{
        display: 'flex',
        gap: '16px',
      }}
    >
      {children}
    </div>
  )
}

export const Column = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ flex: 1 }}>
      {children}
    </div>
  )
}

export const RowForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <Row>
      <Column>{children}</Column>
    </Row>
  )
}
