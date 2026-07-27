import React, { useState, useRef, useEffect } from 'react';
import { Tooltip, Menu } from 'antd';
import styles from './NavigationPanel.module.css';
import type { MenuProps } from 'antd';

export interface NavItem<T> {
  data: T;
  id: string;
  name: string;
  description: string;
  image: string;
}

interface BubbleNavigatorElementsProps<T> {
  navItems: NavItem<T>[];
  onCreate: () => void;
  onEdit: (item: NavItem<T>) => void;
  onDelete: (item: NavItem<T>) => void;
  onSelect?: (item: NavItem<T>) => void;
  apiDelete: (id: string) => Promise<any>;
  otherActions?: {
    [key: string]: (item: NavItem<T>) => void;
  };
}

export const BubbleNavigatorElements = <T,>({
  navItems,
  onCreate,
  onEdit,
  onDelete,
  onSelect,
  apiDelete,
  otherActions,
}: BubbleNavigatorElementsProps<T>) => {
  const [visibleMenu, setVisibleMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    item: NavItem<T> | null;
  }>({ visible: false, x: 0, y: 0, item: null });

  const panelRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent, item: NavItem<T>) => {
    e.preventDefault();
    setVisibleMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      item: item,
    });
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (visibleMenu.item) {
      if (key === 'editar') {
        onEdit(visibleMenu.item);
      } else if (key === 'eliminar') {
        apiDelete(visibleMenu.item.id);
        onDelete(visibleMenu.item);
      } else if (key === 'createItem' && otherActions?.createItem) {
        otherActions.createItem(visibleMenu.item);
      }
    }
    setVisibleMenu({ ...visibleMenu, visible: false });
  };

  // Función para detectar clics fuera del menú contextual
  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      visibleMenu.visible
    ) {
      setVisibleMenu({ ...visibleMenu, visible: false });
    }
  };

  // Agregar y limpiar el listener de clics fuera
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const handleWheel = (e: WheelEvent) => {
    if (e.shiftKey && panelRef.current) {
      e.preventDefault();
      panelRef.current.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    const currentPanel = panelRef.current;
    if (currentPanel) {
      currentPanel.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (currentPanel) {
        currentPanel.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const menuItems: MenuProps['items'] = [
    { key: 'editar', label: 'Editar' },
    { key: 'eliminar', label: 'Eliminar' },
    { key: 'createItem', label: 'Crear Item' },
  ];

  const renderBubbleNavigatorElements = () => {
    return (
      <div
        className={styles.navigationPanelContainer}
        ref={panelRef}
      >
        <div className={styles.navigationPanel}>
          {navItems.map((item, index) => (
            <div
              key={index}
              className={styles.navItem}
              onClick={() => {onSelect?.(item)}}
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              <Tooltip title={item.description}>
                <div className={styles.profileContainer}>
                  <img src={item.image} alt={item.name} className={styles.profileImage} />
                  <span className={styles.profileName}>{item.name}</span>
                </div>
              </Tooltip>
            </div>
          ))}
          <div className={styles.navItem} onClick={onCreate}>
            <div className={styles.profileContainer}>
              <div className={styles.addIcon}>+</div>
              <span className={styles.profileName}>Agregar</span>
            </div>
          </div>
        </div>

        {visibleMenu.visible && visibleMenu.item && (
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: visibleMenu.y,
              left: visibleMenu.x,
              zIndex: 1000,
            }}
          >
            <Menu
              onClick={handleMenuClick}
              items={menuItems}
            />
          </div>
        )}
      </div>
    );
  }

  return {
    renderBubbleNavigatorElements,
  };
}; 