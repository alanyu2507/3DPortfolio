import "./Notes.css";

export default function Notes() {
  const imageBase = `${import.meta.env.BASE_URL}images/ElectricMotorbike/`;

  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">
      I was tasked with replacing the original high-voltage isolation board with a custom in-house designed board. My team and I used Altium to design the PCB and once it was manufactured, the firmware was coded with FreeRTOS.
      </p>
      <img
        className="electricMotorcycleNotes__image"
        src={`${imageBase}IsolationBoard.png`}
        alt="Custom isolation board PCB"
      />
    </div>
  );
}
