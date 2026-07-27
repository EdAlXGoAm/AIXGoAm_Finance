import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { RemoteInventoryData } from '@/services/Inventario/apiInventory';
import { NavigationPanel } from '@/commonNavigation/NavigationPanel';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

interface InventoriesShowProps {
  inventories: RemoteInventoryData[];
  isLoadingInventories: boolean;
  onEditInventory: (inventory: RemoteInventoryData) => void;
  onDeleteInventory: (id: string) => void;
  onNewInventory: () => void;
}

export default function InventoriesShow({
  inventories,
  isLoadingInventories,
  onEditInventory,
  onDeleteInventory,
  onNewInventory,
}: InventoriesShowProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredInventories, setFilteredInventories] = useState<RemoteInventoryData[]>([]);
  
  const inventoryTypes = useMemo(() => {
    return Array.from(new Set(inventories.map(inv => inv.type)));
  }, [inventories]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInventories(inventories.slice().sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      const fuse = new Fuse(inventories, {
        keys: ['name', 'description'],
        threshold: 0.3,
      });
      const results = fuse.search(searchQuery);
      const matchedInventories = results.map(result => result.item);
      setFilteredInventories(matchedInventories.slice().sort((a, b) => a.name.localeCompare(b.name)));
    }
  }, [searchQuery, inventories]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  interface NavItem<T> {
    data: T;
    name: string;
    description: string;
    image: string;
  }

  const [navItemsByType, setNavItemsByType] = useState<{ [key: string]: NavItem<RemoteInventoryData>[] }>({});

  useEffect(() => {
    console.log('useEffect [filteredInventories, inventoryTypes]');
    const groupedItems: { [key: string]: NavItem<RemoteInventoryData>[] } = {};
    inventoryTypes.forEach(type => {
      groupedItems[type] = filteredInventories
        .filter(inv => inv.type === type)
        .map(inv => ({
          data: inv,
          name: inv.name,
          description: inv.description,
          image: inv.image,
        }));
    });
    setNavItemsByType(groupedItems);
  }, [filteredInventories, inventoryTypes]);

  const handleEditInventory = (item: NavItem<RemoteInventoryData>) => {
    onEditInventory(item.data);
  };

  const handleDeleteInventory = (item: NavItem<RemoteInventoryData>) => {
    onDeleteInventory(item.data._id);
  };

  const handleSelectInventory = (item: NavItem<RemoteInventoryData>) => {
    // Implementa la lógica si necesitas manejar la selección de un inventario
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />
      {inventoryTypes.map((type, index) => (
        navItemsByType && navItemsByType[type] && navItemsByType[type].length > 0 &&
        <Accordion key={index} defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">{type}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <NavigationPanel
                items={navItemsByType[type]}
                onAdd={onNewInventory}
                onEdit={handleEditInventory}
                onDelete={handleDeleteInventory}
                onSelect={handleSelectInventory}
              />
          </AccordionDetails>
        </Accordion>  
      ))}
    </div>
  );
}
