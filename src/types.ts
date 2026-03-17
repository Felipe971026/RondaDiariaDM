export type ItemStatus = 'CUMPLE' | 'NO_CUMPLE';

export interface Accessory {
  id: string;
  name: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  accessories?: Accessory[];
  allowMultiple?: boolean;
}

export interface AccessoryStatus {
  accessoryId: string;
  status: ItemStatus;
  hasNovelty: boolean;
  noveltyDescription?: string;
}

export interface CheckItem {
  id: string;
  equipmentId: string;
  service: string;
  cubicle?: string;
  status: ItemStatus;
  aestheticStatus?: ItemStatus;
  hasNovelty: boolean;
  noveltyDescription?: string;
  accessories: AccessoryStatus[];
  timestamp: string;
  quantity?: number;
  photo?: string;
}

export const SERVICES = [
  "UCI Adultos / Intensivo",
  "UCI Intermedios",
  "Cirugía",
  "Recuperación",
  "Esterilización",
  "Pasillo",
  "Camillas de Transporte",
  "Ambulancia Medicalizada"
];

// Services that require cubicle identification
export const CUBICLE_REQUIRED_SERVICES = [
  "UCI Adultos / Intensivo",
  "UCI Intermedios",
  "Cirugía",
  "Recuperación"
];

export const EQUIPMENT_LIST: Equipment[] = [
  { 
    id: 'mon-multi', 
    name: 'Monitor Multiparámetro', 
    category: 'Monitoreo',
    accessories: [
      { id: 'acc-oxi', name: 'Pinza de Oximetría' },
      { id: 'acc-ecg', name: 'Cable de Latiguillos ECG' },
      { id: 'acc-bra', name: 'Brazalete de Tensión' },
      { id: 'acc-man', name: 'Manguera de Tensión' },
      { id: 'acc-inv', name: 'Cable Presión Invasiva' },
      { id: 'acc-sop', name: 'Sujeción' },
    ]
  },
  { 
    id: 'cama-elec', 
    name: 'Cama Hospitalaria Eléctrica', 
    category: 'Mobiliario',
    accessories: [
      { id: 'acc-ctrl', name: 'Control de Mando' },
      { id: 'acc-pwr', name: 'Cable de Poder' },
      { id: 'acc-mov-esp', name: 'Movimiento Espaldar' },
      { id: 'acc-mov-alt', name: 'Movimiento Altura (Subir/Bajar)' },
      { id: 'acc-mov-tre', name: 'Movimiento Trendelenburg' },
    ]
  },
  { 
    id: 'sop-vent-adult', 
    name: 'Ventilador Mecánico Adulto', 
    category: 'Soporte Vital',
    accessories: [
      { id: 'acc-circ', name: 'Circuito de Paciente' },
      { id: 'acc-hum', name: 'Humidificador' },
      { id: 'acc-fil', name: 'Bateria' },
      { id: 'acc-bra-sop', name: 'Brazo Soporte' },
      { id: 'acc-pwr-v', name: 'Cable de Poder' },
    ]
  },
  { id: 'sop-vent-trans', name: 'Ventilador para Transporte', category: 'Soporte Vital' },
  { id: 'sop-ambu', name: 'Resucitador Manual (Ambú)', category: 'Soporte Vital' },
  { 
    id: 'inf-vol', 
    name: 'Bomba de Infusión', 
    category: 'Infusión',
    allowMultiple: true,
    accessories: [
      { id: 'acc-sen-got', name: 'Pantalla' },
      { id: 'acc-pwr-b', name: 'Cable de Poder' },
      { id: 'acc-sop-b', name: 'Soporte de Bomba' },
    ]
  },
  { id: 'inf-jer', name: 'Fonendoscopio', category: 'Vía Aérea' },
  { id: 'via-lar', name: 'Laringoscopio con Hojas', category: 'Vía Aérea' },
  { id: 'via-asp', name: 'Aspirador o Sistema de Vacío', category: 'Vía Aérea' },
  { id: 'eme-desf', name: 'Desfibrilador', category: 'Emergencias' },
  { 
    id: 'qui-ane', 
    name: 'Máquina de Anestesia', 
    category: 'Quirófano',
    accessories: [
      { id: 'acc-fuelle', name: 'Fuelle / Acordeón' },
      { id: 'acc-canister', name: 'Canister (Cal Sodada)' },
      { id: 'acc-circ-ane', name: 'Circuito de Paciente' },
      { id: 'acc-trampa', name: 'Trampa de Agua' },
      { id: 'acc-mangueras', name: 'Mangueras de Gases' },
      { id: 'acc-pwr', name: 'Cable de Poder' }
    ]
  },
  { 
    id: 'qui-mes', 
    name: 'Mesa de Cirugía', 
    category: 'Quirófano',
    accessories: [
      { id: 'acc-ctrl', name: 'Control de Mando / Botonera' },
      { id: 'acc-colch', name: 'Colchonetas' },
      { id: 'acc-frenos', name: 'Frenos' },
      { id: 'acc-pwr', name: 'Cable de Poder' }
    ]
  },
  { 
    id: 'qui-ele', 
    name: 'Electrobisturí', 
    category: 'Quirófano',
    accessories: [
      { id: 'acc-pedal', name: 'Pedal' },
      { id: 'acc-cable-placa', name: 'Cable Placa Paciente' },
      { id: 'acc-lapiz', name: 'Lápiz' },
      { id: 'acc-pwr', name: 'Cable de Poder' }
    ]
  },
  { id: 'otr-cap', name: 'Capnógrafo', category: 'Otros' },
  { id: 'otr-ecg', name: 'Electrocardiógrafo', category: 'Otros' },
  { id: 'otr-glu', name: 'Glucómetro', category: 'Otros' },
];
