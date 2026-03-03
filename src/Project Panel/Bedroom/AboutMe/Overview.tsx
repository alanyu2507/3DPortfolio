import "./Overview.css";

export default function Overview() {
  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">
        I'm Alan Yu, a first year Bachelor of Science inElectrical Engineering student at the University of Michigan. I'm interested in full-stack robotics and embedded systems. 
      </p>
      <p className="hudProjectPanel__contentText">
        That's me in the photo to the left with my parents and my dog!
      </p>
      <div className="aboutMeOverview__socialLinks" aria-label="Social links">
        <a
          className="aboutMeOverview__socialButton"
          href="https://github.com/alanyu2507"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          GitHub
        </a>
        <a
          className="aboutMeOverview__socialButton"
          href="https://www.linkedin.com/in/alanzyu"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          LinkedIn
        </a>
        <a
          className="aboutMeOverview__socialButton"
          href="mailto:alanzyu@umich.edu"
          aria-label="Email"
        >
          Email
        </a>
      </div>
    </div>
  );
}
