const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/\{renderCheckboxGrid\("([^"]+)", (\[.*?\]), "([^"]+)", "([^"]+)"\)\}/g, 
  '<DynamicCheckboxGrid options={$2} selected={formData.$1 as string[]} onToggle={val => toggleArrayItem("$1", val)} onAddCustom={val => toggleArrayItem("$1", val)} otherLabel="$3" />'
);

content = content.replace(/\{renderCheckboxGrid\("([^"]+)", (\[.*?\])\)\}/g, 
  '<DynamicCheckboxGrid options={$2} selected={formData.$1 as string[]} onToggle={val => toggleArrayItem("$1", val)} onAddCustom={val => toggleArrayItem("$1", val)} />'
);

fs.writeFileSync('src/App.tsx', content);
