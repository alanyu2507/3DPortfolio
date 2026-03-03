import "./Notes.css";

export default function Notes() {
  const imageBase = `${import.meta.env.BASE_URL}images/Hexapod/`;

  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">
        After 3D printing everything, we first calibrated and attached motors to each joint.
      </p>
      <img
        className="hexapodNotes__image"
        src={`${imageBase}hexapodAssembly.JPG`}
        alt="Hexapod assembly after 3D printing and motor installation"
      />

      <p className="hudProjectPanel__contentText">
        We first did the inverse kinematic calculations on paper.
      </p>
      <img
        className="hexapodNotes__image"
        src={`${imageBase}Calc.jpg`}
        alt="Handwritten inverse kinematics calculations"
      />
      <p className="hudProjectPanel__contentText">
        We then tested it on one leg and mapped directional control to the left joystick.
      </p>
      <img
        className="hexapodNotes__image"
        src={`${imageBase}HexapodIK.gif`}
        alt="Inverse kinematics test on one leg"
      />
      <p className="hudProjectPanel__contentText">
        After that was working, we started designing the walking algorithm. After watching a bunch of videos on hexapod walking, I realized we only had to write one gait function which was basically transferrable to all legs. 3 legs were always on the ground and 3 legs were always in the air, and they basically had inverted gait directions.
      </p>
      <img
        className="hexapodNotes__image"
        src={`${imageBase}GaitDiagram.jpg`}
        alt="Hexapod gait direction diagram"
      />
      <p className="hudProjectPanel__contentText">
      We first designed a gait function that takes in 2 coordinates and repeatedly drags the leg in one direction between them. Then we just called that function for each leg in a loop.
      </p>
      <img
        className="hexapodNotes__image"
        src={`${imageBase}HexapodGait.gif`}
        alt="Initial gait motion test"
      />
      <p className="hudProjectPanel__contentText">We then incorporated limit switches. The basic idea is for the leg to keep decreasing it's z coordinate at the end of it's gait until the limit switch is triggered, meaning it has touched solid ground.</p>
      <img
        className="hexapodNotes__image"
        src={`${imageBase}GaitStateMachine.jpg`}
        alt="Gait state machine diagram"
      />
      <img
        className="hexapodNotes__image"
        src={`${imageBase}GaitCode.jpg`}
        alt="Gait control code snippet"
      />
      <p className="hudProjectPanel__contentText">We then tested this on one leg by wiring a button to the RPI to simulate a limit switch.</p>
      <img
        className="hexapodNotes__image"
        src={`${imageBase}LimitSwitch.gif`}
        alt="Limit switch simulation test"
      />
      <p className="hudProjectPanel__contentText">After we finished our gait algoirhtm, we attached all 6 legs and began working on the flexing algorithm. That was pretty easy since it was just offsetting z coordinates of each leg based on flex direction.</p>
      <img
        className="hexapodNotes__image"
        src={`${imageBase}flex.gif`}
        alt="Hexapod body flexing behavior"
      />
      <p className="hudProjectPanel__contentText">We then designed the overall state machine to allow flexing, walking, and single leg contro.</p>
      <img
        className="hexapodNotes__image"
        src={`${imageBase}HexapodStateMachine.png`}
        alt="Overall hexapod behavior state machine"
      />
    </div>
  );
}
