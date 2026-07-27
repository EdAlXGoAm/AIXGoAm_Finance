import React, { useState, useEffect } from 'react';
import formButtonStyles from './frontButtons.module.css';

export const ButtonCircle = (
  {textToShow, positionX, positionY, action}: {
    textToShow: string,
    positionX: number,
    positionY: number,
    action: () => void
  }
) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className={formButtonStyles.buttonContainer}
      style={{
        '--add-button-bottom': `${positionY}px`,
        '--add-button-right': `${positionX}px`,
      } as React.CSSProperties}
    >
      {!isMobile && (
        <div className={formButtonStyles.floatingLabel}>
          {textToShow}
        </div>
      )}
      <button
        className={formButtonStyles.addButtonCircle}
        title={textToShow}
        onClick={action}
      >
        {isMobile ? textToShow : '+'}
      </button>
    </div>
  );
};

export const ButtonRectangle = ({textToShow, action}: {
  textToShow: string,
  action: () => void
}) => {
  return <button className={formButtonStyles.addButtonRectangle} onClick={action}>{textToShow}</button>;
};

export const ButtonSubmit = ({actionText, loading, action}: {
  actionText: string,
  loading: boolean,
  action: () => void
}) => {
  return (
    <div className={formButtonStyles.buttonContainerRight}>
      <button className={formButtonStyles.submitButton} disabled={loading} onClick={action}>
        {loading ? 'Loading ...' : actionText}
      </button>
    </div>
  );
};

export const ListBoxAddButton = ({ text, onClick }: { text: string, onClick: () => void }) => {
  return <button className={formButtonStyles.listBoxAddButton} onClick={onClick}>Agregar</button>;
};

export const ListBoxRemoveButton = ({ text, onClick }: { text: string, onClick: () => void }) => {
  return <button className={formButtonStyles.listBoxRemoveButton} onClick={onClick}>Eliminar</button>;
};
