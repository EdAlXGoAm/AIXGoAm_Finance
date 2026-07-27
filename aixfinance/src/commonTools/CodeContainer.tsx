import React, { useState } from 'react';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { CustomClipboardButton } from '../utils/formatUtils';
import styles from '../styles/CodeContainer.module.css';

interface CodeContainerProps {
  code: string;
  maxWidth?: string;
  fontSize?: string;
  padding?: string;
}

export const CodeContainer: React.FC<CodeContainerProps> = ({ code, maxWidth = '100%', fontSize = '10px', padding = '10px' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await writeText(code).catch((err) => console.error(err));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: padding ? padding : '10px',
        backgroundColor: '#f5f5f5',
        maxWidth: maxWidth,
        overflowX: 'auto'
      }}
      className={styles.codeContainer}
    >
      <pre style={{ margin: 0, whiteSpace: 'pre', fontSize: fontSize }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};
