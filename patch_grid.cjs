const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const dynamicGridCode = `
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
        <label key={opt} className={\`flex items-center gap-3 p-3 rounded-[12px] border cursor-pointer transition-all \${selected.includes(opt) ? 'border-[#bdf38d] bg-[#f8fcf3]' : 'border-gray-200 hover:border-gray-300'}\`}>
          <input type="checkbox" checked={selected.includes(opt)} onChange={() => onToggle(opt)} className="w-4 h-4 text-[#bdf38d] rounded focus:ring-[#bdf38d]" />
          <span className="text-sm font-medium text-gray-700">{opt}</span>
        </label>
      ))}
      {customItems.map(opt => (
        <label key={opt} className={\`flex items-center gap-3 p-3 rounded-[12px] border cursor-pointer transition-all border-[#bdf38d] bg-[#f8fcf3]\`}>
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
`;

// Insert the component before export default function App()
content = content.replace('export default function App() {', dynamicGridCode + '\nexport default function App() {');

// Remove renderCheckboxGrid definition
content = content.replace(/const renderCheckboxGrid = [\s\S]*?  \};\n\n/, '');

// Fix occurrences of renderCheckboxGrid
content = content.replace(
  /\{renderCheckboxGrid\("([^"]+)", ([^,]+)\)\}/g,
  '<DynamicCheckboxGrid options={$2} selected={formData.$1 as string[]} onToggle={val => toggleArrayItem("$1", val)} onAddCustom={val => toggleArrayItem("$1", val)} />'
);

content = content.replace(
  /\{renderCheckboxGrid\("([^"]+)", ([^,]+), "([^"]+)", "([^"]+)"\)\}/g,
  '<DynamicCheckboxGrid options={$2} selected={formData.$1 as string[]} onToggle={val => toggleArrayItem("$1", val)} onAddCustom={val => toggleArrayItem("$1", val)} otherLabel="$3" />'
);

// Fix JSON generation logic since it no longer uses qX_other!
// [...formData.q2, formData.q2.includes('Otros') ? formData.q2_other : ''].filter(Boolean)
// -> formData.q2
content = content.replace(/\[\.\.\.formData\.q2, formData\.q2\.includes\('Otros'\) \? formData\.q2_other : ''\]\.filter\(Boolean\)/g, 'formData.q2');
content = content.replace(/\[\.\.\.formData\.q5, formData\.q5\.includes\('Otro'\) \? formData\.q5_other : ''\]\.filter\(Boolean\)/g, 'formData.q5');
content = content.replace(/\[\.\.\.formData\.q7, formData\.q7\.includes\('Otro'\) \? formData\.q7_other : ''\]\.filter\(Boolean\)/g, 'formData.q7');
content = content.replace(/\[\.\.\.formData\.q12, formData\.q12\.includes\('Otro'\) \? formData\.q12_other : ''\]\.filter\(Boolean\)/g, 'formData.q12');
content = content.replace(/\[\.\.\.formData\.q27, formData\.q27\.includes\('Otros'\) \? formData\.q27_other : ''\]\.filter\(Boolean\)/g, 'formData.q27');

fs.writeFileSync('src/App.tsx', content);
