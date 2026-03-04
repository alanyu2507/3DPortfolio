import "./Overview.css";

export default function Overview() {
  const imageBase = `${import.meta.env.BASE_URL}images/Quadruped/`;

  return (
    <div className="hudProjectPanel__contentBody">
      <img
        className="quadrupedOverview__image"
        src={`${imageBase}Quadruped.webp`}
        alt="Quadruped robot prototype"
      />
      <p className="hudProjectPanel__contentText">
      I am helping to build a wheeled quadruped robot from scratch for Atombots Research Lab at the University of Michigan. We are very early in development and I am on the software team. I am currently building custom firmware for our in-house MIT inspired SPINE board. Eventually, I will be working on control software for the main microcontroller as well as using ROS2 to bridge sensors through Nvidia Jetson Orin.
      </p>
    </div>
  );
}
