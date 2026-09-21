import { useOutletContext } from "react-router-dom";
import ProjectGrid from "../components/ProjectGrid";
import { INTRO_HOLD_MS } from "../lib/intro";

export default function Works() {
  // When the full-screen intro is playing, hold the cards back until it slides up.
  const { playIntro } = useOutletContext();

  return (
    <div className="px-4 pt-8">
      <ProjectGrid startDelay={playIntro ? INTRO_HOLD_MS / 1000 : 0} />
    </div>
  );
}
