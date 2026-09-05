const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add a state for tracking if the welcome screen has been passed
content = content.replace(/const \[isSuccess, setIsSuccess\] = useState\(false\);/, "const [isSuccess, setIsSuccess] = useState(false);\n  const [hasStarted, setHasStarted] = useState(false);");

// Create the welcome screen logic
const welcomeScreen = `
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
`;

// Insert the welcome screen before the success screen
content = content.replace(/\/\/ --- Screens ---\n  if \(isSuccess\) \{/, welcomeScreen);

// Update success screen to also reset hasStarted to false
content = content.replace(/setIsSuccess\(false\); setCurrentSectionIndex\(0\);/, "setIsSuccess(false); setHasStarted(false); setCurrentSectionIndex(0);");

fs.writeFileSync('src/App.tsx', content);
