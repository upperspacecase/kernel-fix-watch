"use client";

import { Player } from "@remotion/player";
import { Demo, DEMO_DURATION, DEMO_FPS, DEMO_HEIGHT, DEMO_WIDTH } from "@/remotion/Demo";

export function DemoPlayer() {
  return (
    <Player
      component={Demo}
      durationInFrames={DEMO_DURATION}
      fps={DEMO_FPS}
      compositionWidth={DEMO_WIDTH}
      compositionHeight={DEMO_HEIGHT}
      autoPlay
      loop
      initiallyMuted
      controls={false}
      clickToPlay={false}
      acknowledgeRemotionLicense
      style={{ width: "100%", aspectRatio: `${DEMO_WIDTH} / ${DEMO_HEIGHT}` }}
    />
  );
}
