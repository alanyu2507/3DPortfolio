

export default function Music() {
  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">
        Radiohead is my favorite band and Creep is my favorite song of all time. In fact I loved it so much I taught myself piano so I could play it.
      </p>
      <div className="hudProjectPanel__videoWrap">
        <iframe
          className="hudProjectPanel__videoFrame"
          src="https://www.youtube-nocookie.com/embed/ANbZE9bTzOY"
          title="Creep piano cover"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      <p className="hudProjectPanel__contentText">
        I also listen to a lot of Chinese music. I learned how to play 有点甜 (A little sweet).
      </p>
      <div className="hudProjectPanel__videoWrap">
        <iframe
          className="hudProjectPanel__videoFrame"
          src="https://www.youtube-nocookie.com/embed/STTFb2JFO1c"
          title="You Dian Tian piano cover"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <p className="hudProjectPanel__contentText">
        Finally, I learned how to play the menu OST of Clair Obscur Expedition 33 because it just sounded so good.
      </p>

      <div className="hudProjectPanel__videoWrap">
        <iframe
          className="hudProjectPanel__videoFrame"
          src="https://www.youtube-nocookie.com/embed/L3D4YbzOTPs"
          title="Clair Obscur menu OST piano cover"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>


    </div>
  );
}
