export type CardId =
  | "architect"
  | "ascendant"
  | "ascension"
  | "ash"
  | "beacon"
  | "choice"
  | "conduit"
  | "core"
  | "crossing"
  | "drift"
  | "echo"
  | "entry"
  | "fracture"
  | "gravity"
  | "harbinger"
  | "ignition"
  | "imprint"
  | "lens"
  | "luminary"
  | "matter"
  | "navigator"
  | "oracle"
  | "outrider"
  | "pioneer"
  | "reckon"
  | "release"
  | "remain"
  | "reveal"
  | "root"
  | "seeker"
  | "sentinal"
  | "threshold"
  | "trace"
  | "veil"
  | "visionary"
  | "voyage"
  | "witness";

export type CardRecord = {
  id: CardId;
  title: string;
  animatedVideo: string;
  meaning: string;
  whyToday: string;
  StardustAction: string;
};

export const CARD_REGISTRY: Record<CardId, CardRecord> = {
  architect: {
    id: "architect",
    title: "The Architect",
    animatedVideo: "/cards/animated/architect.mp4",
    meaning:
      "Build the structure that holds your future steady—systems over scrambling.",
    whyToday:
      "Under today’s sky, scattered focus turns loud; simple structure returns power.",
    StardustAction:
      "Build one small structure today that makes tomorrow easier to move through.",
  },

  ascendant: {
    id: "ascendant",
    title: "The Ascendant",
    animatedVideo: "/cards/animated/ascendant.mp4",
    meaning:
      "Choose your presence—how you enter a room shapes what follows.",
    whyToday:
      "Today’s sky favors a clean signal: what you project becomes the frame.",
    StardustAction:
      "Decide how you want to show up today, and let your actions quietly reflect it.",
  },

  ascension: {
    id: "ascension",
    title: "Ascension",
    animatedVideo: "/cards/animated/ascension.mp4",
    meaning:
      "Climb through consistency—small wins compound into altitude.",
    whyToday:
      "This card shows up when the sky is amplifying repeatable effort over bursts.",
    StardustAction:
      "Take one small step today that you could realistically repeat again tomorrow.",
  },

  ash: {
    id: "ash",
    title: "Ash",
    animatedVideo: "/cards/animated/ash.mp4",
    meaning:
      "Clear what’s burned out—keep only what still has warmth and purpose.",
    whyToday:
      "After intensity, the day asks for simplification so your system can settle.",
    StardustAction:
      "Remove one unnecessary thing from your day today and notice the space it creates.",
  },

  beacon: {
    id: "beacon",
    title: "Beacon",
    animatedVideo: "/cards/animated/beacon.mp4",
    meaning:
      "Set one guiding light—clarity becomes the path.",
    whyToday:
      "Today’s sky multiplies variables; a single clear focus stabilizes everything.",
    StardustAction:
      "Name your main focus for today and let it guide what you say yes to.",
  },

  choice: {
    id: "choice",
    title: "Choice",
    animatedVideo: "/cards/animated/choice.mp4",
    meaning:
      "Claim agency—pick a direction and stop feeding the drift.",
    whyToday:
      "This card shows up when one decision will change the whole downstream story.",
    StardustAction:
      "Make one clear decision today instead of leaving it unresolved.",
  },

  conduit: {
    id: "conduit",
    title: "The Conduit",
    animatedVideo: "/cards/animated/conduit.mp4",
    meaning:
      "Unblock the channel—clean flow is quiet strength.",
    whyToday:
      "Under today’s sky, friction costs more; smoother pathways multiply momentum.",
    StardustAction:
      "Clear one small bottleneck today so things can move more smoothly.",
  },

  core: {
    id: "core",
    title: "Core",
    animatedVideo: "/cards/animated/core.mp4",
    meaning:
      "Return to the essential—what’s true when everything extra is removed.",
    whyToday:
      "The day rewards fundamentals; the simplest truth becomes your compass.",
    StardustAction:
      "Reduce one situation today to its simplest truth, then act from there.",
  },

  crossing: {
    id: "crossing",
    title: "Crossing",
    animatedVideo: "/cards/animated/crossing.mp4",
    meaning:
      "Move through the threshold—transition is the work.",
    whyToday:
      "This card shows up when lingering creates drag and motion restores clarity.",
    StardustAction:
      "Take one step today that clearly moves you to the other side of something.",
  },

  drift: {
    id: "drift",
    title: "Drift",
    animatedVideo: "/cards/animated/drift.mp4",
    meaning:
      "Stay responsive—soft grip, sharp awareness.",
    whyToday:
      "Today’s sky favors adaptation over control; timing beats force.",
    StardustAction:
      "Loosen your grip on one outcome today and stay responsive instead.",
  },

  echo: {
    id: "echo",
    title: "Echo",
    animatedVideo: "/cards/animated/echo.mp4",
    meaning:
      "Listen to repetition—patterns are messages, not noise.",
    whyToday:
      "This card shows up when the same signal keeps returning until you name it.",
    StardustAction:
      "Notice what keeps repeating today and treat it as useful information.",
  },

  entry: {
    id: "entry",
    title: "Entry",
    animatedVideo: "/cards/animated/entry.mp4",
    meaning:
      "Begin with intention—the first step sets the tone.",
    whyToday:
      "Under today’s sky, starts carry extra weight; enter clean and deliberate.",
    StardustAction:
      "Start one thing today with intention instead of rushing into it.",
  },

  fracture: {
    id: "fracture",
    title: "Fracture",
    animatedVideo: "/cards/animated/fracture.mp4",
    meaning:
      "Find the weak point—what cracks is asking to be reinforced.",
    whyToday:
      "Pressure is revealing exactly where a practical fix will save you later.",
    StardustAction:
      "Identify one weak point today and reinforce it with a practical change.",
  },

  gravity: {
    id: "gravity",
    title: "Gravity",
    animatedVideo: "/cards/animated/gravity.mp4",
    meaning:
      "Honor what matters—give weight to the real work.",
    whyToday:
      "Today’s sky pulls you toward depth over breadth; one priority wins.",
    StardustAction:
      "Give your best attention today to the task that truly matters most.",
  },

  harbinger: {
    id: "harbinger",
    title: "The Harbinger",
    animatedVideo: "/cards/animated/harbinger.mp4",
    meaning:
      "Read the signal—change is arriving before it’s obvious.",
    whyToday:
      "This card shows up when small indicators are enough to act ahead of the curve.",
    StardustAction:
      "Notice the strongest signal today and prepare one step ahead of it.",
  },

  ignition: {
    id: "ignition",
    title: "Ignition",
    animatedVideo: "/cards/animated/ignition.mp4",
    meaning:
      "Start the spark—movement creates the fuel.",
    whyToday:
      "Under today’s sky, momentum is sensitive; one push becomes a cascade.",
    StardustAction:
      "Take one idea that’s been in your head and give it a moment of movement today.",
  },

  imprint: {
    id: "imprint",
    title: "Imprint",
    animatedVideo: "/cards/animated/imprint.mp4",
    meaning:
      "Leave a mark with care—small moments set long tone.",
    whyToday:
      "This card shows up when your influence is louder than you think today.",
    StardustAction:
      "Choose one interaction today and leave it better than you found it.",
  },

  lens: {
    id: "lens",
    title: "Lens",
    animatedVideo: "/cards/animated/lens.mp4",
    meaning:
      "Shift perspective—your frame decides the feeling.",
    whyToday:
      "Today’s sky makes interpretation powerful; a cleaner lens changes outcomes fast.",
    StardustAction:
      "Reframe one challenge today by focusing on what it’s teaching instead of what it’s blocking.",
  },

  luminary: {
    id: "luminary",
    title: "The Luminary",
    animatedVideo: "/cards/animated/luminary.mp4",
    meaning:
      "Be seen—your light is part of the work.",
    whyToday:
      "This card shows up when expression becomes feedback and visibility brings alignment.",
    StardustAction:
      "Allow yourself to take up a little more space today—in your voice, your work, or your presence.",
  },

  matter: {
    id: "matter",
    title: "Matter",
    animatedVideo: "/cards/animated/matter.mp4",
    meaning:
      "Make it real—turn idea into tangible progress.",
    whyToday:
      "Under today’s sky, grounding is the advantage; action beats imagining.",
    StardustAction:
      "Bring one abstract plan down to earth today by deciding the next real action.",
  },

  navigator: {
    id: "navigator",
    title: "The Navigator",
    animatedVideo: "/cards/animated/navigator.mp4",
    meaning:
      "Choose your heading—orientation beats speed every time.",
    whyToday:
      "This card shows up when uncertainty is solved by committing to one route.",
    StardustAction:
      "Choose one path today and stop reconsidering it for the rest of the day.",
  },

  oracle: {
    id: "oracle",
    title: "The Oracle",
    animatedVideo: "/cards/animated/oracle.mp4",
    meaning:
      "Trust the first knowing—insight arrives before proof.",
    whyToday:
      "Today’s sky speaks in subtleties; your initial read is cleaner than your doubts.",
    StardustAction:
      "Listen closely to your initial response today and follow it instead of second-guessing.",
  },

  outrider: {
    id: "outrider",
    title: "The Outrider",
    animatedVideo: "/cards/animated/outrider.mp4",
    meaning:
      "Explore the edge—curiosity maps new terrain.",
    whyToday:
      "This card shows up when a small detour reveals something useful you couldn’t plan.",
    StardustAction:
      "Follow a moment of curiosity today and see where it leads, even briefly.",
  },

  pioneer: {
    id: "pioneer",
    title: "Pioneer",
    animatedVideo: "/cards/animated/pioneer.mp4",
    meaning:
      "Go first—beginning is your advantage.",
    whyToday:
      "Under today’s sky, hesitation costs; motion unlocks the next signpost.",
    StardustAction:
      "Begin one thing today before you feel completely ready.",
  },

  reckon: {
    id: "reckon",
    title: "Reckon",
    animatedVideo: "/cards/animated/reckon.mp4",
    meaning:
      "Tell the truth—clear assessment creates clean adjustment.",
    whyToday:
      "Today’s sky favors honesty over comfort; clarity turns into better choices fast.",
    StardustAction:
      "Take an honest look at one situation today and name what’s working and what isn’t.",
  },

  release: {
    id: "release",
    title: "Release",
    animatedVideo: "/cards/animated/release.mp4",
    meaning:
      "Let go with intention—free capacity, reclaim your energy.",
    whyToday:
      "This card shows up when holding on is heavier than moving forward.",
    StardustAction:
      "Let go of one past memory today that no longer brings you anything but weight.",
  },

  remain: {
    id: "remain",
    title: "Remain",
    animatedVideo: "/cards/animated/remain.mp4",
    meaning:
      "Stay steady—consistency separates signal from noise.",
    whyToday:
      "Under today’s sky, reliability wins; quiet repetition becomes your edge.",
    StardustAction:
      "Be proud today of one habit or commitment you’ve stayed consistent with.",
  },

  reveal: {
    id: "reveal",
    title: "Reveal",
    animatedVideo: "/cards/animated/reveal.mp4",
    meaning:
      "Acknowledge what you already know—truth wants daylight.",
    whyToday:
      "This card shows up when clarity is here, and the only delay is your permission.",
    StardustAction:
      "Acknowledge one truth today that’s already clear to you, even if you don’t say it out loud.",
  },

  root: {
    id: "root",
    title: "Root",
    animatedVideo: "/cards/animated/root.mp4",
    meaning:
      "Strengthen the foundation—stability is the multiplier.",
    whyToday:
      "Today’s sky rewards basics: sleep, fuel, space, and routine hold the line.",
    StardustAction:
      "Strengthen one basic part of your day today—sleep, food, space, or routine.",
  },

  seeker: {
    id: "seeker",
    title: "The Seeker",
    animatedVideo: "/cards/animated/seeker.mp4",
    meaning:
      "Ask better questions—curiosity opens locked doors.",
    whyToday:
      "This card shows up when assumptions are expensive and inquiry creates new paths.",
    StardustAction:
      "Approach one situation today with curiosity instead of assumption.",
  },

  sentinal: {
    id: "sentinal",
    title: "The Sentinal",
    animatedVideo: "/cards/animated/sentinal.mp4",
    meaning:
      "Stay watchful—early awareness prevents damage.",
    whyToday:
      "Under today’s sky, subtle warnings appear early; calm attention is protection.",
    StardustAction:
      "Watch for one early signal today that something needs attention, and respond calmly.",
  },

  threshold: {
    id: "threshold",
    title: "Threshold",
    animatedVideo: "/cards/animated/threshold.mp4",
    meaning:
      "Cross fully—half-steps keep you stuck.",
    whyToday:
      "This card shows up when commitment is the only thing missing from the doorway.",
    StardustAction:
      "Step fully into one decision today instead of hovering at the edge of it.",
  },

  trace: {
    id: "trace",
    title: "Trace",
    animatedVideo: "/cards/animated/trace.mp4",
    meaning:
      "Follow the evidence—your life leaves patterns on purpose.",
    whyToday:
      "Today’s sky highlights repeats; what returns is asking to be understood.",
    StardustAction:
      "Pay attention today to what keeps repeating and treat it as useful information.",
  },

  veil: {
    id: "veil",
    title: "Veil",
    animatedVideo: "/cards/animated/veil.mp4",
    meaning:
      "Hold the unknown with grace—mystery can be productive.",
    whyToday:
      "This card shows up when forcing certainty creates distortion; patience clears the view.",
    StardustAction:
      "Allow one question today to remain unanswered and notice how it changes your pace.",
  },

  visionary: {
    id: "visionary",
    title: "The Visionary",
    animatedVideo: "/cards/animated/visionary.mp4",
    meaning:
      "Choose the long arc—direction matters more than detail.",
    whyToday:
      "Under today’s sky, future-aligned choices land cleaner than short-term comfort.",
    StardustAction:
      "Make one choice today that supports where you want to be in the coming weeks.",
  },

  voyage: {
    id: "voyage",
    title: "Voyage",
    animatedVideo: "/cards/animated/voyage.mp4",
    meaning:
      "Stay with the journey—presence is how you sustain motion.",
    whyToday:
      "This card shows up when chasing outcomes drains you; the path itself restores you.",
    StardustAction:
      "Treat today as part of the journey and focus on experiencing it rather than reaching an outcome.",
  },

  witness: {
    id: "witness",
    title: "Witness",
    animatedVideo: "/cards/animated/witness.mp4",
    meaning:
      "Observe without distortion—clear seeing preserves choice.",
    whyToday:
      "Today’s sky rewards neutrality; noticing without judgment keeps you free.",
    StardustAction:
      "Spend a moment today simply observing without judgment.",
  },
};

export const ALL_CARDS = Object.values(CARD_REGISTRY);
