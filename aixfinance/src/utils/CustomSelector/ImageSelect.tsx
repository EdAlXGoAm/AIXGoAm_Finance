import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/utils/CustomSelector/imageSelect.module.css';

interface Option<T> {
  value: T;
  label: string;
  image?: string;
}

interface ImageSelectProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  compareFn?: (a: T, b: T) => boolean;
  disabled?: boolean;
}

const defaultCompareFn = <T,>(a: T, b: T): boolean => {
  return a === b;
};

const ImageSelect = <T,>({ options, value, onChange, compareFn, disabled }: ImageSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option<T> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedOption(() => {
      const compare = compareFn || defaultCompareFn;
      const matchedOption = options.find(option => compare(option.value, value));
      return matchedOption || null;
    });
  }, [value]);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleOptionClick = (val: T) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.imageSelectContainer} ref={containerRef} style={{ width: '100%' }}>
      <div className={styles.selectedOption} onClick={disabled ? undefined : toggleDropdown}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
        {selectedOption?.image && (
          <img src={selectedOption.image} alt={selectedOption.label} className={styles.optionImage} />
        )}
        <span>{selectedOption ? selectedOption.label : 'Selecciona una opción'}</span>
        {!disabled && <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>}
      </div>
      {isOpen && (
        <ul className={styles.optionsList} style={{ padding: '0' }}>
          {options.map((option, index) => (
            <li
              key={index}
              className={`${styles.optionItem} ${option.value === value ? styles.selected : ''}`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.image && (
                <img src={option.image} alt={option.label} className={styles.optionImage} />
              )}
              <span>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ImageSelect;
