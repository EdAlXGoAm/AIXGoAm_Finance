import styles from './frontContainer.module.css';

export const FrontOverlayContainer = ({ children, overlayRef }: { children: React.ReactNode, overlayRef: React.RefObject<HTMLDivElement> }) => {
  return <div className={styles.overlay} ref={overlayRef}>{children}</div>;
};

export const FrontModalContainer = ({ children, modalRef, maxWidth }: { children: React.ReactNode, modalRef: React.RefObject<HTMLDivElement>, maxWidth: string }) => {
  return <div className={styles.modal} ref={modalRef} style={{ '--max-width-modal': maxWidth } as React.CSSProperties}>{children}</div>;
};

export const FrontCloseButton = ({ handleClose }: { handleClose: () => void }) => {
  return <button className={styles.closeButton} onClick={handleClose}>X</button>;
};

export const FrontResponsiveContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.responsiveContainer}>{children}</div>;
};

export const FrontResponsiveColumn = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.responsiveColumn}>{children}</div>;
};

export const FrontResponsiveBoxInfo = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.boxInfoContainer}>{children}</div>;
};

export const FrontResponsiveColumnBoxInfo = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.columnBoxInfo}>{children}</div>;
};
