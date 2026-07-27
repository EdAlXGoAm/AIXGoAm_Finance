import React, { useState, useEffect } from 'react';
import styles from './BoardContainer.module.css';

const BoardContainer = ({ children, title, animatedText }: { children: React.ReactNode, title: string, animatedText: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    const typingSpeed = 100; // Velocidad de escritura en ms
    const deletingSpeed = 50; // Velocidad de borrado en ms
    const staticTime = 300000; // Tiempo estático de 5 minutos en ms

    if (!isDeleting && typingIndex < animatedText.length) {
      typingTimeout = setTimeout(() => {
        setDisplayedText(prev => prev + animatedText.charAt(typingIndex));
        setTypingIndex(prev => prev + 1);
      }, typingSpeed);
    } else if (!isDeleting && typingIndex === animatedText.length) {
      typingTimeout = setTimeout(() => {
        setIsDeleting(true);
      }, staticTime);
    } else if (isDeleting && typingIndex > 0) {
      typingTimeout = setTimeout(() => {
        setDisplayedText(prev => prev.slice(0, -1));
        setTypingIndex(prev => prev - 1);
      }, deletingSpeed);
    } else if (isDeleting && typingIndex === 0) {
      setIsDeleting(false);
    }

    return () => clearTimeout(typingTimeout);
  }, [displayedText, isDeleting, typingIndex, animatedText]);

  return (
    <div className={styles.navBarContainer}>
      <div className={styles.navBarBorder}>
        <div className={styles.navBarHeader}>
          <h2 className={styles.navBarTitle}>{title}</h2>
          <p className={styles.animatedText}>{displayedText}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export default BoardContainer;

