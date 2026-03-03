export default function Notes() {
  const imageBase = `${import.meta.env.BASE_URL}images/ServingMachine/`;

  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">
        I originally only powered one motor with the 5V output from the Arduino for basic testing. I was also using a cheaper H Bridge with a lower rated current.
      </p>
      <img src={`${imageBase}Original.jpg`} alt="Initial single-motor prototype" className="hexapodArchitecture__diagram"/>
      <p className="hudProjectPanel__contentText">
        I then switched to the 12V power supply. I was still using the cheaper H Bridge since its rated current was technically enough for the motors' rated current. I moved on to designing a custom contoured wheel since I couldn't find any I wanted from Home Depot. I designed a weird attachment system because I had no idea how to attach things to a smooth shaft. I ended up using support couplers that attach to the shaft and screw into the wheel. I also ended up separating the axis and the wheel to reduce filament use for support and also to make it easier for the screwdriver to reach screwholes.
      </p>
      <img src={`${imageBase}Wheel.png`} alt="Custom contoured wheel CAD render" className="hexapodArchitecture__diagram"/>
      <img src={`${imageBase}Axis.png`} alt="Wheel axis component render" className="hexapodArchitecture__diagram"/>
      <p className="hudProjectPanel__contentText">
        After 3D printing the wheel and attaching it to a motor, I tested its grip by launching a ball against the floor.
      </p>
      <img src={`${imageBase}single.gif`} alt="Single-wheel launch grip test" className="hexapodArchitecture__diagram"/>
      <p className="hudProjectPanel__contentText" >
        I then almost burned myself when I tried to pick up the H Bridge. It was way too hot to be normal. After some research, I realized that the stall torque was way higher than the rated torque. When the ball is launched, there is a split second where the motors stall due to the friction of the ball, spiking the current and heating up the H Bridge. I then swapped to a different H Bridge with a higher rated current and bigger heat sink. 
      </p>
      <p className="hudProjectPanel__contentText">
        The last thing I did was to build a frame from aluminum extrusions and attach the wheels and motor to it. The final machine is able to launch balls up to 50mph! (Perfect speed to simulate float serves)
      </p>
      <img src={`${imageBase}Final.jpg`} alt="Final serving machine build" />
    </div>
  );
}
