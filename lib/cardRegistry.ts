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
      "Architect is about structure that supports growth. It favors design over reaction.",
    whyToday:
      "When attention is scattered, outcomes get noisy. The sky’s patterns often reward systems—simple inputs that produce reliable results.",
    StardustAction:
      "Build one small structure today that makes tomorrow easier to move through.",
  },

  ascendant: {
    id: "ascendant",
    title: "The Ascendant",
    animatedVideo: "/cards/animated/ascendant.mp4",
    meaning:
      "Ascendant points to how you show up. It’s presence, posture, and first impressions—internally and outwardly.",
    whyToday:
      "Daily cycles shift how energy presents before it settles. Timing favors a clean signal: what you project becomes the frame for what follows.",
    StardustAction:
      "Decide how you want to show up today, and let your actions quietly reflect it.",
  },

  ascension: {
    id: "ascension",
    title: "Ascension",
    animatedVideo: "/cards/animated/ascension.mp4",
    meaning:
      "Ascension is upward motion through consistency. It’s progress that compounds rather than spikes.",
    whyToday:
      "Some days reward acceleration, others reward steady gain. The sky’s rhythm often amplifies compounding behaviors.",
    StardustAction:
      "Take one small step today that you could realistically repeat again tomorrow.",
  },

  ash: {
    id: "ash",
    title: "Ash",
    animatedVideo: "/cards/animated/ash.mp4",
    meaning:
      "Ash is what remains after intensity passes. It’s simplification, clearing, and quiet resets.",
    whyToday:
      "After pressure, the system stabilizes by shedding excess.",
    StardustAction:
      "Remove one unnecessary thing from your day today and notice the space it creates.",
  },

  beacon: {
    id: "beacon",
    title: "Beacon",
    animatedVideo: "/cards/animated/beacon.mp4",
    meaning:
      "Beacon is guidance through clarity. It’s the light you set that others—and you—can navigate by.",
    whyToday:
      "Clarity becomes a stabilizer when variables multiply.",
    StardustAction:
      "Name your main focus for today and let it guide what you say yes to.",
  },

  choice: {
    id: "choice",
    title: "Choice",
    animatedVideo: "/cards/animated/choice.mp4",
    meaning:
      "Choice is agency. It’s the moment you stop drifting and select a direction.",
    whyToday:
      "Small decisions create large downstream effects.",
    StardustAction:
      "Make one clear decision today instead of leaving it unresolved.",
  },

  conduit: {
    id: "conduit",
    title: "The Conduit",
    animatedVideo: "/cards/animated/conduit.mp4",
    meaning:
      "Conduit is clean flow between you and what you’re building.",
    whyToday:
      "Clear channels allow energy to move without resistance.",
    StardustAction:
      "Clear one small bottleneck today so things can move more smoothly.",
  },

  core: {
    id: "core",
    title: "Core",
    animatedVideo: "/cards/animated/core.mp4",
    meaning:
      "Core is essence—what matters when everything else is stripped away.",
    whyToday:
      "Returning to fundamentals stabilizes the system.",
    StardustAction:
      "Reduce one situation today to its simplest truth, then act from there.",
  },

  crossing: {
    id: "crossing",
    title: "Crossing",
    animatedVideo: "/cards/animated/crossing.mp4",
    meaning:
      "Crossing is transition between patterns.",
    whyToday:
      "Lingering often costs more than moving.",
    StardustAction:
      "Take one step today that clearly moves you to the other side of something.",
  },

  drift: {
    id: "drift",
    title: "Drift",
    animatedVideo: "/cards/animated/drift.mp4",
    meaning:
      "Drift is controlled looseness.",
    whyToday:
      "Some days reward responsiveness over control.",
    StardustAction:
      "Loosen your grip on one outcome today and stay responsive instead.",
  },

  echo: {
    id: "echo",
    title: "Echo",
    animatedVideo: "/cards/animated/echo.mp4",
    meaning:
      "Echo is repetition with information.",
    whyToday:
      "Patterns repeat until they’re noticed.",
    StardustAction:
      "Notice what keeps repeating today and treat it as useful information.",
  },

  entry: {
    id: "entry",
    title: "Entry",
    animatedVideo: "/cards/animated/entry.mp4",
    meaning:
      "Entry is beginning with intention.",
    whyToday:
      "Beginnings carry disproportionate influence.",
    StardustAction:
      "Start one thing today with intention instead of rushing into it.",
  },

  fracture: {
    id: "fracture",
    title: "Fracture",
    animatedVideo: "/cards/animated/fracture.mp4",
    meaning:
      "Fracture reveals weak points.",
    whyToday:
      "Pressure exposes what needs attention.",
    StardustAction:
      "Identify one weak point today and reinforce it with a practical change.",
  },

  gravity: {
    id: "gravity",
    title: "Gravity",
    animatedVideo: "/cards/animated/gravity.mp4",
    meaning:
      "Gravity is responsibility and weight.",
    whyToday:
      "Depth matters more than breadth today.",
    StardustAction:
      "Give your best attention today to the task that truly matters most.",
  },

  harbinger: {
    id: "harbinger",
    title: "The Harbinger",
    animatedVideo: "/cards/animated/harbinger.mp4",
    meaning:
      "Harbinger is a signal of change.",
    whyToday:
      "Small indicators often precede big shifts.",
    StardustAction:
      "Notice the strongest signal today and prepare one step ahead of it.",
  },

  ignition: {
    id: "ignition",
    title: "Ignition",
    animatedVideo: "/cards/animated/ignition.mp4",
    meaning:
      "Ignition is activation.",
    whyToday:
      "Momentum is sensitive to timing.",
    StardustAction:
      "Take one idea that’s been in your head and give it a moment of movement today.",
  },

  imprint: {
    id: "imprint",
    title: "Imprint",
    animatedVideo: "/cards/animated/imprint.mp4",
    meaning:
      "Imprint is influence.",
    whyToday:
      "Small moments set lasting tone.",
    StardustAction:
      "Choose one interaction today and leave it better than you found it.",
  },

  lens: {
    id: "lens",
    title: "Lens",
    animatedVideo: "/cards/animated/lens.mp4",
    meaning:
      "Lens is perspective.",
    whyToday:
      "Interpretation shapes outcome.",
    StardustAction:
      "Reframe one challenge today by focusing on what it’s teaching instead of what it’s blocking.",
  },

  luminary: {
    id: "luminary",
    title: "The Luminary",
    animatedVideo: "/cards/animated/luminary.mp4",
    meaning:
      "Luminary is visibility.",
    whyToday:
      "Expression becomes feedback.",
    StardustAction:
      "Allow yourself to take up a little more space today—in your voice, your work, or your presence.",
  },

  matter: {
    id: "matter",
    title: "Matter",
    animatedVideo: "/cards/animated/matter.mp4",
    meaning:
      "Matter is the tangible world.",
    whyToday:
      "Grounding turns ideas into progress.",
    StardustAction:
      "Bring one abstract plan down to earth today by deciding the next real action.",
  },

  navigator: {
    id: "navigator",
    title: "The Navigator",
    animatedVideo: "/cards/animated/navigator.mp4",
    meaning:
      "Navigator is intentional direction.",
    whyToday:
      "Orientation beats speed.",
    StardustAction:
      "Choose one path today and stop reconsidering it for the rest of the day.",
  },

  oracle: {
    id: "oracle",
    title: "The Oracle",
    animatedVideo: "/cards/animated/oracle.mp4",
    meaning:
      "Oracle is insight before proof.",
    whyToday:
      "Subtle signals guide action.",
    StardustAction:
      "Listen closely to your initial response today and follow it instead of second-guessing.",
  },

  outrider: {
    id: "outrider",
    title: "The Outrider",
    animatedVideo: "/cards/animated/outrider.mp4",
    meaning:
      "Outrider explores the edge.",
    whyToday:
      "Curiosity reveals terrain.",
    StardustAction:
      "Follow a moment of curiosity today and see where it leads, even briefly.",
  },

  pioneer: {
    id: "pioneer",
    title: "Pioneer",
    animatedVideo: "/cards/animated/pioneer.mp4",
    meaning:
      "Pioneer favors first movement.",
    whyToday:
      "Motion replaces hesitation.",
    StardustAction:
      "Begin one thing today before you feel completely ready.",
  },

  reckon: {
    id: "reckon",
    title: "Reckon",
    animatedVideo: "/cards/animated/reckon.mp4",
    meaning:
      "Reckon is honest assessment.",
    whyToday:
      "Clarity enables adjustment.",
    StardustAction:
      "Take an honest look at one situation today and name what’s working and what isn’t.",
  },

  release: {
    id: "release",
    title: "Release",
    animatedVideo: "/cards/animated/release.mp4",
    meaning:
      "Release is letting go.",
    whyToday:
      "Clearing restores capacity.",
    StardustAction:
      "Let go of one past memory today that no longer brings you anything but weight.",
  },

  remain: {
    id: "remain",
    title: "Remain",
    animatedVideo: "/cards/animated/remain.mp4",
    meaning:
      "Remain is steadiness.",
    whyToday:
      "Consistency separates signal from noise.",
    StardustAction:
      "Be proud today of one habit or commitment you’ve stayed consistent with.",
  },

  reveal: {
    id: "reveal",
    title: "Reveal",
    animatedVideo: "/cards/animated/reveal.mp4",
    meaning:
      "Reveal is clarity coming into view.",
    whyToday:
      "Truth appears when you’re ready.",
    StardustAction:
      "Acknowledge one truth today that’s already clear to you, even if you don’t say it out loud.",
  },

  root: {
    id: "root",
    title: "Root",
    animatedVideo: "/cards/animated/root.mp4",
    meaning:
      "Root is foundation.",
    whyToday:
      "Stability supports everything else.",
    StardustAction:
      "Strengthen one basic part of your day today—sleep, food, space, or routine.",
  },

  seeker: {
    id: "seeker",
    title: "The Seeker",
    animatedVideo: "/cards/animated/seeker.mp4",
    meaning:
      "Seeker is curiosity with purpose.",
    whyToday:
      "Questions open new paths.",
    StardustAction:
      "Approach one situation today with curiosity instead of assumption.",
  },

  sentinal: {
    id: "sentinal",
    title: "The Sentinal",
    animatedVideo: "/cards/animated/sentinal.mp4",
    meaning:
      "Sentinal is watchfulness.",
    whyToday:
      "Early awareness prevents damage.",
    StardustAction:
      "Watch for one early signal today that something needs attention, and respond calmly.",
  },

  threshold: {
    id: "threshold",
    title: "Threshold",
    animatedVideo: "/cards/animated/threshold.mp4",
    meaning:
      "Threshold marks transition.",
    whyToday:
      "Hesitation creates drag.",
    StardustAction:
      "Step fully into one decision today instead of hovering at the edge of it.",
  },

  trace: {
    id: "trace",
    title: "Trace",
    animatedVideo: "/cards/animated/trace.mp4",
    meaning:
      "Trace is evidence.",
    whyToday:
      "Patterns reveal truth.",
    StardustAction:
      "Pay attention today to what keeps repeating and treat it as useful information.",
  },

  veil: {
    id: "veil",
    title: "Veil",
    animatedVideo: "/cards/animated/veil.mp4",
    meaning:
      "Veil is uncertainty with purpose.",
    whyToday:
      "Patience reveals clarity.",
    StardustAction:
      "Allow one question today to remain unanswered and notice how it changes your pace.",
  },

  visionary: {
    id: "visionary",
    title: "The Visionary",
    animatedVideo: "/cards/animated/visionary.mp4",
    meaning:
      "Visionary sees the long arc.",
    whyToday:
      "Direction matters more than detail.",
    StardustAction:
      "Make one choice today that supports where you want to be in the coming weeks.",
  },

  voyage: {
    id: "voyage",
    title: "Voyage",
    animatedVideo: "/cards/animated/voyage.mp4",
    meaning:
      "Voyage is the journey itself.",
    whyToday:
      "Presence sustains motion.",
    StardustAction:
      "Treat today as part of the journey and focus on experiencing it rather than reaching an outcome.",
  },

  witness: {
    id: "witness",
    title: "Witness",
    animatedVideo: "/cards/animated/witness.mp4",
    meaning:
      "Witness is observation without distortion.",
    whyToday:
      "Clear seeing preserves choice.",
    StardustAction:
      "Spend a moment today simply observing without judgment.",
  },
};

export const ALL_CARDS = Object.values(CARD_REGISTRY);
