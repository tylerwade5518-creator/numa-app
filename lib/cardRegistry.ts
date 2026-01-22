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
  animatedVideo: string; // served from /public
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
      "Build one small structure that makes tomorrow easier, then follow it once.",
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
      "Choose one trait to embody today, and make your next three actions match it.",
  },

  ascension: {
    id: "ascension",
    title: "Ascension",
    animatedVideo: "/cards/animated/ascension.mp4",
    meaning:
      "Ascension is upward motion through consistency. It’s progress that compounds rather than spikes.",
    whyToday:
      "Some days reward acceleration, others reward steady gain. The sky’s rhythm often amplifies compounding behaviors—small wins stacked cleanly.",
    StardustAction:
      "Pick one skill or goal and take a step that is small enough to repeat tomorrow.",
  },

  ash: {
    id: "ash",
    title: "Ash",
    animatedVideo: "/cards/animated/ash.mp4",
    meaning:
      "Ash is what remains after intensity passes. It’s simplification, clearing, and quiet resets.",
    whyToday:
      "After pressure, the system stabilizes by shedding excess. The sky’s cycles are often about reducing noise so the next signal can emerge.",
    StardustAction:
      "Remove one unnecessary thing from your day, and let the space be the benefit.",
  },

  beacon: {
    id: "beacon",
    title: "Beacon",
    animatedVideo: "/cards/animated/beacon.mp4",
    meaning:
      "Beacon is guidance through clarity. It’s the light you set that others—and you—can navigate by.",
    whyToday:
      "When variables multiply, clarity becomes a stabilizer. Sky-driven shifts often favor the simplest bright point: one priority made obvious.",
    StardustAction:
      "Name your north star for today in one sentence, then act like it’s true.",
  },

  choice: {
    id: "choice",
    title: "Choice",
    animatedVideo: "/cards/animated/choice.mp4",
    meaning:
      "Choice is agency. It’s the moment you stop drifting and select a direction.",
    whyToday:
      "In many sky cycles, small decisions create large downstream effects. Today favors selection—removing ambiguity so momentum can form.",
    StardustAction:
      "Make one decision you’ve been delaying, then take the first confirming step.",
  },

  conduit: {
    id: "conduit",
    title: "The Conduit",
    animatedVideo: "/cards/animated/conduit.mp4",
    meaning:
      "Conduit is clean flow between you and what you’re building. It’s connection without friction.",
    whyToday:
      "When energy meets resistance, it disperses. Planetary rhythms often reward clear channels—communication, pathways, and simplified handoffs.",
    StardustAction:
      "Clear one bottleneck—one message, one link, one block—so flow can resume.",
  },

  core: {
    id: "core",
    title: "Core",
    animatedVideo: "/cards/animated/core.mp4",
    meaning:
      "Core is essence. It’s what matters when everything else is stripped away.",
    whyToday:
      "Sky cycles can exaggerate surface noise. Returning to fundamentals stabilizes the system and makes the next move obvious.",
    StardustAction:
      "Reduce one situation to its simplest truth, then act from that center.",
  },

  crossing: {
    id: "crossing",
    title: "Crossing",
    animatedVideo: "/cards/animated/crossing.mp4",
    meaning:
      "Crossing is transition. It’s the threshold between the old pattern and the new one.",
    whyToday:
      "Timing windows open and close. Sky motion often signals that lingering costs more than moving—transition becomes the efficient path.",
    StardustAction:
      "Take the step that puts you on the other side of something, even if it’s small.",
  },

  drift: {
    id: "drift",
    title: "Drift",
    animatedVideo: "/cards/animated/drift.mp4",
    meaning:
      "Drift is controlled looseness. It’s allowing motion without forcing precision.",
    whyToday:
      "Not every day favors grip and control. Some sky phases reward responsiveness—micro-adjustments guided by feedback, not willpower.",
    StardustAction:
      "Loosen your grip on one outcome, and focus on staying responsive instead.",
  },

  echo: {
    id: "echo",
    title: "Echo",
    animatedVideo: "/cards/animated/echo.mp4",
    meaning:
      "Echo is repetition with information. It’s patterns returning so you can learn what they mean.",
    whyToday:
      "Cycles repeat because systems teach through recurrence. The sky’s rhythm often surfaces the same theme until you respond differently.",
    StardustAction:
      "Notice what keeps repeating, then change one input to change the result.",
  },

  entry: {
    id: "entry",
    title: "Entry",
    animatedVideo: "/cards/animated/entry.mp4",
    meaning:
      "Entry is beginning with intention. It’s how you step into a space, a task, or a new phase.",
    whyToday:
      "Beginnings carry disproportionate influence. In many timing cycles, the first move sets the trajectory more than the later corrections.",
    StardustAction:
      "Start one thing cleanly—set the tone, then proceed without rushing.",
  },

  fracture: {
    id: "fracture",
    title: "Fracture",
    animatedVideo: "/cards/animated/fracture.mp4",
    meaning:
      "Fracture reveals weak points. It’s tension that shows you what can’t stay as it is.",
    whyToday:
      "When pressure rises, faults become visible. Sky-driven shifts often act like stress tests—exposing what needs reinforcement or release.",
    StardustAction:
      "Name the weak point honestly, then reinforce it with one practical change.",
  },

  gravity: {
    id: "gravity",
    title: "Gravity",
    animatedVideo: "/cards/animated/gravity.mp4",
    meaning:
      "Gravity is responsibility and weight. It’s the pull of what truly matters.",
    whyToday:
      "Some cycles favor depth over breadth. The sky’s timing often rewards commitment to the heavy thing—the one that anchors everything else.",
    StardustAction:
      "Put your best attention on the most important task first, then protect it.",
  },

  harbinger: {
    id: "harbinger",
    title: "The Harbinger",
    animatedVideo: "/cards/animated/harbinger.mp4",
    meaning:
      "Harbinger is a signal of change. It’s a pattern that suggests what’s approaching.",
    whyToday:
      "The sky moves in precursors—small indicators before big shifts. Today favors interpreting signals early so you can adjust proactively.",
    StardustAction:
      "Identify the strongest signal you’re seeing, and prepare one step ahead of it.",
  },

  ignition: {
    id: "ignition",
    title: "Ignition",
    animatedVideo: "/cards/animated/ignition.mp4",
    meaning:
      "Ignition is activation. It’s the spark that turns intention into motion.",
    whyToday:
      "Momentum is sensitive to timing. Sky rhythms often create short windows where starting is easier than sustaining—use the spark.",
    StardustAction:
      "Begin the smallest version of what you want, then let motion do the rest.",
  },

  imprint: {
    id: "imprint",
    title: "Imprint",
    animatedVideo: "/cards/animated/imprint.mp4",
    meaning:
      "Imprint is influence. It’s what your choices leave behind in people, systems, and outcomes.",
    whyToday:
      "Subtle actions can set lasting tone. The sky’s cycles often emphasize the long tail—small moments that shape future behavior.",
    StardustAction:
      "Make one choice today that your future self will recognize as a turning point.",
  },

  lens: {
    id: "lens",
    title: "Lens",
    animatedVideo: "/cards/animated/lens.mp4",
    meaning:
      "Lens is perspective. It’s how you interpret what’s happening and what it means.",
    whyToday:
      "When conditions are complex, interpretation matters as much as facts. Sky timing often favors reframing—seeing the same data differently.",
    StardustAction:
      "Change the frame on one situation, then act from the new perspective.",
  },

  luminary: {
    id: "luminary",
    title: "The Luminary",
    animatedVideo: "/cards/animated/luminary.mp4",
    meaning:
      "Luminary is visibility and radiance. It’s being seen for what you bring.",
    whyToday:
      "Some cycles highlight expression—what you show becomes feedback. The sky’s rhythms can amplify presence when you’re clear and honest.",
    StardustAction:
      "Share one thing you’ve kept hidden, with calm confidence and no over-explaining.",
  },

  matter: {
    id: "matter",
    title: "Matter",
    animatedVideo: "/cards/animated/matter.mp4",
    meaning:
      "Matter is the real world: resources, body, time, and constraints. It’s what’s tangible and true.",
    whyToday:
      "Sky cycles can pull attention into ideas. Today favors grounding—turning a concept into a physical next step you can measure.",
    StardustAction:
      "Make one abstract goal concrete by defining the next physical action.",
  },

  navigator: {
    id: "navigator",
    title: "The Navigator",
    animatedVideo: "/cards/animated/navigator.mp4",
    meaning:
      "Navigator represents intentional direction. It’s choosing where your energy goes instead of reacting to what pulls at you.",
    whyToday:
      "Timing cycles often amplify small decisions into bigger trajectories. The sky favors orientation over speed—steering beats sprinting.",
    StardustAction:
      "Pause before your next commitment, then choose the direction you want to reinforce.",
  },

  oracle: {
    id: "oracle",
    title: "The Oracle",
    animatedVideo: "/cards/animated/oracle.mp4",
    meaning:
      "Oracle is insight before proof. It’s intuition refined by pattern recognition.",
    whyToday:
      "When outcomes aren’t fully visible, pattern-sensing becomes valuable. Sky rhythms often reward listening to subtle signals before they harden.",
    StardustAction:
      "Trust the quiet signal you keep receiving, and act on it once without debate.",
  },

  outrider: {
    id: "outrider",
    title: "The Outrider",
    animatedVideo: "/cards/animated/outrider.mp4",
    meaning:
      "Outrider is exploration at the edge. It’s scouting what’s possible before others see it.",
    whyToday:
      "Some cycles favor novelty and range. The sky’s motion can support experimentation—small tests that reveal terrain without big risk.",
    StardustAction:
      "Try one new approach in a low-stakes way, then keep what works.",
  },

  pioneer: {
    id: "pioneer",
    title: "Pioneer",
    animatedVideo: "/cards/animated/pioneer.mp4",
    meaning:
      "Pioneer is first movement. It favors starting before certainty and learning through motion.",
    whyToday:
      "Sky timing often opens a narrow window for initiation. Momentum builds faster when you move early instead of waiting for perfect clarity.",
    StardustAction:
      "Take the first step on something you’ve been hesitating on, then keep it simple.",
  },

  reckon: {
    id: "reckon",
    title: "Reckon",
    animatedVideo: "/cards/animated/reckon.mp4",
    meaning:
      "Reckon is honest accounting. It’s facing what’s true so you can adjust cleanly.",
    whyToday:
      "Cycles bring check-in points where reality wins. The sky often favors recalibration—measuring what’s working and what isn’t.",
    StardustAction:
      "Review one area with full honesty, then make one corrective decision.",
  },

  release: {
    id: "release",
    title: "Release",
    animatedVideo: "/cards/animated/release.mp4",
    meaning:
      "Release is letting go with intention. It’s removing what drains energy without adding value.",
    whyToday:
      "Sky rhythms have clearing phases. When pressure increases, release restores capacity and makes the next move lighter.",
    StardustAction:
      "Let go of one obligation, story, or attachment that’s costing more than it returns.",
  },

  remain: {
    id: "remain",
    title: "Remain",
    animatedVideo: "/cards/animated/remain.mp4",
    meaning:
      "Remain is steadiness. It’s holding position when movement would be noise.",
    whyToday:
      "Not all timing windows demand action. Some sky cycles reward stability—staying consistent so signals can separate from interference.",
    StardustAction:
      "Hold one boundary or routine steady today, and let that be your power.",
  },

  reveal: {
    id: "reveal",
    title: "Reveal",
    animatedVideo: "/cards/animated/reveal.mp4",
    meaning:
      "Reveal is truth coming into view. It’s clarity that changes how you proceed.",
    whyToday:
      "Cycles tend to surface information when you’re ready to use it. The sky often supports disclosure—facts, feelings, or direction becoming clearer.",
    StardustAction:
      "Tell the truth in the simplest form, then let the next step present itself.",
  },

  root: {
    id: "root",
    title: "Root",
    animatedVideo: "/cards/animated/root.mp4",
    meaning:
      "Root is foundation. It’s stability built from basics done well.",
    whyToday:
      "When conditions shift, foundations matter. Sky timing often rewards returning to fundamentals—sleep, food, priorities, and core commitments.",
    StardustAction:
      "Strengthen one foundation today, then refuse to overcomplicate it.",
  },

  seeker: {
    id: "seeker",
    title: "The Seeker",
    animatedVideo: "/cards/animated/seeker.mp4",
    meaning:
      "Seeker is curiosity with purpose. It’s learning that changes your trajectory.",
    whyToday:
      "In many cycles, the best move is investigation. The sky’s rhythm can favor questions over conclusions—information first, certainty later.",
    StardustAction:
      "Ask one better question today, then follow the answer one step deeper.",
  },

  sentinal: {
    id: "sentinal",
    title: "The Sentinal",
    animatedVideo: "/cards/animated/sentinal.mp4",
    meaning:
      "Sentinal is watchfulness and protection. It’s awareness that prevents avoidable damage.",
    whyToday:
      "Timing cycles can heighten sensitivity to risk and signal. The sky often favors vigilance—detecting what’s off early, then correcting calmly.",
    StardustAction:
      "Notice one early warning sign, and respond with one quiet protective move.",
  },

  threshold: {
    id: "threshold",
    title: "Threshold",
    animatedVideo: "/cards/animated/threshold.mp4",
    meaning:
      "Threshold is commitment to the next phase. It’s the point where you stop rehearsing and enter.",
    whyToday:
      "Cycles create momentums where hesitation becomes drag. The sky often favors crossing when the door is open—decisive, clean entry.",
    StardustAction:
      "Step into the next version of your day with one decisive action, then continue.",
  },

  trace: {
    id: "trace",
    title: "Trace",
    animatedVideo: "/cards/animated/trace.mp4",
    meaning:
      "Trace is evidence. It’s following the real pattern instead of the story you prefer.",
    whyToday:
      "Sky timing can bring subtle but consistent signals. Paying attention to evidence—small repeats and outcomes—reveals what’s actually true.",
    StardustAction:
      "Track one result today, then let the data guide your next choice.",
  },

  veil: {
    id: "veil",
    title: "Veil",
    animatedVideo: "/cards/animated/veil.mp4",
    meaning:
      "Veil is uncertainty with purpose. It’s not knowing yet—and using that space wisely.",
    whyToday:
      "Some cycles reduce visibility. The sky can favor patience and signal-reading—moving carefully until the picture resolves.",
    StardustAction:
      "Slow your decisions today, and choose clarity over speed in one key moment.",
  },

  visionary: {
    id: "visionary",
    title: "The Visionary",
    animatedVideo: "/cards/animated/visionary.mp4",
    meaning:
      "Visionary is future-focus. It’s seeing beyond the immediate and aligning with the long arc.",
    whyToday:
      "Cycles often favor planning when short-term noise is high. The sky’s rhythm can reward long-range thinking—direction before detail.",
    StardustAction:
      "Make one choice today that serves the next month, not just the next hour.",
  },

  voyage: {
    id: "voyage",
    title: "Voyage",
    animatedVideo: "/cards/animated/voyage.mp4",
    meaning:
      "Voyage is the path, not the destination. It’s progress through experience and course-correction.",
    whyToday:
      "Sky timing often emphasizes movement through phases—start, adjust, continue. The best results come from traveling light and adapting fast.",
    StardustAction:
      "Move forward with a flexible plan today, then adjust once based on feedback.",
  },

  witness: {
    id: "witness",
    title: "Witness",
    animatedVideo: "/cards/animated/witness.mp4",
    meaning:
      "Witness is observation without distortion. It’s seeing clearly before you intervene.",
    whyToday:
      "Cycles can intensify emotion and interpretation. The sky often rewards clean observation—separating fact from reaction so choice stays yours.",
    StardustAction:
      "Observe one situation without changing it, then respond only after you understand it.",
  },
};

export const ALL_CARDS = Object.values(CARD_REGISTRY);
