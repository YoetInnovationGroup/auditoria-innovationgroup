const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Update validation logic to make ALL fields required
const validationCode = `
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
`;

content = content.replace(/const validateStep = \(stepId: string\) => \{[\s\S]*?return true;\n  \};\n/m, validationCode.trim() + '\n\n');

// Now, we should add <span className="text-red-500">*</span> to all labels that don't have it.
content = content.replace(/<label className="([^"]+)">([^<]+)<\/label>/g, '<label className="$1">$2 <span className="text-red-500">*</span></label>');

fs.writeFileSync('src/App.tsx', content);
