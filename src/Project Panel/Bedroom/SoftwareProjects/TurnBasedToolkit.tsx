export default function TurnBasedToolkit() {
  return (
    <div className="hudProjectPanel__contentBody">
      <p className="hudProjectPanel__contentText">
        Some of my favorite games are top-down turn-based games such as Divinity Original Sin 2, XCOM 2, and of course Baldur's Gate 3. I decided to create a modular toolkit to help me create my own turn-based games.  
      </p>
      <p className="hudProjectPanel__contentText">
        The toolkit consists of a combat supervisor, a basic enemy class and a basic player class. The player class also contained custom inventory, stats, and ability components. The combat supervisor handles combat logic such as turn ordering, execution, and initialization/end conditions. The enemy class had basic AI behavior and instantiable stats to easily create diverse enemy types. Sub classes could also be derived for more specific enemy types. The player class is also instantiable to easily create different companions with individual stats and abilities. The stats component kept track of damage scaling, health, ability unlocks etc. The ability component kept track of cooldowns, availability, vfx etc. The inventory kept track of items and equipped gear. 
      </p>
      <p className="hudProjectPanel__contentText">
        Here is a quick demo of the toolkit:
      </p>
      <div className="hudProjectPanel__videoWrap">
        <iframe
          className="hudProjectPanel__videoFrame"
          src="https://www.youtube-nocookie.com/embed/58hJkFxBt_Y"
          title="TurnBasedToolkit demo"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
