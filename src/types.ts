export type ItemStatus = 'CUMPLE' | 'NO_CUMPLE' | 'NO_APLICA';

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
  "Ambulancia Medicalizada",
  "Cirugía",
  "Esterilización",
  "Hospitalizacion",
  "Pasillo",
  "Recuperación",
  "UCI Adultos Intensivo o Intemedios"
];

// Services that require cubicle identification
export const CUBICLE_REQUIRED_SERVICES = [
  "Cirugía",
  "Hospitalizacion",
  "Recuperación",
  "UCI Adultos Intensivo o Intemedios"
];

export const EQUIPMENT_LIST: Equipment[] = [
  { id: 'agitador-plaq', name: 'Agitador de Plaquetas', category: 'Laboratorio' },
  { id: 'autoclave', 
  name: 'Autoclave', 
  category: 'Esterilización',
  accessories: [
      { id: 'autoclave-man', name: 'Manometro' },
      { id: 'autoclave-sello', name: 'Caucho Puerta' },
      { id: 'autoclave-int', name: 'Estado Interno Cabina' },
      { id: 'autoclave-cirr', name: 'Sistema de Cerrado' },
      { id: 'autoclave-pwr', name: 'Cable de Poder' }
    ]
   },
  { id: 'bano-sero', name: 'Baño Serológico', category: 'Laboratorio' },
  { id: 'bascula', name: 'Báscula', category: 'Diagnóstico' },
  { 
    id: 'inf-vol', 
    name: 'Bombas de Infusión', 
    category: 'Infusión',
    allowMultiple: true,
    accessories: [
      { id: 'acc-sen-got', name: 'Pantalla' },
      { id: 'acc-pwr-b', name: 'Cable de Poder' },
      { id: 'acc-sop-b', name: 'Soporte de Bomba' },
    ]
  },
  { 
    id: 'cama-elec', 
    name: 'Cama', 
    category: 'Mobiliario',
    accessories: [
      { id: 'acc-ctrl', name: 'Control de Mando' },
      { id: 'acc-pwr', name: 'Cable de Poder' },
      { id: 'acc-mov-esp', name: 'Movimiento Espaldar' },
      { id: 'acc-mov-alt', name: 'Movimiento Altura (Subir/Bajar)' },
      { id: 'acc-mov-tre', name: 'Movimiento Trendelenburg' },
    ]
  },
  { id: 'camilla', 
  name: 'Camilla', 
  category: 'Mobiliario',
  accessories: [
      { id: 'acc-cami-esp', name: 'Movimiento Espaldar' },
      { id: 'acc-cami-alt', name: 'Movimiento Altura (Subir/Bajar)' },
      { id: 'acc-cami-tre', name: 'Movimiento Trendelenburg' },
    ]
  },
  { id: 'centrifugas', name: 'Centrífugas', category: 'Laboratorio' },
  { id: 'colch-anti', name: 'Colchones Antiescaras', category: 'Mobiliario' },
  { id: 'congelador', name: 'Congelador', category: 'Laboratorio' },
  { 
    id: 'eme-desf', 
    name: 'Desfibrilador', 
    category: 'Emergencias',
    accessories: [
      { id: 'acc-pal', name: 'Paletas' },
      { id: 'acc-pwr-d', name: 'Cable de Poder' },
      { id: 'acc-cab-pal', name: 'Cable de Conexión Paletas' },
      { id: 'acc-lat-ecg', name: 'Latiguillos ECG' },
    ]
  },
  { id: 'digitalizador', name: 'Digitalizador', category: 'Imagenología' },
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
  { 
    id: 'otr-ecg', 
    name: 'Electrocardiógrafo', 
    category: 'Otros',
    accessories: [
      { id: 'acc-lat', name: 'Latiguillos' },
      { id: 'acc-pin', name: 'Pinzas' },
      { id: 'acc-chu', name: 'Chupas' },
      { id: 'acc-pan', name: 'Pantalla' },
      { id: 'acc-pap', name: 'Papel' },
    ]
  },
  { id: 'eq-hemato', name: 'Equipo de Hematología', category: 'Laboratorio' },
  { id: 'eq-org', name: 'Equipo de Órganos y Sentidos', category: 'Diagnóstico' },
  { id: 'eq-quimica', name: 'Equipo de Química', category: 'Laboratorio' },
  { id: 'rx-port', name: 'Equipo de Rayos X Portátil', category: 'Imagenología' },
  { id: 'fluj', name: 'Flujómetros', category: 'Gases' },
  { 
    id: 'fonendoscopio', 
    name: 'Fonendoscopios', 
    category: 'Diagnóstico',
    accessories: [
      { id: 'acc-mem', name: 'Membrana' },
      { id: 'acc-oli', name: 'Olivas' },
    ]
  },
  { id: 'otr-glu', name: 'Glucómetros', category: 'Otros' },
  { id: 'incubadora', name: 'Incubadora', category: 'Pediatría' },
  { id: 'inyec-cont', name: 'Inyector de Contraste', category: 'Imagenología' },
  { id: 'lam-banco-sangre', name: 'Lámpara de Banco de Sangre', category: 'Laboratorio' },
  { id: 'lam-cie', 
  name: 'Lámpara Cielítica', 
  category: 'Quirófano', 
  accessories: [
      { id: 'lam-cie-ctrl', name: 'Control de Mando / Botonera' },
      { id: 'lam-cie-brz', name: 'Brazos' },
      { id: 'lam-cie-bob', name: 'Bombillos' },
      { id: 'lam-cie-man', name: 'Manijas' },
      ]
  },
  { 
    id: 'via-lar', 
    name: 'Laringoscopio', 
    category: 'Vía Aérea',
    accessories: [
      { id: 'acc-bomb', name: 'Bombillos' },
      { id: 'acc-hoj-cur', name: 'Hojas Curvas' },
      { id: 'acc-hoj-rec', name: 'Hojas Rectas' },
    ]
  },
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
      { id: 'acc-pant', name: 'Pantalla' },
      { id: 'acc-fluj', name: 'Sistema de flujos' },
      { id: 'acc-pwr', name: 'Cable de Poder' }
    ]
  },
  { id: 'maq-gas', name: 'Máquina de Gases', category: 'Otros' },
  { id: 'martillo-ref', name: 'Martillo de Reflejos', category: 'Diagnóstico' },
  { 
    id: 'qui-mes', 
    name: 'Mesa de Cirugía', 
    category: 'Quirófano',
    accessories: [
      { id: 'acc-ctrl', name: 'Control de Mando / Botonera' },
      { id: 'acc-colch', name: 'Colchonetas' },
      { id: 'acc-frenos', name: 'Frenos' },
      { id: 'acc-pwr', name: 'Cable de Poder' },
      { id: 'acc-mov', name: 'Movimientos' }
    ]
  },
  { id: 'microscopio', name: 'Microscopio', category: 'Laboratorio' },
  { 
    id: 'mon-multi', 
    name: 'Monitor de Signos Vitales', 
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
  { id: 'pipetas', name: 'Pipetas Automáticas', category: 'Laboratorio' },
  { id: 'refrigeradores', name: 'Refrigeradores', category: 'Laboratorio' },
  { id: 'reg-vac', name: 'Regulador de Vacío', category: 'Vía Aérea' },
  { id: 'silla-ruedas', 
  name: 'Sillas de Ruedas', 
  category: 'Mobiliario',
   accessories: [
      { id: 'silla-ruedas-esp', name: 'Espaldar' },
      { id: 'silla-ruedas-asc', name: 'Asiento' },
      { id: 'silla-ruedas-rued', name: 'Reudas' },
      { id: 'silla-ruedas-fren', name: '>Frenos' },
      { id: 'silla-ruedas-pies', name: 'Pieceros' },
      { id: 'silla-ruedas-mango', name: 'Mangas' }
    ]
   },
  { 
    id: 'succ-cir', 
    name: 'Succionador de Cirugía', 
    category: 'Vía Aérea',
    accessories: [
      { id: 'acc-vaso1', name: 'Vaso Recolector 1' },
      { id: 'acc-vaso2', name: 'Vaso Recolector 2' },
      { id: 'acc-sis1', name: 'Sistema de Succión 1' },
      { id: 'acc-sis2', name: 'Sistema de Succión 2' },
      { id: 'acc-man', name: 'Mangueras' },
      { id: 'acc-mano', name: 'Manómetro' },
    ]
  },
  { 
    id: 'succ', 
    name: 'Succionadores', 
    category: 'Vía Aérea',
    accessories: [
      { id: 'acc-vaso', name: 'Vaso Recolector' },
      { id: 'acc-man', name: 'Mangueras' },
      { id: 'acc-mano', name: 'Manómetro' },
    ]
  },
  { id: 'tac', 
  name: 'TAC', 
  category: 'Imagenología',
  accessories: [
      { id: 'acc-tac', name: 'Comunicacion' },
      { id: 'acc-tac', name: 'Calibracion' },
      { id: 'acc-tac', name: 'Temperatura' },
    ]
  },
  { id: 'tallimetro', name: 'Tallímetro', category: 'Diagnóstico' },
  { id: 'tens', name: 'Tensiómetro', category: 'Diagnóstico' },
  { id: 'term-dig', name: 'Termómetro Digital', category: 'Diagnóstico' },
  { id: 'termohigrometro', name: 'Termohigrómetros', category: 'Diagnóstico' },
  { 
    id: 'sop-vent-adult', 
    name: 'Ventilador Mecánico', 
    category: 'Soporte Vital',
    accessories: [
      { id: 'acc-circ', name: 'Circuito de Paciente' },
      { id: 'acc-pan', name: 'Pantalla' },
      { id: 'acc-fil', name: 'Bateria' },
      { id: 'acc-bra-sop', name: 'Brazo Soporte' },
      { id: 'acc-pwr-v', name: 'Cable de Poder' },
    ]
  },
  { 
    id: 'via-vid-lar', 
    name: 'Videolaringoscopio', 
    category: 'Vía Aérea',
    accessories: [
      { id: 'acc-hoj', name: 'Hojas' },
      { id: 'acc-pan', name: 'Pantalla' },
      { id: 'acc-pil', name: 'Bateria' },
    ]
  },
];
