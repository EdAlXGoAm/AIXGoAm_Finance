import { useEffect, useState } from 'react';
import { useSource } from './SourceContext';
import { useSourceItem } from './SourceItem/SourceItemContext';
import { RemoteSourceData, emptySourceFormData, RemoteToModel, deleteSourceAndChilds } from '@/services/api/source/apiSource';
import { BubbleNavigatorElements, NavItem } from '@/commonNavigation/bubbleNavigatorElements';
import { searchBar } from '@/commonTools/Tools';
import Fuse from 'fuse.js';
import BoardContainer from '@/commonTools/BoardContainer';
import { emptySourceItemFormData } from '@/services/api/source/apiSourceItem';

const SourceNavbar: React.FC = () => {
  const {
    setElementToCreateSource,
    setElementToEditSource,
    sources, setSources,
    setSelectedSource,
  } = useSource();

  const {
    setElementToCreateSourceItem,
  } = useSourceItem();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredSources, setFilteredSources] = useState<RemoteSourceData[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSources(
        sources
          .slice()
          .filter(source => source.name)
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(-10)
      );
    } else {
      const fuse = new Fuse(sources, {
        keys: ['name', 'description'],
        threshold: 0.3,
      });
      const results = fuse.search(searchQuery);
      const matchedSources = results.map(result => result.item);
      setFilteredSources(
        matchedSources
          .slice()
          .filter(source => source.name)
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(-10)
      );
    }
  }, [searchQuery, sources]);

  const [navItems, setNavItems] = useState<NavItem<RemoteSourceData>[]>([]);

  useEffect(() => {
    setNavItems(filteredSources.map(source => ({
      id: source._id,
      data: source,
      name: source.name,
      description: source.description,
      image: source.image,
    })));
  }, [filteredSources]);
  
  const {
    renderBubbleNavigatorElements,
  } = BubbleNavigatorElements({
    navItems,
    onCreate: () => setElementToCreateSource(emptySourceFormData),
    onEdit: (item: NavItem<RemoteSourceData>) => setElementToEditSource(RemoteToModel(item.data)),
    onDelete: (item: NavItem<RemoteSourceData>) => setSources(sources.filter(source => source._id !== item.data._id)),
    otherActions: {
      createItem: (item: NavItem<RemoteSourceData>) => setElementToCreateSourceItem(
        {
          ...emptySourceItemFormData,
          id_source: item.data,
        }
      ),
    },
    onSelect: (item: NavItem<RemoteSourceData>) => setSelectedSource(item.data),
    apiDelete: (id: string) => deleteSourceAndChilds(id),
  });

  return (
    <BoardContainer title="Sources" animatedText="These are the physical and online sources for your items">
      {searchBar(searchQuery, setSearchQuery, 'Buscar nombre o descripción...')}
      {renderBubbleNavigatorElements()}
    </BoardContainer>
  );
}

export default SourceNavbar;
