import { useEffect, useState } from 'react';
import { useInventory } from './InventoryContext';
import { useInventoryItem } from './InventoryItem/InventoryItemContext';
import { RemoteInventoryData, emptyInventoryFormData, RemoteToModel, deleteInventoryAndChilds } from '@/services/api/inventory/apiInventory';
import { BubbleNavigatorElements, NavItem } from '@/commonNavigation/bubbleNavigatorElements';
import { searchBar } from '@/commonTools/Tools';
import Fuse from 'fuse.js';
import BoardContainer from '@/commonTools/BoardContainer';
import { emptyInventoryItemFormData } from '@/services/api/inventory/apiInventoryItem';

const InventoryNavbar: React.FC = () => {
  const {
    setElementToCreateInventory,
    setElementToEditInventory,
    inventories, setInventories,
    setSelectedInventory,
  } = useInventory();

  const {
    setElementToCreateInventoryItem,
  } = useInventoryItem();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredInventories, setFilteredInventories] = useState<RemoteInventoryData[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInventories(
        inventories
          .slice()
          .filter(inventory => inventory.name)
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(-10)
      );
    } else {
      const fuse = new Fuse(inventories, {
        keys: ['name', 'description'],
        threshold: 0.3,
      });
      const results = fuse.search(searchQuery);
      const matchedInventories = results.map(result => result.item);
      setFilteredInventories(
        matchedInventories
          .slice()
          .filter(source => source.name)
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(-10)
      );
    }
  }, [searchQuery, inventories]);

  const [navItems, setNavItems] = useState<NavItem<RemoteInventoryData>[]>([]);

  useEffect(() => {
    setNavItems(filteredInventories.map(inventory => ({
      id: inventory._id,
      data: inventory,
      name: inventory.name,
      description: inventory.description,
      image: inventory.image,
    })));
  }, [filteredInventories]);
  
  const {
    renderBubbleNavigatorElements,
  } = BubbleNavigatorElements({
    navItems,
    onCreate: () => setElementToCreateInventory(emptyInventoryFormData),
    onEdit: (item: NavItem<RemoteInventoryData>) => setElementToEditInventory(RemoteToModel(item.data)),
    onDelete: (item: NavItem<RemoteInventoryData>) => setInventories(inventories.filter(inventory => inventory._id !== item.data._id)),
    otherActions: {
      createItem: (item: NavItem<RemoteInventoryData>) => setElementToCreateInventoryItem(
        {
          ...emptyInventoryItemFormData,
          id_inventory: item.data,
        }
      ),
    },
    onSelect: (item: NavItem<RemoteInventoryData>) => setSelectedInventory(item.data),
    apiDelete: (id: string) => deleteInventoryAndChilds(id),
  });

  return (
    <BoardContainer title="Inventories" animatedText="These are the inventories for your items">
      {searchBar(searchQuery, setSearchQuery, 'Buscar nombre o descripción...')}
      {renderBubbleNavigatorElements()}
    </BoardContainer>
  );
}

export default InventoryNavbar;
