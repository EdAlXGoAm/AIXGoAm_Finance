import React from 'react';
import { SourceProvider } from './Modules/Source/SourceContext';
import SourceForm from './Modules/Source/SourceForm';
import SourceNavbar from './Modules/Source/SourceNavbar';
// import SourceCards from './SourceCards';
import { SourceItemProvider } from './Modules/Source/SourceItem/SourceItemContext';
import SourceItemForm from './Modules/Source/SourceItem/SourceItemForm';
import SourceItemTable from './Modules/Source/SourceItem/SourceItemTable';
import { SourceItemTrackerProvider } from './Modules/Source/SourceItem/SourceItemTrackerContext';
import TrackingItemsTable from './Modules/Source/SourceItem/SourceItemTrackerTable';
import { SourceItemCartProvider } from './Modules/Source/SourceItem/SourceItemCart/SourceItemCartContext';
import SourceItemCartForm from './Modules/Source/SourceItem/SourceItemCart/SourceItemCartForm';
import SourceItemCartTable from './Modules/Source/SourceItem/SourceItemCart/SourceItemCartTable';

import InventoryForm from './Modules/Inventory/InventoryForm';
import { InventoryProvider } from './Modules/Inventory/InventoryContext';

export const Finance: React.FC = () => {
  return (
    <React.Fragment>
      <SourceProvider>
        <SourceItemProvider>
          <SourceForm />
          <SourceNavbar />
          {/* <SourceCards /> */}
          <SourceItemTrackerProvider>
            <SourceItemCartProvider>
              <SourceItemTable />
              <TrackingItemsTable />
              <SourceItemForm />
              <SourceItemCartTable />
              <SourceItemCartForm />
            </SourceItemCartProvider>
          </SourceItemTrackerProvider>
        </SourceItemProvider>
      </SourceProvider>
      <InventoryProvider>
        <InventoryForm />
      </InventoryProvider>
    </React.Fragment>
  );
};