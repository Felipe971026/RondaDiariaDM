import React, { useState, useMemo } from 'react';
import { 
  ClipboardCheck, 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Settings, 
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  ChevronRight,
  History,
  Box,
  MapPin,
  Check,
  X,
  AlertTriangle,
  Camera,
  ImagePlus,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  SERVICES, 
  EQUIPMENT_LIST, 
  CheckItem, 
  CUBICLE_REQUIRED_SERVICES,
  AccessoryStatus,
  ItemStatus
} from './types';

// Extend jsPDF with autotable types
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

const STATUS_OPTIONS: { value: ItemStatus; label: string; color: string; icon: any }[] = [
  { value: 'CUMPLE', label: 'Cumple', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Check },
  { value: 'NO_CUMPLE', label: 'No Cumple', color: 'bg-red-100 text-red-700 border-red-200', icon: X },
  { value: 'NO_APLICA', label: 'No Aplica', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Minus },
];

export default function App() {
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [cubicle, setCubicle] = useState('');
  const [selectedEquipId, setSelectedEquipId] = useState(EQUIPMENT_LIST[0].id);
  const [currentCheck, setCurrentCheck] = useState<Partial<CheckItem>>({
    status: 'CUMPLE',
    aestheticStatus: 'CUMPLE',
    hasNovelty: false,
    noveltyDescription: '',
    accessories: [],
    quantity: 1,
  });
  const [reports, setReports] = useState<CheckItem[]>([]);
  const [view, setView] = useState<'form' | 'history'>('form');
  const [showToast, setShowToast] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [logoTimestamp] = useState(Date.now());

  const requiresCubicle = useMemo(() => 
    CUBICLE_REQUIRED_SERVICES.includes(selectedService), 
  [selectedService]);

  const selectedEquipment = useMemo(() => 
    EQUIPMENT_LIST.find(e => e.id === selectedEquipId),
  [selectedEquipId]);

  // Initialize accessories when equipment changes
  React.useEffect(() => {
    if (selectedEquipment?.accessories) {
      setCurrentCheck(prev => ({
        ...prev,
        accessories: selectedEquipment.accessories!.map(acc => ({
          accessoryId: acc.id,
          status: 'CUMPLE',
          hasNovelty: false,
          noveltyDescription: ''
        }))
      }));
    } else {
      setCurrentCheck(prev => ({ ...prev, accessories: [] }));
    }
  }, [selectedEquipment]);

  const handleAccessoryStatusChange = (accId: string, status: ItemStatus) => {
    setCurrentCheck(prev => ({
      ...prev,
      accessories: prev.accessories?.map(acc => 
        acc.accessoryId === accId ? { ...acc, status } : acc
      )
    }));
  };

  const handleAccessoryNoveltyToggle = (accId: string) => {
    setCurrentCheck(prev => ({
      ...prev,
      accessories: prev.accessories?.map(acc => 
        acc.accessoryId === accId ? { ...acc, hasNovelty: !acc.hasNovelty, noveltyDescription: !acc.hasNovelty ? acc.noveltyDescription : '' } : acc
      )
    }));
  };

  const handleAccessoryNoveltyChange = (accId: string, noveltyDescription: string) => {
    setCurrentCheck(prev => ({
      ...prev,
      accessories: prev.accessories?.map(acc => 
        acc.accessoryId === accId ? { ...acc, noveltyDescription } : acc
      )
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentCheck(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addToRound = () => {
    if (requiresCubicle && !cubicle) {
      alert('Por favor ingrese el número de cubículo para este servicio');
      return;
    }

    const newItem: CheckItem = {
      id: crypto.randomUUID(),
      equipmentId: selectedEquipId,
      service: selectedService,
      cubicle: requiresCubicle ? cubicle : undefined,
      status: currentCheck.status || 'CUMPLE',
      aestheticStatus: currentCheck.aestheticStatus || 'CUMPLE',
      hasNovelty: currentCheck.hasNovelty || false,
      noveltyDescription: currentCheck.hasNovelty ? (currentCheck.noveltyDescription || '') : '',
      accessories: currentCheck.accessories || [],
      timestamp: new Date().toLocaleString(),
      quantity: currentCheck.quantity || 1,
      photo: currentCheck.photo
    };

    setReports(prev => [...prev, newItem]);
    // Reset partial form
    setCurrentCheck(prev => ({
      ...prev,
      hasNovelty: false,
      noveltyDescription: '',
      status: 'CUMPLE',
      aestheticStatus: 'CUMPLE',
      quantity: 1,
      photo: undefined,
      accessories: selectedEquipment?.accessories?.map(acc => ({
        accessoryId: acc.id,
        status: 'CUMPLE',
        hasNovelty: false,
        noveltyDescription: ''
      })) || []
    }));
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const generatePDF = async () => {
    if (reports.length === 0) {
      alert('No hay reportes para generar PDF');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Load Logo
    const loadLogo = (): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          // Verify it's not an empty image
          if (img.width > 0 && img.height > 0) {
            resolve(img);
          } else {
            resolve(null);
          }
        };
        img.onerror = () => resolve(null);
        img.src = `/logo.png?t=${logoTimestamp}`;
      });
    };

    const logoImg = await loadLogo();
    let headerY = 20;

    if (logoImg) {
      doc.addImage(logoImg, 'PNG', 14, 10, 25, 25, undefined, 'FAST');
      headerY = 25;
    }

    // Header
    doc.setFontSize(18);
    doc.setTextColor(20, 83, 45);
    doc.text('Informe Consolidado de Ronda Biomédica', pageWidth / 2, headerY, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha de Reporte: ${new Date().toLocaleString()}`, pageWidth / 2, headerY + 8, { align: 'center' });

    let currentY = headerY + 20;

    // Group by Service, then by Cubicle
    const grouped = reports.reduce((acc, item) => {
      if (!acc[item.service]) acc[item.service] = {};
      const cubKey = item.cubicle || 'Área General';
      if (!acc[item.service][cubKey]) acc[item.service][cubKey] = [];
      acc[item.service][cubKey].push(item);
      return acc;
    }, {} as Record<string, Record<string, CheckItem[]>>);

    Object.entries(grouped).forEach(([service, cubicles]) => {
      doc.setFontSize(14);
      doc.setTextColor(20, 83, 45);
      doc.text(`SERVICIO: ${service}`, 14, currentY);
      currentY += 10;

      Object.entries(cubicles).forEach(([cubicleName, items]) => {
        if (currentY > 250) { doc.addPage(); currentY = 20; }
        
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Ubicación: ${cubicleName}`, 20, currentY);
        currentY += 5;

        const tableData = items.map(item => {
          const equip = EQUIPMENT_LIST.find(e => e.id === item.equipmentId);
          const getStatusText = (status?: string) => status === 'CUMPLE' ? 'Cumple' : status === 'NO_APLICA' ? 'No Aplica' : 'No Cumple';
          let statusText = `Funcional: ${getStatusText(item.status)}\nEstético: ${getStatusText(item.aestheticStatus)}`;
          if (item.hasNovelty) {
            statusText += `\n[NOVEDAD]: ${item.noveltyDescription || 'Sí'}`;
          }
          
          const accInfo = item.accessories.map(acc => {
            const accName = equip?.accessories?.find(a => a.id === acc.accessoryId)?.name;
            let accStatus = getStatusText(acc.status);
            if (acc.hasNovelty) {
              accStatus += ` (Novedad: ${acc.noveltyDescription || 'Sí'})`;
            }
            return `${accName}: ${accStatus}`;
          }).join('\n');

          const equipName = equip?.name || 'Desconocido';
          const equipText = item.quantity && item.quantity > 1 ? `${equipName} (Cant: ${item.quantity})` : equipName;

          return [
            equipText,
            statusText,
            accInfo || '-',
            '' // Placeholder para la imagen
          ];
        });

        autoTable(doc, {
          startY: currentY,
          head: [['Equipo', 'Estado', 'Accesorios', 'Evidencia']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [40, 40, 40] },
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: {
            3: { cellWidth: 40 } // Ancho fijo para la columna de evidencia
          },
          margin: { left: 14, right: 14 },
          didParseCell: (data) => {
            if (data.section === 'body') {
              const item = items[data.row.index];
              if (!item) return;
              
              // Hide default text for columns 1 and 2 to draw custom colored text
              if (data.column.index === 1 || data.column.index === 2) {
                const bgColor = data.cell.styles.fillColor;
                data.cell.styles.textColor = Array.isArray(bgColor) ? bgColor : [255, 255, 255];
              }

              if (data.column.index === 3 && item.photo) {
                data.cell.styles.minCellHeight = 35; // Altura mínima para que quepa la foto
              }
            }
          },
          didDrawCell: (data) => {
            if (data.section === 'body') {
              // Custom text drawing for Estado and Accesorios
              if (data.column.index === 1 || data.column.index === 2) {
                const lines = data.cell.text;
                doc.setFontSize(data.cell.styles.fontSize);
                
                const fontSizePt = Number(data.cell.styles.fontSize) || 8;
                const lineHeightMm = (fontSizePt * 1.15) * 0.3527777778;
                
                // Calculate initial Y position safely
                const padding = data.cell.padding || data.cell.styles.cellPadding || 2;
                const paddingTop = Number(typeof padding === 'object' ? (padding.top || 2) : padding) || 2;
                const paddingLeft = Number(typeof padding === 'object' ? (padding.left || 2) : padding) || 2;
                
                let textY = Number(data.cell.y || 0) + paddingTop + (fontSizePt * 0.3527777778);
                const textX = Number(data.cell.x || 0) + paddingLeft;
                
                const linesArray = Array.isArray(lines) ? lines : [lines];
                
                linesArray.forEach(line => {
                  const strLine = String(line || '');
                  if (strLine.includes('No Cumple') || strLine.includes('NOVEDAD') || strLine.includes('Novedad')) {
                    doc.setTextColor(220, 38, 38); // Red
                  } else if (strLine.includes('No Aplica')) {
                    doc.setTextColor(107, 114, 128); // Gray
                  } else if (strLine.includes('Cumple')) {
                    doc.setTextColor(5, 150, 105); // Green
                  } else {
                    doc.setTextColor(0, 0, 0); // Black
                  }
                  if (strLine.trim() !== '') {
                    doc.text(strLine, textX, textY);
                  }
                  textY += lineHeightMm;
                });
              }

              // Photo drawing
              if (data.column.index === 3) {
                const item = items[data.row.index];
                if (item && item.photo) {
                  try {
                    const dim = 30; // 30x30 mm
                    const cellX = Number(data.cell.x || 0);
                    const cellY = Number(data.cell.y || 0);
                    const cellWidth = Number(data.cell.width || 0);
                    const x = cellX + (cellWidth - dim) / 2;
                    const y = cellY + 2;
                    doc.addImage(item.photo, 'JPEG', x, y, dim, dim);
                  } catch (e) {
                    console.error('Error adding image to cell', e);
                    doc.setTextColor(200, 0, 0);
                    doc.text('Error', Number(data.cell.x || 0) + 2, Number(data.cell.y || 0) + 10);
                  }
                }
              }
            }
          }
        });

        currentY = doc.lastAutoTable.finalY + 10;
      });
      currentY += 5;
    });

    doc.save(`Ronda_Biomedica_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      {/* Navigation Rail */}
      <nav className="fixed left-0 top-0 h-full w-16 bg-[#151619] flex flex-col items-center py-8 space-y-8 z-50">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg bg-white">
          {!logoError ? (
            <img 
              src={`/logo.png?t=${logoTimestamp}`}
              alt="Logo" 
              className="w-full h-full object-contain p-1"
              onError={() => setLogoError(true)} 
            />
          ) : (
            <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white">
              <Stethoscope size={24} />
            </div>
          )}
        </div>
        <button onClick={() => setView('form')} className={`p-3 rounded-xl transition-all ${view === 'form' ? 'bg-white/10 text-emerald-400' : 'text-gray-500'}`}>
          <ClipboardCheck size={24} />
        </button>
        <button onClick={() => setView('history')} className={`p-3 rounded-xl transition-all ${view === 'history' ? 'bg-white/10 text-emerald-400' : 'text-gray-500'}`}>
          <History size={24} />
        </button>
      </nav>

      <main className="pl-16 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">BiomedCheck UCI</h1>
            <p className="text-sm text-gray-500 italic">Validación de Tecnología Médica</p>
          </div>
          <button 
            onClick={generatePDF}
            disabled={reports.length === 0}
            className="flex items-center space-x-2 bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Download size={18} />
            <span className="font-bold">Generar Informe ({reports.length})</span>
          </button>
        </header>

        <div className="max-w-4xl mx-auto p-8">
          <AnimatePresence mode="wait">
            {view === 'form' ? (
              <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                {/* Location Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <label className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                      <MapPin size={14} className="mr-1" /> Servicio / Área
                    </label>
                    <select 
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500"
                    >
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {requiresCubicle && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <label className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                        <LayoutDashboard size={14} className="mr-1" /> Cubículo / Cama
                      </label>
                      <input 
                        type="text"
                        placeholder="Ej: Cubículo 01"
                        value={cubicle}
                        onChange={(e) => setCubicle(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Equipment Selection */}
                <div className={`grid grid-cols-1 ${selectedEquipment?.allowMultiple ? 'md:grid-cols-2' : ''} gap-4`}>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <label className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                      <Box size={14} className="mr-1" /> Seleccionar Equipo
                    </label>
                    <select 
                      value={selectedEquipId}
                      onChange={(e) => {
                        setSelectedEquipId(e.target.value);
                        setCurrentCheck(prev => ({ ...prev, quantity: 1 }));
                      }}
                      className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500"
                    >
                      {EQUIPMENT_LIST.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </div>

                  {selectedEquipment?.allowMultiple && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <label className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                        <Box size={14} className="mr-1" /> Cantidad
                      </label>
                      <input 
                        type="number"
                        min="1"
                        value={currentCheck.quantity || 1}
                        onChange={(e) => setCurrentCheck(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Main Equipment Status */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 mb-4">Estado del Equipo</h3>
                    
                    <div className="mb-4">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Estado Funcional</label>
                      <div className="grid grid-cols-3 gap-2">
                        {STATUS_OPTIONS.map((opt) => (
                          <button 
                            key={`func-${opt.value}`}
                            onClick={() => setCurrentCheck(prev => ({ ...prev, status: opt.value }))}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${currentCheck.status === opt.value ? opt.color : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                          >
                            <opt.icon size={16} className="mb-1" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Estado Estético</label>
                      <div className="grid grid-cols-3 gap-2">
                        {STATUS_OPTIONS.map((opt) => (
                          <button 
                            key={`aes-${opt.value}`}
                            onClick={() => setCurrentCheck(prev => ({ ...prev, aestheticStatus: opt.value }))}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${currentCheck.aestheticStatus === opt.value ? opt.color : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                          >
                            <opt.icon size={16} className="mb-1" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => setCurrentCheck(prev => ({ ...prev, hasNovelty: !prev.hasNovelty, noveltyDescription: !prev.hasNovelty ? prev.noveltyDescription : '' }))}
                      className={`w-full flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all ${currentCheck.hasNovelty ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                    >
                      <AlertTriangle size={18} />
                      <span className="text-xs font-black uppercase tracking-tighter">Registrar Novedad Adicional</span>
                    </button>
                  </div>

                  {currentCheck.hasNovelty && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-6 bg-amber-50/30 border-b border-amber-100">
                      <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Descripción de la Novedad (Equipo)</label>
                      <textarea 
                        value={currentCheck.noveltyDescription}
                        onChange={(e) => setCurrentCheck(prev => ({ ...prev, noveltyDescription: e.target.value }))}
                        placeholder="Describa la novedad o detalle adicional del equipo..."
                        className="w-full bg-white border border-amber-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-amber-500 min-h-[80px]"
                      />
                    </motion.div>
                  )}

                  {/* Accessories Section */}
                  {selectedEquipment?.accessories && (
                    <div className="p-6 space-y-4">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accesorios y Aditamentos</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {selectedEquipment.accessories.map(acc => {
                          const status = currentCheck.accessories?.find(s => s.accessoryId === acc.id);
                          return (
                            <div key={acc.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-700">{acc.name}</span>
                                <div className="flex space-x-1">
                                  {STATUS_OPTIONS.map((opt) => (
                                    <button 
                                      key={opt.value}
                                      onClick={() => handleAccessoryStatusChange(acc.id, opt.value)}
                                      className={`text-[9px] px-2 py-1 rounded font-black uppercase tracking-tighter transition-all ${status?.status === opt.value ? opt.color : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'}`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                  <button 
                                    onClick={() => handleAccessoryNoveltyToggle(acc.id)}
                                    className={`text-[9px] px-2 py-1 rounded font-black uppercase tracking-tighter transition-all flex items-center ${status?.hasNovelty ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'}`}
                                  >
                                    Nov
                                  </button>
                                </div>
                              </div>
                              {status?.hasNovelty && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                  <input 
                                    type="text"
                                    value={status.noveltyDescription}
                                    onChange={(e) => handleAccessoryNoveltyChange(acc.id, e.target.value)}
                                    placeholder="Novedad del accesorio..."
                                    className="w-full bg-white border border-amber-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-amber-500"
                                  />
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Photo Upload Section */}
                  <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Evidencia Fotográfica (Opcional)</label>
                    <div className="flex items-center space-x-4">
                      <label className="cursor-pointer flex items-center justify-center space-x-2 bg-white border-2 border-dashed border-gray-200 hover:border-emerald-400 text-gray-500 hover:text-emerald-600 px-6 py-4 rounded-xl transition-all w-full md:w-auto">
                        <Camera size={20} />
                        <span className="text-xs font-bold uppercase tracking-tighter">
                          {currentCheck.photo ? 'Cambiar Foto' : 'Tomar / Subir Foto'}
                        </span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment"
                          onChange={handlePhotoUpload} 
                          className="hidden" 
                        />
                      </label>
                      {currentCheck.photo && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          <img src={currentCheck.photo} alt="Evidencia" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setCurrentCheck(prev => ({ ...prev, photo: undefined }))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex justify-end">
                    <button 
                      onClick={addToRound}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 flex items-center space-x-2"
                    >
                      <Plus size={18} />
                      <span>Guardar Equipo</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div key="history" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Equipos en la Ronda Actual</h2>
                  <button onClick={() => setReports([])} className="text-red-500 text-xs font-bold uppercase tracking-widest">Limpiar Todo</button>
                </div>

                {reports.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <AlertCircle size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium">No has añadido equipos a esta ronda todavía.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports.map((item, idx) => {
                      const equip = EQUIPMENT_LIST.find(e => e.id === item.equipmentId);
                      return (
                        <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{item.service}</span>
                              {item.cubicle && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">• {item.cubicle}</span>}
                            </div>
                            <h4 className="font-bold text-gray-800">
                              {equip?.name}
                              {item.quantity && item.quantity > 1 && (
                                <span className="ml-2 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-xs">
                                  x{item.quantity}
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-gray-400">{item.timestamp}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-end space-y-1">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                item.status === 'CUMPLE' ? 'bg-emerald-100 text-emerald-700' : 
                                item.status === 'NO_APLICA' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                              }`}>
                                FUNC: {item.status === 'CUMPLE' ? 'CUMPLE' : item.status === 'NO_APLICA' ? 'NO APLICA' : 'NO CUMPLE'}
                              </span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                item.aestheticStatus === 'CUMPLE' ? 'bg-emerald-100 text-emerald-700' : 
                                item.aestheticStatus === 'NO_APLICA' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                              }`}>
                                EST: {item.aestheticStatus === 'CUMPLE' ? 'CUMPLE' : item.aestheticStatus === 'NO_APLICA' ? 'NO APLICA' : 'NO CUMPLE'}
                              </span>
                              {item.hasNovelty && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700 flex items-center">
                                  <AlertTriangle size={10} className="mr-1" /> NOVEDAD
                                </span>
                              )}
                              {item.photo && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 flex items-center">
                                  <Camera size={10} className="mr-1" /> FOTO
                                </span>
                              )}
                            </div>
                            <button onClick={() => setReports(prev => prev.filter(r => r.id !== item.id))} className="text-gray-300 hover:text-red-500">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="fixed bottom-0 left-16 right-0 bg-white border-t border-gray-100 px-8 py-3 flex justify-between items-center text-[10px] font-black text-gray-300 z-40">
        <div className="flex items-center space-x-6">
          <span>BIOMEDCHECK v2.1</span>
          <span>SOPORTE TÉCNICO UCI</span>
        </div>
        <div>{reports.length} REGISTROS EN COLA</div>
      </footer>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 z-50"
          >
            <CheckCircle2 size={20} className="text-emerald-400" />
            <span className="font-medium text-sm">¡Registro guardado exitosamente!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
