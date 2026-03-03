import "./Overview.css";

export default function Overview() {
  const imageBase = `${import.meta.env.BASE_URL}images/ElectricMotorbike/`;

  return (
    <div className="hudProjectPanel__contentBody">
      <img
        className="electricMotorcycleOverview__image"
        src={`${imageBase}motorbike.png`}
        alt="SPARK electric motorbike"
      />
      <p className="hudProjectPanel__contentText">
        I am on the High Voltage sub-team of the <a href="https://spark.engin.umich.edu/" target="_blank" rel="noopener noreferrer">SPARK Electric Motorbike</a> team. We have previouosly built a 210kW electric bike from scratch that has a top speed of 200mph. This year, we are beginning to design a brand new bike.
      </p>
    </div>
  );
}
