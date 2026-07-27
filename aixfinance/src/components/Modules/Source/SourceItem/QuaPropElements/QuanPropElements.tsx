// aixfinance/src/components/Modules/Source/SourceItem/quanPropsElements.tsx

export interface QuantitativeProp {
  propPurpose: string;
  propLabel: string;
  propUnit: string;
  propValue: number;
  conversionFactor?: number; // Nuevo campo para el factor de conversión personalizado
}

export const propLabelOptions = {
  default: [
    { value: '', label: 'Seleccione Etiqueta' },
    { value: 'unit', label: 'Unidad' },
    { value: 'weight', label: 'Peso' },
    { value: 'volume', label: 'Volumen' },
    { value: 'length', label: 'Longitud' },
    { value: 'time', label: 'Tiempo' },
  ],
  consumption: [
    { value: '', label: 'Seleccione Etiqueta' },
    { value: 'unit', label: 'Unidad' },
    { value: 'weight', label: 'Peso' },
    { value: 'volume', label: 'Volumen' },
    { value: 'length', label: 'Longitud' },
    { value: 'time', label: 'Tiempo' },
  ],
  usage: [
    { value: '', label: 'Seleccione Etiqueta' },
    { value: 'warranty', label: 'Garantía' },
    { value: 'payback', label: 'Retorno' },
  ],
  other: [
    { value: '', label: 'Seleccione Etiqueta' },
    { value: 'unit', label: 'Unidad' },
    { value: 'weight', label: 'Peso' },
    { value: 'volume', label: 'Volumen' },
    { value: 'length', label: 'Longitud' },
    { value: 'time', label: 'Tiempo' },
    { value: 'warranty', label: 'Garantía' },
    { value: 'payback', label: 'Retorno' },
  ],
};

export const propUnitOptions = {
  unit: [
    { value: '', label: 'Seleccione Unidad' },
    { value: 'pz', label: 'Pieza' },
    { value: 'reb', label: 'Rebanada' },
    { value: 'bag', label: 'Bolsa' },
    { value: 'dom', label: 'Domo' },
    { value: 'por', label: 'Porción' },
    { value: 'pkg', label: 'Paquete' },
  ],
  weight: [
    { value: '', label: 'Seleccione Unidad' },
    { value: 'kg', label: 'Kilogramo' },
    { value: 'g', label: 'Gramo' },
  ],
  volume: [
    { value: '', label: 'Seleccione Unidad' },
    { value: 'l', label: 'Litro' },
    { value: 'ml', label: 'Mililitro' },
    { value: 'm3', label: 'Metro Cúbico' },
    { value: 'cm3', label: 'Centímetro Cúbico' },
  ],
  length: [
    { value: '', label: 'Seleccione Unidad' },
    { value: 'm', label: 'Metro' },
    { value: 'cm', label: 'Centímetro' },
  ],
  time: [
    { value: '', label: 'Seleccione Unidad' },
    { value: 'y', label: 'Año' },
    { value: 'm', label: 'Mes' },
    { value: 'd', label: 'Día' },
    { value: 'h', label: 'Hora' },
    { value: 'min', label: 'Minuto' },
    { value: 's', label: 'Segundo' },
  ],
  warranty: [
    { value: '', label: 'Seleccione Unidad' },
    { value: 'year', label: 'Año' },
    { value: 'month', label: 'Mes' },
    { value: 'day', label: 'Día' },
  ],
  payback: [
    { value: '', label: 'Seleccione Unidad' },
    { value: 'day', label: 'Día' },
    { value: 'hour', label: 'Hora' },
    { value: 'minute', label: 'Minuto' },
  ],
};

// Funciones adicionales para conversión
export const convertUnits = (
  value: number,
  fromUnit: string,
  toUnit: string,
  customFactors: { [unit: string]: number } = {}
): number => {
  // Mapear unidades a su tipo y factor de conversión hacia la unidad base
  const units: { [type: string]: { [unit: string]: number } } = {
    unit: {
      'pz': 1,
      'reb': 1,
      'bag': 1,
      'dom': 1,
      'por': 1,
      'pkg': 1,
    },
    weight: {
      'kg': 1,
      'g': 0.001,
    },
    volume: {
      'l': 1,
      'ml': 0.001,
      'm3': 1000,
      'cm3': 0.001,
    },
    length: {
      'm': 1,
      'cm': 0.01,
    },
    time: {
      's': 1,
      'min': 60,
      'h': 3600,
      'd': 86400,
      'mo': 2592000,
      'y': 31536000,
    },
    warranty: {
      'day': 1,
      'month': 30,
      'year': 365,
    },
    payback: {
      'minute': 1,
      'hour': 60,
      'day': 1440,
    },
  };

  // Incorporar factores personalizados proporcionados por el usuario
  for (const unit in customFactors) {
    for (const type in units) {
      if (units[type][unit] !== undefined) {
        units[type][unit] = customFactors[unit];
      }
    }
  }

  // Resto de la lógica para encontrar tipos y realizar la conversión
  let fromType = '';
  let toType = '';

  for (const type in units) {
    if (fromUnit in units[type]) {
      fromType = type;
    }
    if (toUnit in units[type]) {
      toType = type;
    }
  }

  if (!fromType || !toType) {
    throw new Error(`Unidad desconocida: ${fromUnit} o ${toUnit}`);
  }
  if (fromType !== toType) {
    throw new Error(`No se pueden convertir unidades de tipos diferentes (${fromType} a ${toType})`);
  }

  const fromFactor = units[fromType][fromUnit];
  const toFactor = units[toType][toUnit];

  const valueInBaseUnit = value * fromFactor;
  const convertedValue = valueInBaseUnit / toFactor;

  return convertedValue;
};

interface Consumption {
  consumptionId: number;
  unit: string;
  quantity: number;
}

export const calculateRemainingQuantity = (
  initialProps: QuantitativeProp[],
  consumptions: Consumption[]
): { [unit: string]: number } => {
  // Definir la unidad base (por ejemplo, 'pkg')
  const baseUnit = initialProps.find(prop => prop.propPurpose === 'default')?.propUnit;
  if (!baseUnit) {
    throw new Error('No se encontró la unidad base en las propiedades iniciales.');
  }

  // Crear factores personalizados
  const customFactors: { [unit: string]: number } = {};

  // Añadir el factor para la unidad base
  customFactors[baseUnit] = 1;

  // Añadir factores para otras unidades basadas en las propiedades
  initialProps.forEach(prop => {
    if (prop.propUnit !== baseUnit && prop.propValue) {
      customFactors[prop.propUnit] = 1 / (prop.propValue as number);
    }
  });

  // Calcular el consumo total en la unidad base
  let totalConsumedInBaseUnit = 0;
  consumptions.forEach(consumption => {
    totalConsumedInBaseUnit += convertUnits(
      consumption.quantity,
      consumption.unit,
      baseUnit,
      customFactors
    );
  });

  // Cantidad inicial en la unidad base
  const initialQuantityInBaseUnit = initialProps.find(prop => prop.propUnit === baseUnit)?.propValue || 0;

  // Cantidad restante en la unidad base
  const remainingInBaseUnit = initialQuantityInBaseUnit - totalConsumedInBaseUnit;

  // Convertir la cantidad restante a todas las unidades registradas
  const remainingQuantities: { [unit: string]: number } = {};

  for (const unit in customFactors) {
    remainingQuantities[unit] = convertUnits(remainingInBaseUnit, baseUnit, unit, customFactors);
  }

  return remainingQuantities;
};