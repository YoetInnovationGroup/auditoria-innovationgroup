import React, { useState, useEffect } from 'react';
import { Check, Briefcase, FileText, ShieldCheck } from 'lucide-react';


const DynamicCheckboxGrid = ({
  options,
  selected,
  onToggle,
  onAddCustom,
  otherLabel = "Otros"
}: {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  onAddCustom: (val: string) => void;
  otherLabel?: string;
}) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [customValue, setCustomValue] = React.useState('');

  const customItems = selected.filter(item => !options.includes(item));

  const handleAdd = () => {
    const val = customValue.trim();
    if (val && !options.includes(val) && !selected.includes(val)) {
      onAddCustom(val);
    }
    setCustomValue('');
    setIsAdding(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map(opt => (
        <label key={opt} className={`flex items-center gap-3 p-3 rounded-[12px] border cursor-pointer transition-all ${selected.includes(opt) ? 'border-[#bdf38d] bg-[#f8fcf3]' : 'border-gray-200 hover:border-gray-300'}`}>
          <input type="checkbox" checked={selected.includes(opt)} onChange={() => onToggle(opt)} className="w-4 h-4 text-[#bdf38d] rounded focus:ring-[#bdf38d]" />
          <span className="text-sm font-medium text-gray-700">{opt}</span>
        </label>
      ))}
      {customItems.map(opt => (
        <label key={opt} className={`flex items-center gap-3 p-3 rounded-[12px] border cursor-pointer transition-all border-[#bdf38d] bg-[#f8fcf3]`}>
          <input type="checkbox" checked={true} onChange={() => onToggle(opt)} className="w-4 h-4 text-[#bdf38d] rounded focus:ring-[#bdf38d]" />
          <span className="text-sm font-medium text-gray-700">{opt}</span>
        </label>
      ))}
      
      {!isAdding ? (
        <button 
          type="button" 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-3 p-3 rounded-[12px] border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all text-left bg-transparent"
        >
          <span className="text-sm font-medium">+ {otherLabel}</span>
        </button>
      ) : (
        <div className="flex items-center gap-2 p-2 rounded-[12px] border border-[#bdf38d] bg-white transition-all">
          <input 
            type="text" 
            value={customValue}
            onChange={e => setCustomValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
            autoFocus
            placeholder="Especifique..."
            className="w-full bg-transparent px-2 py-1 text-sm focus:outline-none text-gray-700"
          />
          <button 
            type="button"
            onClick={handleAdd}
            className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-[8px] hover:bg-gray-800"
          >
            Agregar
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const [validationError, setValidationError] = useState('');

  // Estado Centralizado de la Auditoría (Única fuente de verdad)
  const initialData = {
    q1: '', q2: [] as string[], q2_other: '', q3: '', q4: '',
    q5: [] as string[], q5_other: '', q6: '', q7: [] as string[], q7_other: '', q8: '', q8_info: '',
    q9: {} as Record<string, string>, q10: '', q11: '',
    q12: [] as string[], q12_other: '', q13: '', q14: '', q15: '',
    q16: '', q17: '', q18: '', q18_cuales: '',
    q19: '', q20: '', q21: '',
    q22: '', q23: '', q24: '', q25: '', q26: '',
    q27: [] as string[], q27_other: '', q28: '', q29: '', q30: '',
    q31: '', q32: '', q33: '', q34: '',
    q35: '', q36: '', q37: '', q38: '', q39: '', q40: '', q41: '', q42: '',
    q43: '', q44: ''
  };

  const [formData, setFormData] = useState(initialData);

  const hasTrustEscrow = formData.q2.includes('Fideicomisos');

  // Secciones dinámicas
  const sections = [
    { id: 'sec1', title: 'Su Operación', desc: 'Volumen y tipo de trabajo' },
    { id: 'sec2', title: 'Cómo Funciona Hoy', desc: 'Flujo real y organización' },
    { id: 'sec3', title: 'Expedientes y Documentos', desc: 'Checklists y verificación' },
    { id: 'sec4', title: 'Seguimiento y Administración', desc: 'Control de pendientes y tiempos' },
    { id: 'sec5', title: 'Trabajo Notarial', desc: 'Intervención personal y delegación' },
    { id: 'sec6', title: 'Comunicación', desc: 'Consultas frecuentes y mensajes repetitivos' },
    ...(hasTrustEscrow ? [{ id: 'sec7', title: 'Trust & Escrow', desc: 'Gestión de fondos y custodia' }] : []),
    { id: 'sec8', title: 'Sistemas y Cuellos de Botella', desc: 'Herramientas y fricción' },
    { id: 'sec9', title: 'Impacto', desc: 'Consecuencias de los procesos actuales' },
    { id: 'sec10', title: 'El Problema de Alto Valor', desc: 'Identificación de áreas críticas' },
    { id: 'sec11', title: 'Visión de Mejora', desc: 'Identificación de áreas de impacto' }
  ];

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Auto-guardado
  useEffect(() => {
    if (!isSuccess) {
      localStorage.setItem('app-audit-draft', JSON.stringify({ formData, currentSectionIndex }));
    }
  }, [formData, currentSectionIndex, isSuccess]);

  // Recuperar draft automáticamente al inicio
  useEffect(() => {
    const draft = localStorage.getItem('app-audit-draft');
    if (draft && !isSuccess) {
      try {
        const parsedDraft = JSON.parse(draft);
        if (parsedDraft.formData) setFormData(parsedDraft.formData);
        if (parsedDraft.currentSectionIndex !== undefined) setCurrentSectionIndex(parsedDraft.currentSectionIndex);
      } catch (e) {
        console.error("Error parsing draft", e);
      }
    }
  }, []);

  // Asegurar index válido al quitar Fideicomisos
  useEffect(() => {
    if (currentSectionIndex >= sections.length) {
      setCurrentSectionIndex(sections.length - 1);
    }
  }, [sections.length, currentSectionIndex]);

  const validateStep = (stepId: string) => {
    switch (stepId) {
      case 'sec1': return !!formData.q1 && formData.q2.length > 0 && !!formData.q3 && !!formData.q4;
      case 'sec2': 
        if (formData.q5.length === 0 || formData.q7.length === 0 || !formData.q8) return false;
        if (!formData.q6.trim()) return false;
        if (formData.q8 !== 'Nunca' && !formData.q8_info.trim()) return false;
        return true;
      case 'sec3': 
        if (formData.q2.length > 0 && formData.q2.filter(s => s !== 'Otros' && s !== 'Otro').slice(0, 4).some(srv => !formData.q9[srv] || !formData.q9[srv].trim())) return false;
        if (!formData.q10.trim() || !formData.q11.trim()) return false;
        return true;
      case 'sec4': 
        if (formData.q12.length === 0 || !formData.q13.trim() || !formData.q14 || !formData.q15) return false;
        return true;
      case 'sec5': 
        if (!formData.q16.trim() || !formData.q17.trim() || !formData.q18) return false;
        if (['Sí', 'Algunas'].includes(formData.q18) && !formData.q18_cuales.trim()) return false;
        return true;
      case 'sec6': 
        if (!formData.q19.trim() || !formData.q20.trim() || !formData.q21) return false;
        return true;
      case 'sec7': 
        if (!formData.q22.trim() || !formData.q23.trim() || !formData.q24.trim() || !formData.q25.trim() || !formData.q26.trim()) return false;
        return true;
      case 'sec8': 
        if (formData.q27.length === 0 || !formData.q28.trim() || !formData.q29.trim() || !formData.q30.trim()) return false;
        return true;
      case 'sec9': 
        if (!formData.q31.trim() || !formData.q32.trim() || !formData.q33 || !formData.q34.trim()) return false;
        return true;
      case 'sec10': 
        if (formData.q33 === 'Frecuentemente') {
          if (!formData.q35.trim() || !formData.q36.trim() || !formData.q37.trim() || !formData.q38.trim() || !formData.q39.trim() || !formData.q40.trim()) return false;
        } else {
          if (!formData.q41.trim() || !formData.q42.trim()) return false;
        }
        return true;
      case 'sec11': 
        if (!formData.q43.trim() || !formData.q44.trim()) return false;
        return true;
    }
    return true;
  };


  const handleNext = () => {
    setValidationError('');
    const currentSectionId = sections[currentSectionIndex].id;
    
    if (!validateStep(currentSectionId)) {
      setValidationError('Por favor, completa las preguntas antes de continuar.');
      return;
    }
    
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setValidationError('');
    setCurrentSectionIndex(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTextChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationError('');
  };

  const toggleArrayItem = (field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value] };
    });
    setValidationError('');
  };

  const handleSubmit = async () => {
    setValidationError('');
    
    const currentSectionId = sections[currentSectionIndex].id;
    if (!validateStep(currentSectionId)) {
      setValidationError('Por favor, completa las preguntas antes de enviar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        'https://bdlrqmgnapyfwqfpgpla.supabase.co/functions/v1/recibir-auditoria',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Limpiar borrador local y mostrar pantalla de éxito
      localStorage.removeItem('app-audit-draft');
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error al enviar auditoría:", error);
      setValidationError("No fue posible enviar la auditoría. Verifique la conexión e intente nuevamente.");
      setIsSubmitting(false);
    }
  };

  // --- UI Helpers ---
  const renderRadioGroup = (field: keyof typeof formData, options: string[]) => (
    <div className="flex flex-col gap-3">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer">
          <input 
            type="radio" name={field} value={opt} checked={formData[field] === opt} 
            onChange={() => { setFormData(prev => ({...prev, [field]: opt})); setValidationError(''); }}
            className="w-4 h-4 text-[#bdf38d] focus:ring-[#bdf38d]" 
          />
          <span className="text-sm text-gray-700">{opt}</span>
        </label>
      ))}
    </div>
  );

    const renderTextArea = (field: keyof typeof formData, placeholder: string, rows: number = 3) => (
    <textarea 
      value={formData[field] as string} onChange={e => handleTextChange(field, e.target.value)}
      rows={rows} placeholder={placeholder}
      className="w-full border border-gray-200 rounded-[14px] px-4 py-3 text-[15px] focus:outline-none focus:border-gray-400 placeholder-[#a0a5b1] resize-none transition-colors"
    ></textarea>
  );

  
  // --- Screens ---
  if (!hasStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ backgroundImage: "url('https://i.imgur.com/qhzvoTn.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="bg-white/95 backdrop-blur-sm rounded-[32px] p-8 md:p-12 max-w-lg w-full text-center shadow-2xl animate-fadeIn relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#bdf38d] opacity-20 rounded-bl-[100px] z-0"></div>
          
          <div className="flex flex-col items-center justify-center mb-8 relative z-10">
            <div className="flex items-center gap-0 justify-center">
              <img src="https://i.imgur.com/xXVqU46.png" alt="Notaría Logo" className="h-16 w-auto object-contain relative z-10" />
              <img src="https://i.imgur.com/v4HoWD5.png" alt="Notaría Digital" className="h-32 w-auto object-contain filter invert -ml-16" />
            </div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Auditoría Notarial</h1>
            <p className="text-gray-500 mb-10 text-[15px] leading-relaxed">
              Descubra el potencial de modernización de su notaría. Esta evaluación nos permitirá entender sus procesos actuales y proponer soluciones tecnológicas a la medida.
            </p>
            
            <button 
              onClick={() => setHasStarted(true)}
              className="w-full py-4 bg-gray-900 text-white rounded-[14px] font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 text-lg flex items-center justify-center gap-2"
            >
              Iniciar Auditoría
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {

    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ backgroundImage: "url('https://i.imgur.com/qhzvoTn.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="bg-white/95 backdrop-blur-sm rounded-[24px] p-8 max-w-md w-full text-center shadow-xl animate-fadeIn">
          <div className="w-16 h-16 bg-[#bdf38d] rounded-full flex items-center justify-center mx-auto mb-6"><Check size={32} className="text-gray-900" /></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Auditoría Completada!</h2>
          <p className="text-gray-500 mb-8">Sus respuestas han sido registradas exitosamente. La información será procesada por nuestro departamento.</p>
          <button 
            onClick={() => { setIsSuccess(false); setHasStarted(false); setCurrentSectionIndex(0); setFormData(initialData); }}
            className="w-full py-4 bg-gray-900 text-white rounded-[14px] font-medium hover:bg-gray-800 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // --- Step Rendering ---
  const currentSection = sections[currentSectionIndex];

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans" style={{ backgroundImage: "url('https://i.imgur.com/qhzvoTn.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-[32px] shadow-xl min-h-[80vh] flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="px-5 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-6 border-b border-gray-100 z-10 bg-white/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
            <div className="flex items-center gap-0">
              <img src="https://i.imgur.com/xXVqU46.png" alt="Notaría Logo" className="h-10 w-auto object-contain relative z-10" />
              <img src="https://i.imgur.com/v4HoWD5.png" alt="Notaría Digital" className="h-24 w-auto object-contain filter invert -ml-12" />
            </div>
            <div className="text-sm font-medium text-gray-400 bg-white/80 px-3 py-1 rounded-full self-start sm:self-auto border border-gray-100 shadow-sm">
              Sección {currentSectionIndex + 1} de {sections.length}
            </div>
          </div>
          
          <div className="flex gap-2">
            {[...Array(sections.length)].map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-gray-900 transition-all duration-500 ease-out" style={{ width: i <= currentSectionIndex ? '100%' : '0%' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 sm:p-8 overflow-y-auto z-10 space-y-8 animate-fadeIn">
          <div>
            <h1 className="text-2xl sm:text-[26px] leading-tight font-bold text-gray-900 mb-2 tracking-tight">{currentSection.title}</h1>
            <p className="text-[#8e95a2] text-[15px] leading-relaxed">{currentSection.desc}</p>
          </div>

          <div className="space-y-6">
            {currentSection.id === 'sec1' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">1. ¿Cuántos trámites notariales atiende aproximadamente al mes? <span className="text-red-500">*</span></label>
                  {renderRadioGroup("q1", ['1–10', '11–25', '26–50', '51–100', 'Más de 100'])}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">2. ¿Cuáles son los 3–4 tipos de trámites que realiza con mayor frecuencia? <span className="text-red-500">*</span></label>
                  <DynamicCheckboxGrid options={['Actos y contratos', 'Poderes', 'Sociedades', 'Compraventas', 'Hipotecas', 'Testamentos', 'Donaciones', 'Fideicomisos', 'Cancelación de gravámenes']} selected={formData.q2 as string[]} onToggle={val => toggleArrayItem("q2", val)} onAddCustom={val => toggleArrayItem("q2", val)} otherLabel="Otros" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">3. ¿Cuál es el rango aproximado de honorarios de un trámite típico? <span className="text-red-500">*</span></label>
                  {renderRadioGroup("q3", ['< ₡50.000', '₡50.000–₡100.000', '₡100.000–₡250.000', '₡250.000–₡500.000', '> ₡500.000'])}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">4. ¿Qué porcentaje de sus clientes son recurrentes o empresariales? <span className="text-red-500">*</span></label>
                  {renderRadioGroup("q4", ['Muy pocos', 'Algunos', 'Una parte importante', 'La mayoría'])}
                </div>
              </>
            )}

            {currentSection.id === 'sec2' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">5. Cuando llega un nuevo cliente o trámite, ¿por dónde suele ingresar? <span className="text-red-500">*</span></label>
                  <DynamicCheckboxGrid options={['WhatsApp', 'Correo', 'Llamada', 'Referido', 'Presencial', 'Página web']} selected={formData.q5 as string[]} onToggle={val => toggleArrayItem("q5", val)} onAddCustom={val => toggleArrayItem("q5", val)} otherLabel="Otro" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">6. Describa brevemente qué sucede desde que recibe la solicitud hasta que el trámite comienza. <span className="text-red-500">*</span></label>
                  {renderTextArea("q6", "Ej. Pido la cédula, cotizo, abro expediente...")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">7. ¿Dónde organiza actualmente la información y documentos de los casos? <span className="text-red-500">*</span></label>
                  <DynamicCheckboxGrid options={['Carpetas físicas', 'Excel', 'Word', 'Google Drive / OneDrive', 'Correo', 'WhatsApp', 'Sistema especializado', 'Combinación de varios']} selected={formData.q7 as string[]} onToggle={val => toggleArrayItem("q7", val)} onAddCustom={val => toggleArrayItem("q7", val)} otherLabel="Otro" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">8. ¿Tiene que introducir o copiar la misma información en más de un lugar? <span className="text-red-500">*</span></label>
                  {renderRadioGroup("q8", ['Nunca', 'Ocasionalmente', 'Frecuentemente', 'Constantemente'])}
                </div>
                {formData.q8 && formData.q8 !== 'Nunca' && (
                  <div className="animate-fadeIn p-4 bg-[#f8fcf3] border border-[#bdf38d]/40 rounded-[16px]">
                    <label className="block text-sm font-medium text-gray-900 mb-2">¿Qué tipo de información? <span className="text-red-500">*</span></label>
                    {renderTextArea("q8_info", "Ej. Datos del cliente de WhatsApp al Excel...", 2)}
                  </div>
                )}
              </>
            )}

            {currentSection.id === 'sec3' && (
              <>
                <div className="bg-amber-50 p-4 rounded-[12px] border border-amber-200 flex items-start gap-3">
                  <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-[13px] font-medium text-amber-800 leading-relaxed">
                    No incluya nombres, identificaciones, números de expediente ni información financiera de clientes. Indique únicamente el <strong>tipo de documento</strong> requerido.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">9. Para sus trámites más frecuentes, ¿qué documentos suele solicitar al cliente? <span className="text-red-500">*</span></label>
                  <div className="space-y-4">
                    {formData.q2.filter(s => s !== 'Otros' && s !== 'Otro').slice(0, 4).map(srv => (
                      <div key={srv} className="bg-gray-50 p-4 rounded-[16px] border border-gray-100">
                        <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <FileText size={16} className="text-[#bdf38d]" /> Trámite: {srv}
                        </label>
                        <textarea 
                          value={formData.q9[srv] || ''} 
                          onChange={(e) => setFormData(prev => ({...prev, q9: {...prev.q9, [srv]: e.target.value}}))}
                          rows={2} placeholder="Documentos habituales..."
                          className="w-full border border-gray-200 rounded-[12px] px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-gray-400 placeholder-[#a0a5b1] resize-none transition-colors"
                        ></textarea>
                      </div>
                    ))}
                    {formData.q2.length === 0 && <p className="text-sm text-gray-500 italic">No seleccionaste trámites en el paso 1.</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">10. ¿Cómo verifica actualmente que un expediente tiene todo lo necesario para continuar? <span className="text-red-500">*</span></label>
                  {renderTextArea("q10", "Ej. Reviso un checklist, confío en mi memoria...")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">11. ¿Qué ocurre cuando falta un documento o la información recibida no coincide? <span className="text-red-500">*</span></label>
                  {renderTextArea("q11", "Ej. Detengo todo, llamo al cliente...")}
                </div>
              </>
            )}

            {currentSection.id === 'sec4' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">12. ¿Cómo controla actualmente los trámites que están pendientes? <span className="text-red-500">*</span></label>
                  <DynamicCheckboxGrid options={['Memoria', 'Agenda/calendario', 'Excel', 'Sistema', 'Lista de tareas']} selected={formData.q12 as string[]} onToggle={val => toggleArrayItem("q12", val)} onAddCustom={val => toggleArrayItem("q12", val)} otherLabel="Otro" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">13. ¿Quién realiza normalmente el seguimiento de documentos, respuestas, firmas o tareas pendientes? <span className="text-red-500">*</span></label>
                  {renderTextArea("q13", "Ej. Yo personalmente, mi asistente...", 2)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">14. ¿Con qué frecuencia tiene que contactar a clientes para solicitar información, documentos o dar seguimiento? <span className="text-red-500">*</span></label>
                  {renderRadioGroup("q14", ['Casi nunca', 'Algunas veces por semana', 'Todos los días', 'Varias veces al día'])}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">15. Aproximadamente, ¿cuántas horas por semana dedica a tareas administrativas y de seguimiento? <span className="text-red-500">*</span></label>
                  {renderRadioGroup("q15", ['< 2 horas', '2–5', '5–10', '10–20', '> 20'])}
                </div>
              </>
            )}

            {currentSection.id === 'sec5' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">16. ¿Qué partes del proceso requieren necesariamente su intervención personal? <span className="text-red-500">*</span></label>
                  {renderTextArea("q16", "Ej. Revisión final, firma, asesoría compleja...")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">17. ¿Qué partes podrían prepararse antes de que usted revise o tome una decisión? <span className="text-red-500">*</span></label>
                  {renderTextArea("q17", "Ej. Armado del expediente, llenado de datos básicos...")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">18. ¿Existen procesos o verificaciones que actualmente dependen principalmente de su experiencia o conocimiento personal? <span className="text-red-500">*</span></label>
                  {renderRadioGroup("q18", ['Sí', 'Algunas', 'No'])}
                </div>
                {['Sí', 'Algunas'].includes(formData.q18) && (
                  <div className="animate-fadeIn p-4 bg-[#f8fcf3] border border-[#bdf38d]/40 rounded-[16px]">
                    <label className="block text-sm font-medium text-gray-900 mb-2">¿Cuáles son esos procesos o verificaciones? <span className="text-red-500">*</span></label>
                    {renderTextArea("q18_cuales", "Ej. Detectar si un poder es suficiente...", 2)}
                  </div>
                )}
              </>
            )}

            {currentSection.id === 'sec6' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">19. ¿Cuáles son las preguntas, solicitudes o explicaciones que los clientes repiten con mayor frecuencia? <span className="text-red-500">*</span></label>
                  {renderTextArea("q19", "Ej. Cuánto tardará, qué documentos ocupan...")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">20. ¿Qué mensajes o comunicaciones tiene que escribir repetidamente? <span className="text-red-500">*</span></label>
                  {renderTextArea("q20", "Ej. Correos pidiendo la cédula...")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">21. ¿Actualmente alguien tiene que revisar conversaciones, correos o documentos para extraer información y trasladarla a otro lugar? <span className="text-red-500">*</span></label>
                  {renderRadioGroup("q21", ['Nunca', 'Ocasionalmente', 'Frecuentemente', 'Constantemente'])}
                </div>
              </>
            )}

            {currentSection.id === 'sec7' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">22. Describa brevemente el flujo general de una operación típica de Trust & Escrow, desde que inicia hasta que se cierra. <span className="text-red-500">*</span></label>
                  {renderTextArea("q22", "Flujo...")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">23. ¿Qué documentación o condiciones deben verificarse antes de avanzar o cerrar una operación? <span className="text-red-500">*</span></label>
                  {renderTextArea("q23", "Condiciones...")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">24. ¿Cómo controlan actualmente qué requisitos o condiciones están pendientes? <span className="text-red-500">*</span></label>
                  {renderTextArea("q24", "Controles...")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">25. ¿Qué parte de Trust & Escrow consume más tiempo administrativo o seguimiento? <span className="text-red-500">*</span></label>
                  {renderTextArea("q25", "Cuellos de botella administrativos...")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">26. ¿Qué situaciones suelen generar más coordinación, atrasos o trabajo manual? <span className="text-red-500">*</span></label>
                  {renderTextArea("q26", "Atrasos...")}
                </div>
              </>
            )}

            {currentSection.id === 'sec8' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">27. ¿Qué herramientas utiliza diariamente para operar el negocio? <span className="text-red-500">*</span></label>
                  <DynamicCheckboxGrid options={['WhatsApp', 'Correo', 'Excel', 'Word', 'Google Drive / OneDrive', 'Calendario', 'Sistema contable', 'CRM / sistema de gestión']} selected={formData.q27 as string[]} onToggle={val => toggleArrayItem("q27", val)} onAddCustom={val => toggleArrayItem("q27", val)} otherLabel="Otros" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">28. ¿Dónde siente que actualmente se duplica más el trabajo? <span className="text-red-500">*</span></label>
                  {renderTextArea("q28", "Duplicación...", 2)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">29. ¿Qué proceso depende demasiado de que usted personalmente esté pendiente? <span className="text-red-500">*</span></label>
                  {renderTextArea("q29", "Dependencias...", 2)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">30. Si pudiera mejorar una sola parte de la operación sin cambiar el resto del negocio, ¿cuál sería? <span className="text-red-500">*</span></label>
                  {renderTextArea("q30", "Mejora puntual...", 2)}
                </div>
              </>
            )}

            {currentSection.id === 'sec9' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">31. ¿Cuál es la tarea administrativa que más tiempo le quita? <span className="text-red-500">*</span></label>
                  {renderTextArea("q31", "Tarea...", 2)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">32. ¿Cuál es el proceso donde más fácilmente puede ocurrir un error o atraso? <span className="text-red-500">*</span></label>
                  {renderTextArea("q32", "Proceso propenso a error...", 2)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">33. ¿Ha tenido casos que se atrasen porque faltaba información, documentación o seguimiento? <span className="text-red-500">*</span></label>
                  {renderRadioGroup("q33", ['Nunca', 'Ocasionalmente', 'Frecuentemente'])}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">34. Si mañana el volumen de trabajo se triplicara, ¿qué parte de la operación colapsaría primero? <span className="text-red-500">*</span></label>
                  {renderTextArea("q34", "Punto de quiebre...", 2)}
                </div>
              </>
            )}

            {currentSection.id === 'sec10' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">35. ¿Qué tarea le gustaría dejar de hacer personalmente? <span className="text-red-500">*</span></label>
                    {renderTextArea("q35", "Delegar...", 2)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">36. ¿Qué proceso consume más tiempo actualmente? <span className="text-red-500">*</span></label>
                    {renderTextArea("q36", "Tiempo...", 2)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">37. ¿Qué proceso genera más errores? <span className="text-red-500">*</span></label>
                    {renderTextArea("q37", "Errores...", 2)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">38. ¿Qué proceso queda pendiente u olvidado más frecuentemente? <span className="text-red-500">*</span></label>
                    {renderTextArea("q38", "Olvidos...", 2)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">39. ¿Qué proceso depende más de usted personalmente? <span className="text-red-500">*</span></label>
                    {renderTextArea("q39", "Dependencia...", 2)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">40. Si los clientes se triplicaran, ¿dónde habría más problemas? <span className="text-red-500">*</span></label>
                    {renderTextArea("q40", "Escalabilidad...", 2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">41. Si pudiera eliminar una sola carga administrativa para siempre, ¿cuál sería? <span className="text-red-500">*</span></label>
                  {renderTextArea("q41", "Eliminar...", 2)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">42. ¿Qué proceso automatizado tendría mayor impacto en su negocio? <span className="text-red-500">*</span></label>
                  {renderTextArea("q42", "Impacto...", 2)}
                </div>
              </>
            )}

            {currentSection.id === 'sec11' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 leading-relaxed">43. Si pudiera hacer que una parte de su operación funcionara considerablemente mejor de lo que funciona hoy, sin aumentar personal, ¿qué parte elegiría y qué tendría que mejorar para que realmente hiciera una diferencia en su negocio? <span className="text-red-500">*</span></label>
                  {renderTextArea("q43", "El área a mejorar y qué cambiaría...", 4)}
                </div>
                <div className="mt-8">
                  <label className="block text-sm font-bold text-gray-900 mb-3 leading-relaxed">44. ¿Qué cambiaría para usted si ese problema dejara de existir? <span className="text-red-500">*</span></label>
                  {renderTextArea("q44", "El impacto en su día a día...", 4)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-gray-100 bg-gray-50/80 flex flex-col gap-4 z-10 backdrop-blur-sm">
          {validationError && (
            <div className="text-sm font-medium text-red-600 bg-red-50 px-4 py-3 rounded-[12px] border border-red-100 animate-fadeIn flex items-center gap-2">
              <span className="shrink-0">⚠️</span> {validationError}
            </div>
          )}

          <div className="flex gap-3 sm:gap-4">
            {currentSectionIndex > 0 && (
              <button
                type="button" onClick={handleBack} disabled={isSubmitting}
                className="px-6 py-4 rounded-[14px] font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
              >
                Atrás
              </button>
            )}
            
            {currentSectionIndex < sections.length - 1 ? (
              <button
                type="button" onClick={handleNext}
                className="flex-1 py-4 bg-gray-900 text-white rounded-[14px] font-medium hover:bg-gray-800 transition-colors shadow-sm"
              >
                Continuar
              </button>
            ) : (
              <button
                type="button" onClick={handleSubmit} disabled={isSubmitting}
                className="flex-1 py-4 bg-[#bdf38d] text-gray-900 rounded-[14px] font-semibold hover:bg-[#aee67e] transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <><div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> Enviando...</>
                ) : 'Finalizar y Enviar'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
