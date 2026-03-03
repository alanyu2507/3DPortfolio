import "./Notes.css";

export default function Notes() {
  const imageBase = `${import.meta.env.BASE_URL}images/Quadruped/`;

  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">
        Originally, the team used an RPI and CAN HAT to interface with the GIM motors. However, the team has since built their own SPINE board with an RP2350 that natively supports CAN communication.
      </p>
      <img
        className="quadrupedNotes__image"
        src={`${imageBase}RP2350.png`}
        alt="SPINE board with RP2350 microcontroller"
      />
      <p className="hudProjectPanel__contentText">
        I first helped develop a HAL interface to make any FreeRTOS code easily reusable for both the RPI and RP2350 setup. The team and I then implemented all high-priority CAN commands such as heartbeat and estop for both setups. While the team continues to finish the rest of the many, many CAN commands, I was   tasked with working on the FreeRTOS architecture for the SPINE board. 
      </p>
      <p className="hudProjectPanel__contentText">
        I identified 7 tasks for the SPINE board: CAN RX, CAN TX, MCU RX, MCU RX Validation, MCU TX, and Supervisor. CAN RX drains the CAN buffer and parses data to readable motor structs, then updates the global shared motor states of the leg. CAN TX translates validated commands from the MCU to CAN and writes to the socket. MCU RX drains the MCU buffer and pushes a task notification to MCU RX Validation to check freshness, state transitions, and safety clamps. MCU TX publishes the latest motor state to the MCU and is event driven every time the motor state changes. Lastly, the Supervisor task handles heartbeat monitering, and handles the state machine logic.  
      </p>
      <p className="hudProjectPanel__contentText">
        I implemented 7 states for the SPINE board. The first BOOT state sets up MCU and CAN connections, clocks, and intializes FreeRTOS by creating queues and starting tasks. The INIT state verifies motors. The READY state can only read and publish motor states. The MCU can then request to ARM the leg. The ARMING state verifies motor states and send "enable" CAN frames. The ARMED state awaits MCU commands. The RUN state translates any MCU motor command into CAN commands for individual motors. Lastly, a FAULT state exists to safely disable the motors if any error occurs.
      </p>
    </div>
  );
}
