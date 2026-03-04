export default function Architecture() {
  const diagramSrc = `${import.meta.env.BASE_URL}images/ServingMachine/HBridge.webp`;

  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">Materials:</p>
      <ul className="hudProjectPanel__bulletList">
        <li>20,000 RPM 775 DC Motor x2</li>
        <li>30A Dual-Channel H Bridge x1</li>
        <li>Arduino Uno x1</li>
        <li>PS4 Controller x1</li>
        <li>Aluminum Extrusion x10</li>
        <li>12V 5A Power Supply x1</li>
        <li>5mm Guide Shaft Support Coupers x4</li>
      </ul>
      <p className="hudProjectPanel__contentText">Basic Setup:</p>
      <img
        className="hexapodArchitecture__diagram"
        src={diagramSrc}
        alt="Diagram"
      />
      <p>
        The DC motors are wired to the dual-channel H Bridge. The 12V power supply powers the motors through the H Bridge and the H Bridge uses an onboard converter to convert 12V to 5V for the Arduino Uno. The Arduino connects 4 PWM pins to the H Bridge to control the speed and direction of the motors. The Arduino is wired to 2 buttons which can increase or decrease the serving speed.
      </p>
    </div>
  );
}
