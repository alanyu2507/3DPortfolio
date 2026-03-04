export default function Aimlabs() {
  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">
      Nothing much, just recreating Aimlabs in Unreal Engine 5 to make it more satisfying with better sound effects and visuals. I actually made this for my high-school club fair to try and get people to sign up for my game-development club.
      </p>
      <p className="hudProjectPanel__contentText">
        Demo: 
      </p>
      <div className="hudProjectPanel__videoWrap">
        <iframe
          className="hudProjectPanel__videoFrame"
          src="https://www.youtube-nocookie.com/embed/LFMIrD4u_uU"
          title="Aimlabs demo"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
