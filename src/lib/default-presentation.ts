import { PresentationData } from "@/types/presentation";

export const DEFAULT_THESIS_PRESENTATION: PresentationData = {
  siteBrand: "Wijdane LAAGUIDI Hakma La Zone",
  topic: "Integrated Supply-Chain Coordination Framework",
  subtitle:
    "Synchronizing Production Planning, Procurement and Capacity Management under EDI Demand Variability",
  program: "Mercedes-Benz VAN Program · Kromberg & Schubert, Kenitra (Plant K3)",
  candidates: "Wijdane Laaguidi · Salma Lsilis",
  supervisors: "Prof. Mohamed Mamad (academic) · Younes Benrkiya (internship)",
  institution: "Ibn Tofail University · Kromberg & Schubert",
  year: "2026",
  theme: "luxury-gold",
  slides: [
    // SLIDE 1
    {
      id: "slide-1",
      slideNumber: 1,
      act: "MASTER’S THESIS DEFENSE · 2026",
      layout: "title",
      title: "Integrated Supply-Chain Coordination Framework",
      subtitle:
        "Synchronizing Production Planning, Procurement and Capacity Management under EDI Demand Variability",
      bulletPoints: [
        "Mercedes-Benz VAN Program · Kromberg & Schubert, Kenitra (Plant K3)",
        "Presented by: Wijdane Laaguidi · Salma Lsilis",
        "Supervised by: Prof. Mohamed Mamad (academic) · Younes Benrkiya (internship)",
        "Ibn Tofail University & Kromberg & Schubert",
      ],
      bottomCallout: "Master's Thesis Defense · Ibn Tofail University & Kromberg & Schubert (Plant K3)",
      speaker: "Wijdane & Salma",
      speakerNotes:
        "Good morning respected jury members and supervisors. Today, Salma Lsilis and I, Wijdane Laaguidi, are honored to present our Master's Thesis on building an Integrated Supply-Chain Coordination Framework under EDI demand variability at Kromberg & Schubert Kenitra (Plant K3) for the Mercedes-Benz VAN program.",
      durationMinutes: 1,
    },
    // SLIDE 2
    {
      id: "slide-2",
      slideNumber: 2,
      act: "ACT I · THE INDUSTRIAL JOURNEY",
      layout: "cards",
      title: "We entered the supply chain from the inside: Procurement and Planning, side by side",
      subtitle: "Embedded observation across two core operational functions at Plant K3",
      cards: [
        {
          badge: "01",
          title: "K&S Group",
          description:
            "German company founded in 1902, headquartered in Abensberg; 50,000+ people, 40+ global sites.",
        },
        {
          badge: "02",
          title: "Kenitra, Morocco",
          description:
            "First plant K1 opened in 2015; Plant K3 runs the dedicated Mercedes-Benz VAN program.",
        },
        {
          badge: "03",
          title: "Logistics Department",
          description:
            "Disposition (Procurement) · Planning · Material Flow · Incoming · Dispatch · Transport.",
        },
        {
          badge: "04",
          title: "Our Seats in the System",
          description:
            "Wijdane Laaguidi: Raw Material Procurement · Salma Lsilis: Production Planning.",
        },
      ],
      bulletPoints: [],
      bottomCallout:
        "Research context: pre-series production at K3, with the transition to mass production expected about two weeks after the study window — a real industrial situation, not an abstract assumption.",
      speaker: "Wijdane Laaguidi",
      speakerNotes:
        "We experienced the supply chain from the inside: I was embedded in Raw Material Procurement while Salma was inside Production Planning at K3, right as the Mercedes-Benz VAN program prepared to transition from pre-series to mass production.",
      durationMinutes: 1.5,
    },
    // SLIDE 3
    {
      id: "slide-3",
      slideNumber: 3,
      act: "ACT I · THE INDUSTRIAL JOURNEY",
      layout: "cards",
      title: "From pre-series to mass production: the window to fix coordination before volumes rise",
      subtitle: "Critical transition phase with external cover phasing out",
      cards: [
        {
          badge: "PHASE 1",
          title: "PRE-SERIES",
          description: "Ramp-up & stabilization window",
          items: [
            "Capacity and output still developing",
            "Requirements and technical modifications keep changing",
            "Readiness depends on supplier quality and deliveries",
          ],
        },
        {
          badge: "PHASE 2",
          title: "TRANSITION",
          description: "Critical 2-week turning point",
          items: [
            "Mass production expected about two weeks after the study window",
            "Coordination routines must exist before volumes increase",
            "Escalation and MOCA practices still improvised",
          ],
        },
        {
          badge: "PHASE 3",
          title: "MASS PRODUCTION",
          description: "Full autonomy required",
          items: [
            "External cover (Macedonia, K2) phased out",
            "No documented replacement capacity or contingency plan yet",
            "Needs stable, shared coordination",
          ],
        },
      ],
      bulletPoints: [],
      bottomCallout:
        "Pre-series is the opportunity to identify and correct coordination weaknesses before volumes increase.",
      speaker: "Salma Lsilis",
      speakerNotes:
        "This slide highlights why timing was so critical: during pre-series, sister plants in Macedonia and K2 provided backup cover. In mass production, that cover disappears—meaning any coordination weakness must be solved before volumes scale.",
      durationMinutes: 1.5,
    },
    // SLIDE 4
    {
      id: "slide-4",
      slideNumber: 4,
      act: "ACT I · THE INDUSTRIAL JOURNEY",
      layout: "flow",
      title: "EDI transmits the customer’s changes — but who acts on them?",
      subtitle: "A single revision affects several functions simultaneously",
      cards: [
        {
          badge: "STEP 1 · EDI SOLVES THIS ONLY",
          title: "Customer → EDI Demand Information",
          description:
            "Mercedes-Benz (14-day contractual lead time) sends Call-offs and revisions: ↑ ↓ postponed · cancelled.",
        },
        {
          badge: "STEP 2 · INTERPRETATION",
          title: "Production Planning",
          description:
            "Receives and interprets the change — translates customer releases into operational questions.",
        },
        {
          badge: "STEP 3–5 · DECISION, COORDINATION & EXECUTION",
          title: "Cross-Functional Operational Decisions",
          description:
            "Procurement & purchase commitments · Material availability · Production scheduling · Capacity management · Industrial Engineering · Material Flow.",
        },
      ],
      bulletPoints: [
        "1. Transmission (EDI solves step 1 only)",
        "2. Interpretation",
        "3. Decision",
        "4. Coordination",
        "5. Execution & follow-up",
      ],
      bottomCallout:
        "EDI transmits customer information — but receiving it does not automatically guarantee coordinated operational action.",
      speaker: "Salma Lsilis",
      speakerNotes:
        "While EDI automates Step 1—transmitting call-offs from Mercedes-Benz—Steps 2 through 5 (interpretation, decision, coordination, and execution across six functions) are not automated by EDI.",
      durationMinutes: 1.5,
    },
    // SLIDE 5
    {
      id: "slide-5",
      slideNumber: 5,
      act: "ACT I · THE INDUSTRIAL JOURNEY",
      layout: "cards",
      title: "The first warning signs: the same demand change, felt differently across functions",
      subtitle:
        "Mercedes-Benz EDI → Production Planning → Procurement → Material Flow → Production floor (Along the Flow & Lateral)",
      cards: [
        {
          badge: "01 · MANUAL DELAY",
          title: "Type 1 vs Type 2/3 Orders",
          description:
            "Type 1 changes update automatically; Type 2/3 are re-entered manually, so information arrives late.",
        },
        {
          badge: "02 · SPREADSHEET RISK",
          title: "Emails & Duplicated Files",
          description:
            "Coordination relies on emails and spreadsheets; a duplicated requirement file nearly triggered unwarranted purchases.",
        },
        {
          badge: "03 · SHOP FLOOR SURPRISE",
          title: "Indirect Material Flow Alert",
          description:
            "Material Flow often learns of an increase only when the shop floor runs out of wires.",
        },
        {
          badge: "04 & 05 · LATERAL FRICTION",
          title: "Quality, IE & Planning Disagreements",
          description:
            "Quality blocked substitute wires until IE finalized the AVI document. Planning & IE disagree: uniform standard time vs harness-specific times.",
        },
      ],
      bulletPoints: [],
      bottomCallout: "We saw it first; Act II tests whether it was systematic.",
      speaker: "Wijdane Laaguidi",
      speakerNotes:
        "Here are the five concrete warning signs we observed on the ground, ranging from manual re-entry of Type 2/3 orders to lateral friction over AVI documents and standard times.",
      durationMinutes: 1.5,
    },
    // SLIDE 6
    {
      id: "slide-6",
      slideNumber: 6,
      act: "ACT I · THE INDUSTRIAL JOURNEY",
      layout: "columns",
      title: "The gap: information arrives, but coordinated action does not follow automatically",
      subtitle: "Customer Demand Variation → Production Planning → [COORDINATION GAP] → Execution",
      bulletPoints: [
        "INITIAL OBSERVATION: Changes reached functions at different times, and sometimes only after consequences were visible.",
        "ESTABLISHED BY INVESTIGATION: A coordination gap, not a knowledge gap — the steps are known, but no owner, timeline or shared procedure exists.",
        "Impacted Functions: Procurement · Material Flow · Capacity · Industrial Eng. · Production.",
      ],
      secondaryColumn: [
        "POTENTIAL OPERATIONAL CONSEQUENCES:",
        "• Material Shortage on critical harnesses",
        "• Production Backlog accumulation",
        "• Unplanned Capacity Pressure & overtime",
        "• Excess Stock & Warehouse saturation",
        "• Material Obsolescence exposure",
      ],
      bottomCallout:
        "A coordination gap, not a knowledge gap: the steps are known, but no owner, timeline or shared procedure exists.",
      speaker: "Wijdane Laaguidi",
      speakerNotes:
        "Our central diagnosis is that K3 faces a coordination gap rather than a knowledge gap. Practitioners know their jobs, but lack synchronized ownership, timelines, and shared procedures.",
      durationMinutes: 1.5,
    },
    // SLIDE 7
    {
      id: "slide-7",
      slideNumber: 7,
      act: "ACT I · THE INDUSTRIAL JOURNEY",
      layout: "cards",
      title: "Problem statement and research questions",
      subtitle:
        "MAIN RQ: How can Procurement, Production Planning, and Capacity Management be better coordinated to manage EDI demand variability and limit the resulting risks of material shortages, production backlog, and material obsolescence?",
      cards: [
        {
          badge: "THE PROBLEM",
          title: "Interdependent Impact & Improvisation",
          description:
            "Each EDI revision hits several interdependent activities at once. Updates do not reach all functions simultaneously; escalation and MOCA depend on individual initiative, sharpest in the move to mass production.",
        },
        {
          badge: "RQ 1 · ESCALATION LADDER",
          title: "Demand Increases (↑)",
          description: "How are demand increases handled across functions and suppliers?",
        },
        {
          badge: "RQ 2 · MOCA / OBSOLESCENCE",
          title: "Demand Decreases (↓)",
          description: "How are demand decreases and surplus materials handled to limit obsolescence?",
        },
        {
          badge: "RQ 3 · COORDINATION",
          title: "Cross-Functional Information Flow",
          description: "How does information flow and synchronize between functions?",
        },
      ],
      bulletPoints: [],
      bottomCallout:
        "Risk: shortages, backlog, excess stock and obsolescence — sharpest in the move to mass production.",
      speaker: "Salma Lsilis",
      speakerNotes:
        "This leads directly to our Main Research Question and three sub-questions: RQ1 on demand increases and the Escalation Ladder, RQ2 on demand decreases and MOCA, and RQ3 on information flow.",
      durationMinutes: 1.5,
    },
    // SLIDE 8
    {
      id: "slide-8",
      slideNumber: 8,
      act: "ACT II · INVESTIGATING THE PROBLEM",
      layout: "cards",
      title: "From observation to a structured research project",
      subtitle: "OBSERVE → IDENTIFY → INVESTIGATE → ANALYSE → DEVELOP A MODEL",
      cards: [
        {
          badge: "MAIN OBJECTIVE",
          title: "Integrated Coordination Approach",
          description:
            "Identify the operational and organizational difficulties of EDI demand changes and propose an integrated approach to cross-functional coordination.",
        },
        {
          badge: "SPECIFIC OBJECTIVES",
          title: "Mechanisms & Linkages",
          description:
            "Understand how increases and decreases affect decisions · identify coordination difficulties · connect demand information with materials, suppliers, schedules and capacity.",
        },
        {
          badge: "EXPECTED CONTRIBUTION",
          title: "Academic & Practical Value",
          description:
            "Academic: a context-specific coordination framework for pre-series to mass production. Practical: a structured model for cross-functional decisions at K&S.",
        },
      ],
      bulletPoints: [],
      bottomCallout: "Structured 5-step progression from empirical observation to model development.",
      speaker: "Salma Lsilis",
      speakerNotes:
        "In Act II, we structured our field observations into a formal research design aimed at delivering both academic insight on ramp-up coordination and a practical decision model for K&S.",
      durationMinutes: 1.5,
    },
    // SLIDE 9
    {
      id: "slide-9",
      slideNumber: 9,
      act: "ACT II · INVESTIGATING THE PROBLEM",
      layout: "cards",
      title: "Constructivism, mixed methods and an action-research logic",
      subtitle: "Rigorous methodological architecture grounded in multi-source triangulation",
      cards: [
        {
          badge: "PARADIGM",
          title: "Constructivism",
          description:
            "Meaning is built through practitioners’ interpretation: Planning and Procurement read the same EDI change differently.",
        },
        {
          badge: "DESIGN",
          title: "Constructive Research Approach",
          description:
            "Embedded single-case study: K&S, Mercedes-Benz VAN program (Plant K3).",
        },
        {
          badge: "APPROACH",
          title: "Mixed Methods",
          description:
            "Qualitative and quantitative evidence combined and integrated, not run in parallel.",
        },
        {
          badge: "LOGIC",
          title: "Action-Research Logic",
          description:
            "Diagnose, build a provisional model, refine with practitioners; agreement is not proof of improvement.",
        },
      ],
      bulletPoints: [],
      bottomCallout:
        "TRIANGULATION: Interviews + Observations + Company records (Excel, ERP/Krosy) — comparing sources to strengthen credibility.",
      speaker: "Wijdane Laaguidi",
      speakerNotes:
        "Methodologically, we combined a constructivist paradigm and constructive research design with mixed-methods triangulation across interviews, observations, and ERP/Krosy records.",
      durationMinutes: 1.5,
    },
    // SLIDE 10
    {
      id: "slide-10",
      slideNumber: 10,
      act: "ACT II · INVESTIGATING THE PROBLEM",
      layout: "columns",
      title: "Two evidence streams: ten voices and the company’s own records",
      subtitle: "Combining practitioner perspectives with hard operational data",
      bulletPoints: [
        "QUALITATIVE STREAM (10 Practitioners):",
        "• Purposive sample; experience ranging from ~1.5 to 14 years",
        "• Interview guide specifically adapted to each function",
        "• Field notes from daily replanning & procurement escalation meetings",
      ],
      secondaryColumn: [
        "QUANTITATIVE STREAM (Company Records):",
        "• EDI call-off overviews: demand variability (Release CW28 vs CW29)",
        "• Excel weekly plans & requirement lists: customer requirement (LAB) vs confirmed plan (VSAT)",
        "• ERP/Krosy reports: cross-check of backlog and material coverage",
      ],
      bottomCallout:
        "Qualitative + quantitative evidence → TRIANGULATION → a fuller understanding of the coordination problem.",
      speaker: "Wijdane Laaguidi",
      speakerNotes:
        "Our data collection rests on two pillars: ten semi-structured interviews across functions and quantitative comparison of CW28 vs CW29 EDI releases, LAB vs VSAT plans, and Krosy ERP reports.",
      durationMinutes: 1.5,
    },
    // SLIDE 11
    {
      id: "slide-11",
      slideNumber: 11,
      act: "ACT III · THE REVELATION",
      layout: "cards",
      title: "What the professionals revealed: five recurring themes",
      subtitle: "Cross-departmental qualitative synthesis",
      cards: [
        {
          badge: "THEME 1",
          title: "Improvised Escalation",
          description:
            "All four departments confirm the ladder exists, yet no owner or fixed timeline.",
        },
        {
          badge: "THEME 2",
          title: "Uneven Information",
          description:
            "Type 2/3 changes re-entered by hand; emails and spreadsheets; Material Flow learns indirectly.",
        },
        {
          badge: "THEME 3",
          title: "Supplier Rigidity",
          description:
            "Frozen weeks: 0% increase in weeks 0–2, then 20%; one single-source freeze ≈ 70% of shortage impact.",
        },
        {
          badge: "THEME 4 & 5",
          title: "Capacity Limits & Lateral Friction",
          description:
            "Up to +20% absorbed; above it: extra operators, workstations, overtime, weekends. Quality ↔ IE (AVI) and Planning ↔ IE (standard times) resolved informally.",
        },
      ],
      bulletPoints: [],
      bottomCallout:
        "IN THEIR WORDS: “improvised each time” (Procurement) · “logical, but improvised” (Material Flow) · “lack of information” (Material Flow)",
      speaker: "Salma Lsilis",
      speakerNotes:
        "Act III reveals our findings. First, the interviews converged on five themes. Notice the practitioners' exact words: 'improvised each time' and 'logical, but improvised.'",
      durationMinutes: 1.5,
    },
    // SLIDE 12
    {
      id: "slide-12",
      slideNumber: 12,
      act: "ACT III · THE REVELATION",
      layout: "metrics",
      title: "Measuring the problem: demand moves almost every week",
      subtitle: "Quantitative analysis of EDI releases CW28 vs CW29 and LAB vs VSAT fulfillment",
      metrics: [
        {
          value: "54 / 59",
          label: "Weeks Changed (91.5%)",
          sublabel: "Between consecutive releases CW28 and CW29",
        },
        {
          value: "44.1%",
          label: "Average Weekly Variation",
          sublabel: "Exceeding the 20% internal flexibility window",
        },
        {
          value: "−505",
          label: "Largest Single-Week Drop",
          sublabel: "Units in CW34; call-offs fell to 0 in CW30–CW35",
        },
        {
          value: "85,913",
          label: "Units Unfulfilled in CW40",
          sublabel: "110,671 required vs 24,758 confirmed (22.4%)",
        },
      ],
      bulletPoints: [],
      bottomCallout:
        "Note: CW35 (9,723.3%) is a calculation artifact (86 LAB vs 8,362 VSAT units) and is excluded.",
      speaker: "Salma Lsilis",
      speakerNotes:
        "The quantitative data confirmed chronic instability: 54 out of 59 weeks changed between two consecutive weeks—91.5%—with an average swing of 44.1%, more than double the plant's 20% flexibility window.",
      durationMinutes: 1.5,
    },
    // SLIDE 13
    {
      id: "slide-13",
      slideNumber: 13,
      act: "ACT III · THE REVELATION",
      layout: "table",
      title: "What the combined evidence confirmed",
      subtitle: "Triangulation matrix cross-checking observations, interviews, and quantitative metrics",
      table: {
        headers: [
          "OBSERVATION",
          "INTERVIEW EVIDENCE",
          "QUANTITATIVE EVIDENCE",
          "INTERPRETATION",
        ],
        rows: [
          [
            "Demand keeps changing",
            "Sudden changes are complex and non-standardized (Planning)",
            "54 of 59 weeks changed; average variation 44.1% vs 20% window",
            "Instability is chronic, not occasional",
          ],
          [
            "Escalation is improvised",
            "All four departments: no formal owner or timeline",
            "Sister plant ~24 h, Planning ~1 day, IE 1–2 days, freight up to 2 weeks vs 14-day lead time",
            "A coordination gap, not a knowledge gap",
          ],
          [
            "Decreases create surplus",
            "MOCA first, then scrap via CMT; one case split 75% / 25%",
            "Call-offs fell to 0 in CW30–CW35 (−505 in CW34)",
            "Obsolescence exposure when decreases follow commitments",
          ],
          [
            "Plan differs from requirement",
            "Planning negotiates weekend work and rebalancing",
            "CW38 22.7%, CW39 0.0%, CW40 22.4% (85,913 units short)",
            "Capacity pressure; the gap is not only planning inaccuracy",
          ],
        ],
      },
      bulletPoints: [],
      bottomCallout:
        "UNEXPECTED RESULTS: Type 2/3 orders delay information · Written guidelines, yet universal improvisation · Difficulty depends on role · Pre-series cover is temporary · Friction beyond Planning–Procurement.",
      speaker: "Wijdane Laaguidi",
      speakerNotes:
        "When we triangulate qualitative and quantitative streams, every observation is corroborated. Notice also our five unexpected findings, including that written guidelines exist yet improvisation remains universal.",
      durationMinutes: 2,
    },
    // SLIDE 14
    {
      id: "slide-14",
      slideNumber: 14,
      act: "ACT III · THE REVELATION",
      layout: "columns",
      title: "Why the gap matters: increases and decreases hurt differently",
      subtitle: "Asymmetric operational risks requiring distinct coordination protocols",
      bulletPoints: [
        "DEMAND INCREASES (↑) — Shortage & Backlog Risk:",
        "• Escalation ladder: sister plant (~24 h) → Planning (~1 day) → IE (1–2 days) → special freight (up to 2 weeks)",
        "• Suppliers: 0% increase in weeks 0–2, then +20%",
        "• Above +20%: extra operators, workstations, overtime, weekends",
        "• Pre-series cover from Macedonia and K2 is being phased out",
      ],
      secondaryColumn: [
        "DEMAND DECREASES (↓) — Excess Stock & Obsolescence Risk:",
        "• MOCA first: redistribute surplus to sister plants",
        "• Otherwise scrap, allocated via CMT: customer-driven vs internal over-ordering (one case: 75% / 25%)",
        "• Suppliers allow 0% reduction in the earliest weeks",
        "• MOCA is triggered only after the excess stock has arrived",
      ],
      bottomCallout:
        "The response is cross-functional: Planning · Procurement · Industrial Engineering · Material Flow · Quality.",
      speaker: "Wijdane Laaguidi",
      speakerNotes:
        "Increases and decreases create asymmetric pain: increases test the 14-day lead time and capacity limits, while decreases trigger MOCA only after excess stock has already arrived at the warehouse.",
      durationMinutes: 1.5,
    },
    // SLIDE 15
    {
      id: "slide-15",
      slideNumber: 15,
      act: "ACT IV · THEORY MEETS REALITY",
      layout: "cards",
      title: "Three lenses on the same problem",
      subtitle: "Theoretical framework anchoring the empirical diagnosis",
      cards: [
        {
          badge: "01 · CONTINGENCY THEORY",
          title: "Lawrence & Lorsch (1967)",
          description:
            "No single best structure: coordination must fit the environment and its uncertainty. So: different responses to increases and decreases.",
        },
        {
          badge: "02 · DYNAMIC CAPABILITIES",
          title: "Teece, Pisano & Shuen (1997)",
          description:
            "Sensing → Seizing → Transforming: detect change, act on it, renew routines. So: detect, decide and adapt, not just react.",
        },
        {
          badge: "03 · SUPPLY CHAIN INTEGRATION",
          title: "Masudin & Kamara (2017); Tao et al. (2025)",
          description:
            "EDI is an enabler; value depends on turning information into coordinated action. So: align information, responsibilities and decisions.",
        },
      ],
      bulletPoints: [],
      bottomCallout:
        "Context: ramp-up and pre-series logistics require coordinated capacity, materials and information flows before series production (Filla & Klingebiel 2014; Wlazlak et al. 2018; Wochner et al. 2016).",
      speaker: "Salma Lsilis",
      speakerNotes:
        "In Act IV, we mobilize three complementary theoretical lenses: Contingency Theory, Dynamic Capabilities (sensing, seizing, transforming), and Supply Chain Integration.",
      durationMinutes: 1.5,
    },
    // SLIDE 16
    {
      id: "slide-16",
      slideNumber: 16,
      act: "ACT IV · THEORY MEETS REALITY",
      layout: "table",
      title: "From theory to the K&S case",
      subtitle: "Mapping theoretical constructs directly onto Plant K3 mechanisms",
      table: {
        headers: ["THEORETICAL CONCEPT", "WHAT IT EXPLAINS", "APPLICATION TO K&S"],
        rows: [
          [
            "Contingency Theory",
            "Fit the coordination response to the conditions and uncertainty",
            "Separate responses for increases and decreases; the 20% capacity threshold; role-dependent difficulty",
          ],
          [
            "Dynamic Capabilities (sensing · seizing · transforming)",
            "How an organization detects change, acts and renews its routines",
            "Sense: Type 2/3 changes arrive late. Seize: escalation executed informally. Transform: give the ladder and MOCA owners and timelines",
          ],
          [
            "Supply Chain Integration",
            "EDI enables information exchange; integration needs aligned decisions",
            "Common planning reference for Planning, Procurement, IE, Material Flow and Quality, not only Planning–Procurement",
          ],
        ],
      },
      bulletPoints: [],
      bottomCallout: "Theory interprets the real problem; it does not replace the evidence.",
      speaker: "Salma Lsilis",
      speakerNotes:
        "This mapping shows how theory illuminates K&S reality: for instance, Dynamic Capabilities explains why sensing fails on manual Type 2/3 orders and why seizing fails without time-boxed escalation owners.",
      durationMinutes: 1.5,
    },
    // SLIDE 17
    {
      id: "slide-17",
      slideNumber: 17,
      act: "ACT V · THE ISCC MODEL",
      layout: "cards",
      title: "Why we built the ISCC Model",
      subtitle: "Synthesizing the empirical gap, field findings, and theoretical foundations",
      cards: [
        {
          badge: "INPUT 1 · IDENTIFIED GAP",
          title: "Uncoordinated Response",
          description:
            "Information is received via EDI, but no coordinated cross-functional response follows automatically.",
        },
        {
          badge: "INPUT 2 · EMPIRICAL FINDINGS",
          title: "Field Realities at K3",
          description:
            "Improvised execution · Type 2/3 delay · lateral friction · two directions of risk (shortage vs obsolescence).",
        },
        {
          badge: "INPUT 3 · THEORETICAL FOUNDATIONS",
          title: "Academic Anchors",
          description:
            "Contingency Theory · Dynamic Capabilities · Supply Chain Integration.",
        },
        {
          badge: "OUTPUT · ISCC MODEL",
          title: "Weaknesses Addressed",
          description:
            "1. No ownership of each step · 2. No defined response times · 3. Delayed, manual information · 4. No shared record of decisions.",
        },
      ],
      bulletPoints: [],
      bottomCallout:
        "ISCC = Integrated Supply-Chain Coordination — designed specifically to close the four structural weaknesses.",
      speaker: "Wijdane Laaguidi",
      speakerNotes:
        "Act V introduces our core contribution: the ISCC Model—Integrated Supply-Chain Coordination—built to eliminate the four specific weaknesses identified during our investigation.",
      durationMinutes: 1.5,
    },
    // SLIDE 18
    {
      id: "slide-18",
      slideNumber: 18,
      act: "ACT V · THE ISCC MODEL",
      layout: "columns",
      title: "The ISCC Model: from EDI information to coordinated decisions",
      subtitle: "Five structured stages connected directly to K&S operational practice",
      bulletPoints: [
        "Stage 1 – EDI Demand Variability: Changes in customer demand and component requirements.",
        "Stage 2 – Information & Coordination Requirements: Interpretation, communication, assessment and sharing.",
        "Stage 3 – Cross-functional Operational Planning: Procurement · Production planning · Capacity management.",
        "Stage 4A – Demand Increase (↑): Material shortage, capacity pressure, backlog risk.",
        "Stage 4B – Demand Decrease (↓): Excess raw materials, inventory exposure, obsolescence risk.",
        "Stage 5 – Integrated Supply-Chain Coordination: Coordinated decisions across functions.",
      ],
      secondaryColumn: [
        "LINKS TO K&S PRACTICE:",
        "• Stage 2: Automatic notification of Type 2/3 changes",
        "• Stage 4A: Formalize the Escalation Ladder (owners & strict time limits)",
        "• Stage 4B: Trigger MOCA and CMT review earlier at call-off drop",
        "• Stage 5: Maintain a shared decision record across departments",
      ],
      bottomCallout: "Builds on existing mechanisms; not yet implemented or validated.",
      speaker: "Wijdane Laaguidi",
      speakerNotes:
        "Here is the architecture of the ISCC model across five stages, bifurcating at Stage 4 into 4A (Demand Increase via time-boxed Escalation Ladder) and 4B (Demand Decrease via early MOCA trigger).",
      durationMinutes: 2,
    },
    // SLIDE 19
    {
      id: "slide-19",
      slideNumber: 19,
      act: "ACT V · THE ISCC MODEL",
      layout: "table",
      title: "How the ISCC Model can prepare the move to mass production",
      subtitle: "Connecting identified challenges to concrete ISCC interventions",
      table: {
        headers: [
          "IDENTIFIED CHALLENGE",
          "PROPOSED ISCC APPROACH",
          "EXPECTED BENEFIT (NOT YET MEASURED)",
        ],
        rows: [
          [
            "Late, manual Type 2/3 information",
            "Automatic notifications and shared updates",
            "Earlier, simultaneous visibility",
          ],
          [
            "Improvised escalation",
            "Owners and time-boxed steps",
            "Predictable response within the 14-day lead time",
          ],
          [
            "Decreases handled after stock arrives",
            "MOCA review triggered at the call-off drop",
            "Lower obsolescence exposure",
          ],
          [
            "External cover phased out, no contingency plan",
            "Capacity implications assessed before decisions",
            "Readiness for series volumes",
          ],
          [
            "Lateral friction (Quality–IE, Planning–IE)",
            "Shared procedure for disagreements",
            "Fewer informal negotiations",
          ],
        ],
      },
      bulletPoints: [],
      bottomCallout:
        "Preparing Plant K3 for full series volumes as external backup from Macedonia and K2 phases out.",
      speaker: "Salma Lsilis",
      speakerNotes:
        "This table shows how each ISCC mechanism prepares Plant K3 for mass production—while remaining transparent that these benefits are expected and not yet measured post-implementation.",
      durationMinutes: 1.5,
    },
    // SLIDE 20
    {
      id: "slide-20",
      slideNumber: 20,
      act: "ACT VI · FROM FINDINGS TO ACTION",
      layout: "table",
      title: "Recommendations and implementation priorities",
      subtitle: "Five prioritized, high-feasibility actions for K&S Kenitra (Plant K3)",
      table: {
        headers: [
          "#",
          "RECOMMENDATION",
          "PROBLEM ADDRESSED",
          "FUNCTIONS",
          "EXPECTED BENEFIT",
        ],
        rows: [
          [
            "1",
            "Assign an owner and time limit to each escalation step; keep a common decision record",
            "Improvised escalation",
            "Planning, Procurement, IE, Material Flow",
            "Predictable response inside the 14-day lead time",
          ],
          [
            "2",
            "Extend automatic notifications to Type 2/3 order changes",
            "Late, manual information",
            "Planning, Procurement, Material Flow",
            "Earlier, simultaneous visibility",
          ],
          [
            "3",
            "Trigger the MOCA review at the call-off drop; keep Planning and IE involved in decreases",
            "Late obsolescence response",
            "Procurement, Planning, IE",
            "Less excess stock and scrap",
          ],
          [
            "4",
            "Agree a shared procedure for cross-functional disagreements (AVI release, standard times)",
            "Lateral friction",
            "Quality, IE, Planning",
            "Fewer informal negotiations",
          ],
          [
            "5",
            "Document contingency capacity for the end of Macedonia/K2 cover",
            "Transition vulnerability",
            "IE, Planning, Production",
            "Readiness for series volumes",
          ],
        ],
      },
      bulletPoints: [],
      bottomCallout:
        "Priority = relevance to the findings and feasibility: formalize existing mechanisms first.",
      speaker: "Wijdane Laaguidi",
      speakerNotes:
        "In Act VI, we translate our model into five prioritized recommendations, starting with formalizing existing mechanisms—assigning owners and time limits to the Escalation Ladder and triggering MOCA at the call-off drop.",
      durationMinutes: 1.5,
    },
    // SLIDE 21
    {
      id: "slide-21",
      slideNumber: 21,
      act: "ACT VI · FROM FINDINGS TO ACTION",
      layout: "closing",
      title: "Limitations, Conclusion & Thank You",
      subtitle: "Thank you for your attention — Questions and discussion",
      bulletPoints: [
        "LIMITATIONS:",
        "• Single case: One plant (K3), one OEM program (Mercedes-Benz VAN)",
        "• Interview depth: Several IE answers recorded as “same as first”",
        "• Uneven coverage: Not every role answered every question",
        "• Short window: ~2 weeks to mass production; model not observed after implementation",
      ],
      secondaryColumn: [
        "CONCLUSION:",
        "1. Problem: EDI changes reach functions unevenly — a coordination gap",
        "2. Evidence: Changes in 54 of 59 weeks; improvised escalation; lateral friction",
        "3. Contribution: The ISCC Model, grounded in evidence and theory",
        "4. Why now: Coordination must be structured before mass production",
      ],
      bottomCallout:
        "Thank you for your attention · Questions & Discussion · Ibn Tofail University & Kromberg & Schubert · Wijdane Laaguidi · Salma Lsilis · 2026",
      speaker: "Wijdane & Salma",
      speakerNotes:
        "To conclude, we acknowledge our study's boundaries—a single case during a two-week pre-series window—while delivering an evidence-based ISCC Model ready for K3's mass production transition. Thank you for your attention, and we welcome your questions.",
      durationMinutes: 1.5,
    },
  ],
};
