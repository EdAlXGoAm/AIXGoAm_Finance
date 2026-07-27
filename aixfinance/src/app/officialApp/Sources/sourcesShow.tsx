import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { RemoteSourceData } from '@/services/apiSource';
import { NavigationPanel } from '@/commonNavigation/NavigationPanel';

interface SourcesShowProps {
  sources: RemoteSourceData[];
  isLoadingSources: boolean;
  onEditSource: (source: RemoteSourceData) => void;
  onDeleteSource: (id: string) => void;
  onNewSource: () => void;
  mainFilter?: string;
  setMainFilter?: (filter: string) => void;
  setOpenTriggeredFromExternalComponent?: (open: boolean) => void;
  setIdSourceTriggeredFromExternalComponent?: (source: RemoteSourceData | null) => void;
}

export default function SourcesShow({
  sources,
  isLoadingSources,
  onEditSource,
  onDeleteSource,
  onNewSource,
  mainFilter,
  setMainFilter,
  setOpenTriggeredFromExternalComponent,
  setIdSourceTriggeredFromExternalComponent,
}: SourcesShowProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredSources, setFilteredSources] = useState<RemoteSourceData[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSources(sources.slice().sort((a, b) => a.name.localeCompare(b.name)).slice(-10));
    } else {
      const fuse = new Fuse(sources, {
        keys: ['name', 'description'],
        threshold: 0.3,
      });
      const results = fuse.search(searchQuery);
      const matchedSources = results.map(result => result.item);
      setFilteredSources(matchedSources.slice().sort((a, b) => a.name.localeCompare(b.name)).slice(-10));
    }
  }, [searchQuery, sources]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  interface NavItem<T> {
    data: T;
    name: string;
    description: string;
    image: string;
  }

  const [navItemsFromSources, setNavItemsFromSources] = useState<NavItem<RemoteSourceData>[]>([]);


  const handleEditSource = (item: NavItem<RemoteSourceData>) => {
    onEditSource(item.data);
  };

  const handleDeleteSource = (item: NavItem<RemoteSourceData>) => {
    onDeleteSource(item.data._id);
  };

  const handleSelectSource = (item: NavItem<RemoteSourceData>) => {
    if (setMainFilter) {
      setMainFilter(item.name);
    }
    if (setIdSourceTriggeredFromExternalComponent) {
      setIdSourceTriggeredFromExternalComponent(item.data);
    }
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
      <NavigationPanel
        items={navItemsFromSources}
        onAdd={onNewSource}
        onEdit={handleEditSource}
        onDelete={handleDeleteSource}
        onSelect={handleSelectSource}
        setOpenTriggeredFromExternalComponent={setOpenTriggeredFromExternalComponent}
      />
    </div>
  );
}
