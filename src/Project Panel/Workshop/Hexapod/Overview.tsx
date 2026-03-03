import "./Overview.css";

export default function Overview() {
  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">Demo:</p>
      <div className="hudProjectPanel__videoWrap">
        <iframe
          className="hudProjectPanel__videoFrame"
          src="https://www.youtube.com/embed/_bQvNhBsuP8"
          title="Modular Hexapod overview video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      As a die-hard Cyberpunk 2077 fan (if this portfolio didn't already make it obvious), I wanted to recreate the iconic Flathead robot from the game. It's functionalities were a little too sci-fi though, so I settled for a hexapod as the closest thing.
      <br />
      <br />
      While the CAD is open-source from <a href="https://github.com/MakeYourPet/hexapod" 
   target="_blank" 
   rel="noopener noreferrer">
   Make Your Pet
</a>, me and my partner <a href="https://www.hvador.dev/" 
   target="_blank" 
   rel="noopener noreferrer">
   Hans Vador
</a> designed the electronics and software from scratch.
    </div>
  );
}
