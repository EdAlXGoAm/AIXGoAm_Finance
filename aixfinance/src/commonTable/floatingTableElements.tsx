import { TableSortLabel } from "@mui/material";
import { TableCell } from "@mui/material";
import { useRef, useState, useEffect, useMemo } from "react";
import { ButtonRectangle } from "@/commonForm/FrontButtons";

interface SortedRule {
  orderBy: string;
  type: 'alphabetically' | 'numerically';
}

interface FloatingTableElementsProps {
  elements?: any[];
  mainFilterKey?: string;
  mainFilterValue?: string;
  grouped?: boolean;
  sortedRules?: SortedRule[];
  onCloseExternalActions?: () => void;
}

export const FloatingTableElements = ({ elements, mainFilterKey, mainFilterValue, grouped, sortedRules, onCloseExternalActions }: FloatingTableElementsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  useEffect(() => {
    if (mainFilterValue) {
      setIsOpen(true);
    }
  }, [mainFilterValue]);

  const handleClose = () => {
    setIsOpen(false);
    onCloseExternalActions && onCloseExternalActions();
  }

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [clickStartedInside, setClickStartedInside] = useState(false);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (modalRef.current && modalRef.current.contains(event.target as Node)) {
        setClickStartedInside(true);
      } else {
        setClickStartedInside(false);
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!clickStartedInside && overlayRef.current && overlayRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [clickStartedInside, handleClose]);

  const [orderBy, setOrderBy] = useState<string>(sortedRules ? sortedRules[0].orderBy : 'name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((value, key) => {
      return value ? value[key] : null;
    }, obj);
  };

  const sortedElements = useMemo(() => {
    if (!elements || !sortedRules || sortedRules.length < 2) return elements || [];

    let mainFilteredElements: any[] = [];
    if (mainFilterValue && mainFilterKey) {
      mainFilteredElements = elements.filter((element) => {
        return getNestedValue(element, mainFilterKey) === mainFilterValue;
      });
    } else {
      mainFilteredElements = elements;
    }

    let relevantElements: any[] = [];
    if (sortedRules.length > 2 && grouped) {
      const primaryRule = sortedRules[0];
      const secondaryRule = sortedRules[1];

      // Crear un mapa para almacenar el elemento más reciente por cada valor único del primer criterio
      const uniqueElementsMap = new Map<string, any>();

      mainFilteredElements.forEach(element => {
        const primaryValue = getNestedValue(element, primaryRule.orderBy);
        const secondaryValue = getNestedValue(element, secondaryRule.orderBy);

        if (!primaryValue || !secondaryValue) return;

        if (!uniqueElementsMap.has(primaryValue)) {
          uniqueElementsMap.set(primaryValue, element);
        } else {
          const existingElement = uniqueElementsMap.get(primaryValue);
          const existingSecondaryValue = getNestedValue(existingElement, secondaryRule.orderBy);

          // Comparar las fechas y mantener el elemento más reciente
          if (new Date(secondaryValue) > new Date(existingSecondaryValue)) {
            uniqueElementsMap.set(primaryValue, element);
          }
        }
      });

      relevantElements = Array.from(uniqueElementsMap.values());
    }
    else {
      relevantElements = mainFilteredElements || [];
    }

    if (!relevantElements) return [];
    const rule = sortedRules?.find((rule) => rule.orderBy === orderBy);
    if (!rule) return relevantElements;

    const localSortedElements = relevantElements.slice().sort((a, b) => {
      const aValue = getNestedValue(a, orderBy);
      const bValue = getNestedValue(b, orderBy);

      if (aValue === null || bValue === null) return 0;

      if (rule.type === 'alphabetically') {
        return order === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      } else if (rule.type === 'numerically') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    return localSortedElements;
  }, [elements, orderBy, order, sortedRules]);

  const renderButtonRectangle = (textToShow: string, action: () => void) => {
    return <ButtonRectangle textToShow={textToShow} action={action} />;
  }

  const renderHeaderCellAlphabetically = (label: string, property: string) => (
    <TableCell
      sortDirection={orderBy === property ? order : false}
      onClick={() => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      }}
    >
      <TableSortLabel active={orderBy === property} direction={order}>
        {label}
      </TableSortLabel>
    </TableCell>
  );

  const renderHeaderCellNumerically = (label: string, property: string) => {
    return (
      <TableCell>
        <TableSortLabel
          active={property === orderBy}
          direction={orderBy === property ? order as 'asc' | 'desc' : 'asc'}
          onClick={() => {
            const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
          }}
        >
          {label}
        </TableSortLabel>
      </TableCell>
    );
  }

  return {
    isOpen, setIsOpen,
    loadingTable, setLoadingTable,
    sortedElements,
    overlayRef,
    modalRef,
    handleClose,
    renderButtonRectangle,
    renderHeaderCellAlphabetically,
    renderHeaderCellNumerically,
  }
}
