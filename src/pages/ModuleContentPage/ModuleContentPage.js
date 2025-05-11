import { Button, Card, CardContent, Progress } from "../../components/ui";
const ModuleContentPage = () => {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Electrical Quantities: Voltage, Current, and Resistance
        </h1>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">1. What are Electrical Quantities?</h2>
          <p className="text-gray-700">Electrical quantities help us understand how electricity works in a circuit. The three main electrical quantities are:</p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li><strong>Voltage (V)</strong> – The push for electricity to move.</li>
            <li><strong>Current (I)</strong> – The flow of electricity.</li>
            <li><strong>Resistance (R)</strong> – The opposition to the flow.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">2. What is Voltage?</h2>
          <p className="text-gray-700">Voltage is the force that pushes electricity through a wire.</p>
          <p className="text-gray-700">It is measured in Volts (V) using a voltmeter.</p>
          <p className="text-gray-700">Formula: <strong>V = I × R</strong></p>
          <h3 className="font-semibold text-gray-700 mt-2">Types of Voltage:</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>DC Voltage – Flows in one direction (e.g., battery).</li>
            <li>AC Voltage – Changes direction (e.g., home electricity).</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">3. What is Current?</h2>
          <p className="text-gray-700">Current is the movement of electric charge.</p>
          <p className="text-gray-700">It is measured in Amperes (A) using an ammeter.</p>
          <p className="text-gray-700">Formula: <strong>I = V / R</strong></p>
          <h3 className="font-semibold text-gray-700 mt-2">Types of Current:</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>DC (Direct Current) – Moves in one direction (e.g., battery power).</li>
            <li>AC (Alternating Current) – Moves back and forth (e.g., electricity at home).</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">4. What is Resistance?</h2>
          <p className="text-gray-700">Resistance slows down electricity flow.</p>
          <p className="text-gray-700">It is measured in Ohms (Ω) using an ohmmeter.</p>
          <p className="text-gray-700">Formula: <strong>R = V / I</strong></p>
          <h3 className="font-semibold text-gray-700 mt-2">Factors that Affect Resistance:</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Material – Conductors (copper) vs. Insulators (rubber).</li>
            <li>Length – Longer wires = more resistance.</li>
            <li>Thickness – Thicker wires = less resistance.</li>
            <li>Temperature – Higher temperature increases resistance.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">5. Ohm’s Law</h2>
          <p className="text-gray-700">Ohm’s Law shows how voltage, current, and resistance are related:</p>
          <p className="font-bold text-gray-900 text-lg">V = I × R</p>
          <p className="text-gray-700">Example: If V = 12V and R = 6Ω, then:</p>
          <p className="font-bold text-gray-900 text-lg">I = 12V / 6Ω = 2A</p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-800">6. Where Do We See These in Real Life?</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li><strong>Voltage:</strong> Batteries, power outlets.</li>
            <li><strong>Current:</strong> Lights, fans, motors.</li>
            <li><strong>Resistance:</strong> Electric heaters, fuses, wires.</li>
          </ul>
        </section>
        <button onClick={() => window.open("https://drive.google.com/file/d/1857J_9E_Kfng5OOpYkrsM_rRQcruJ8md/view?usp=drive_link", "_blank")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Watch Video</button>
        <button onClick={() => window.open("https://drive.google.com/file/d/1csgh_JKxX1CmFNPZ7sHRV-eaQkL8R0GJ/view?usp=drive_link", "_blank")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Watch Video</button>
        <button onClick={() => window.open("https://drive.google.com/file/d/1gFxHkgGnmg611fjZJt4UfWmmN6LekGJp/view?usp=sharing", "_blank")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">PDF Note</button>
        <button onClick={() => window.open("https://drive.google.com/file/d/1BPYtHP8vHArLDzQxXZh_BAYZYLwhl2Gc/view?usp=sharing", "_blank")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Additional Note</button>


      </div>
    </div>
    );
  };
  
  export default ModuleContentPage;