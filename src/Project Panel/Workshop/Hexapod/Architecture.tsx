import "./Architecture.css";

export default function Architecture() {
  const diagramSrc = `${import.meta.env.BASE_URL}images/Hexapod/HexapodElectronics.png`;

  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">Materials:</p>
      <ul className="hudProjectPanel__bulletList">
        <li>MG996R Servos x18</li>
        <li>Servo 2040 x1</li>
        <li>Raspberry Pi 4 x1</li>
        <li>PS4 Controller x1</li>
        <li>M1.7 Self-tapping Screws</li>
        <li>Rubber Tips x6</li>
        <li>Limit Switches x6</li>
      </ul>
      <p className="hudProjectPanel__contentText">High Level Diagram:</p>
      <img
        className="hexapodArchitecture__diagram"
        src={diagramSrc}
        alt="Hexapod electronics architecture diagram"
      />
      <p>
        The PS4 controller would send raw inputs to the RPI4 over bluetooth. The RPI4 is the main controller. It performed all the inverse kinematics calculations and handled the state machine. The Servo2040 recieved packaged serial commands from the RPI4 and set appropriate servos to desired angles. The Servo2040 would send limit switch data, which tracked when each leg touched solid ground, back to the RPI4 for gait correction.
      </p>
      
    </div>
  );
}
