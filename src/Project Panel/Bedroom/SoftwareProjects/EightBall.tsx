export default function EightBall() {
  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">
        I made an 8-ball game in three.js and HTML for fun. It was my first time using three.js and a lot of what I learned helped me make this 3D portfolio. To simulate the ball mechanics, I built a simple physics engine with custom collision detection and handling.
      </p>
      <p className="hudProjectPanel__contentText">
        Three.js doesn't have any game-engine features I was used to so it was a big learning curve. For one, you can't actually attach a hitbox to a mesh, so I had to update individual hitbox locations manually. Three.js is also very unoptimized for real-time physics and I had some issues where balls would clip through other balls before the collision registered. So I had to implement a jank system where the physics engine would try and predict the ball's every ball's position a few frames in advance based on their velocity vectors. All mechanics such as collision handling, friction, cue stick rotation, etc. were all built from scratch with vector math.
      </p>
      <p className="hudProjectPanel__contentText">
        You can play the game <a href="https://alanyu2507.github.io/Pool-Game/" target="_blank" rel="noopener noreferrer">here</a>!
      </p>
      <p className="hudProjectPanel__contentText">
        I also made a documentary video that goes more in depth about the process and challenges I faced:
      </p>
      <div className="hudProjectPanel__videoWrap">
        <iframe
          className="hudProjectPanel__videoFrame"
          src="https://www.youtube-nocookie.com/embed/Dh4ayHzN6qo?start=21"
          title="8-Ball Game demo"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
