// components/ui/Card.js
export const Card = ({ children }) => (
    <div className="border rounded-lg p-4 shadow-md bg-white">{children}</div>
  );
  
  export const CardContent = ({ children }) => (
    <div className="p-2">{children}</div>
  );
  
  // components/ui/Button.js
  export const Button = ({ children, onClick, className }) => (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );
  
  // components/ui/Progress.js
  export const Progress = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-blue-800 h-2.5 rounded-full" 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
  