const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace RadioGroup definition
content = content.replace(
  /const RadioGroup = \(\{ field, options \}: \{ field: keyof typeof formData, options: string\[\] \}\) => \(/g,
  'const renderRadioGroup = (field: keyof typeof formData, options: string[]) => ('
);

// Replace CheckboxGrid definition
content = content.replace(
  /const CheckboxGrid = \(\{ field, options, otherLabel, otherField \}: \{ field: keyof typeof formData, options: string\[\], otherLabel\?: string, otherField\?: keyof typeof formData \}\) => \{/g,
  'const renderCheckboxGrid = (field: keyof typeof formData, options: string[], otherLabel?: string, otherField?: keyof typeof formData) => {'
);

// Replace TextArea definition
content = content.replace(
  /const TextArea = \(\{ field, placeholder, rows = 3 \}: \{ field: keyof typeof formData, placeholder: string, rows\?: number \}\) => \(/g,
  'const renderTextArea = (field: keyof typeof formData, placeholder: string, rows: number = 3) => ('
);

// Replace <RadioGroup field="q1" options={['1', '2']} />
// -> {renderRadioGroup("q1", ['1', '2'])}
content = content.replace(
  /<RadioGroup field="([^"]+)" options=\{([^}]+)\} \/>/g,
  '{renderRadioGroup("$1", $2)}'
);

// Replace <TextArea field="q6" placeholder="Ej. Pido..." />
// -> {renderTextArea("q6", "Ej. Pido...")}
content = content.replace(
  /<TextArea field="([^"]+)" placeholder="([^"]+)" \/>/g,
  '{renderTextArea("$1", "$2")}'
);

content = content.replace(
  /<TextArea field="([^"]+)" placeholder="([^"]+)" rows=\{([^}]+)\} \/>/g,
  '{renderTextArea("$1", "$2", $3)}'
);

// Replace <CheckboxGrid field="q2" options={['A', 'B']} otherLabel="Otros" otherField="q2_other" />
content = content.replace(
  /<CheckboxGrid field="([^"]+)" options=\{([^}]+)\} \/>/g,
  '{renderCheckboxGrid("$1", $2)}'
);

content = content.replace(
  /<CheckboxGrid field="([^"]+)" options=\{([^}]+)\} otherLabel="([^"]+)" otherField="([^"]+)" \/>/g,
  '{renderCheckboxGrid("$1", $2, "$3", "$4")}'
);

fs.writeFileSync('src/App.tsx', content);
