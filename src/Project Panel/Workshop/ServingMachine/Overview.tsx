export default function Overview() {
  const imageBase = `${import.meta.env.BASE_URL}images/ServingMachine/`;

  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">Demo:</p>
      <div className="hudProjectPanel__videoWrap">
        <iframe
          className="hudProjectPanel__videoFrame"
          src="https://www.youtube-nocookie.com/embed/wHKCj8P0450"
          title="Volleyball Serving Machine Demo"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <p className="hudProjectPanel__contentText">
        I've been playing volleyball since Covid ended and I've loved every second. In fact I'm a U17 provincial champion in Ontario, Canada! I decided to build a serving machine to help me practice my worst skill: passing.
      </p>
      <p className="hudProjectPanel__contentText">
        Here's a photo of my team and I after winning the provincial championship (I'm the third one from the left in the back row):
      </p>
      <img src={`${imageBase}championship.webp`} alt="Provincial championship team photo" />
    </div>
  );
}
