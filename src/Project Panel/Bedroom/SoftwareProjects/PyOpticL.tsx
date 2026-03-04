export default function PyOpticL() {
  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">
        <a href="https://github.com/UMassIonTrappers/PyOpticL" target="_blank" rel="noopener noreferrer">
          PyOpticL
        </a>{" "}
        is an open-source Python-to-CAD library that streamlines optics setup for quantum computing
        research. I worked on it while I was part of the Niffenegger Quantum Computing Lab at the
        University of Massachusetts Amherst. I helped transition the library from 2D to 3D and tested
        it by recreating photo-ionization and repump laser setups. I also pioneered a new rendering
        pipeline for the original OpenCAD models.
      </p>
      <p className="hudProjectPanel__contentText">
        Original FreeCAD model:
      </p>
      <img src="images/SoftwareProjects/mot.png" alt="Original FreeCAD model" className="hexapodArchitecture__diagram" />
      <p className="hudProjectPanel__contentText">
        New rendering pipeline:
      </p>
      <img src="images/SoftwareProjects/Render.png" alt="New rendering pipeline" className="hexapodArchitecture__diagram" />
    </div>
  );
}
