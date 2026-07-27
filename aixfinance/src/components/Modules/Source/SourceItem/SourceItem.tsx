import React from 'react';
import { SourceItemProvider } from './SourceItemContext';
import SourceItemForm from './SourceItemForm';
// import SourceItemNavbar from './SourceItemNavbar';
// import SourceCards from './SourceCards';

export const SourceItem: React.FC = () => {
  return (
    <SourceItemProvider>
      <SourceItemForm />
      {/* <SourceItemNavbar /> */}
      {/* <SourceCards /> */}
    </SourceItemProvider>
  );
};