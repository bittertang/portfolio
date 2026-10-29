// Fill in your real case studies — every value here is a placeholder.
// Keep the same field shape (add/remove items from arrays freely) and both
// the homepage and case study template will pick up your content automatically.

import earthquakePrepKitHero from "../assets/earthquake-prep-kit/earthquake-prep-kit-hero.webp";
import techMuseum from "../assets/earthquake-prep-kit/The_Tech_Museum.jpg";
import techInteractiveLogo from "../assets/earthquake-exhibit/tech-interactive-logo.webp";
import onTheFloorObservation from "../assets/earthquake-prep-kit/on_the_floor_observation.jpg";
import affinityDiagramAfter from "../assets/earthquake-prep-kit/affinitydiagram_after.webp";
import userFlow from "../assets/earthquake-prep-kit/userflow.webp";
import storyboard from "../assets/earthquake-prep-kit/storyboard.webp";
import tokensFront from "../assets/earthquake-prep-kit/tokens_front.webp";
import tokensBack from "../assets/earthquake-prep-kit/tokens_back.webp";
import testingSetup1 from "../assets/earthquake-prep-kit/testing_setup_1.webp";
import technicalIssue from "../assets/earthquake-prep-kit/technical-issue.webp";
import v2Testing from "../assets/earthquake-prep-kit/v2-testing.webp";
import instructions from "../assets/earthquake-prep-kit/instructions.webp";
import round2Takeaway1 from "../assets/earthquake-prep-kit/round2-takeaway1.webp";
import round2Takeaway2 from "../assets/earthquake-prep-kit/round2-takeaway2.webp";
import demoDay from "../assets/earthquake-prep-kit/demo-day.webp";
import instructionGifs from "../assets/earthquake-prep-kit/instruction-gifs.mp4";
import finalGame1 from "../assets/earthquake-prep-kit/final-game-1.mp4";
import finalGame2 from "../assets/earthquake-prep-kit/final-game-2.mp4";
import finalGame3 from "../assets/earthquake-prep-kit/final-game-3.mp4";
import mentorshipHero from "../assets/mentorship-platform/mentorship-hero.mp4";
import mentorshipResearch from "../assets/mentorship-platform/v2/research.webp";
import mentorshipAffinityBefore from "../assets/mentorship-platform/v2/affinity-diagram-before.webp";
import mentorshipAffinityAfter from "../assets/mentorship-platform/v2/affinity-diagram-after.webp";
import currentProcess from "../assets/mentorship-platform/v2/current-process.webp";
import solutionOnboarding from "../assets/mentorship-platform/v2/solution-onboarding.webp";
import solutionMatching from "../assets/mentorship-platform/v2/solution-matching.webp";
import solutionMentorDirectory from "../assets/mentorship-platform/v2/solution-mentor-directory.webp";
import mentorProfile from "../assets/mentorship-platform/v2/mentor-profile.webp";
import entryPoints from "../assets/mentorship-platform/v2/entry-points.webp";
import quickStats from "../assets/mentorship-platform/v2/quick-stats.webp";
import updatedFlow from "../assets/mentorship-platform/v2/updated-flow.webp";
import roundsOverview from "../assets/mentorship-platform/v2/rounds-overview.webp";
import matchResults from "../assets/mentorship-platform/v2/match-results.webp";
import runningMatches1 from "../assets/mentorship-platform/v2/running-matches-1.webp";
import runningMatches2 from "../assets/mentorship-platform/v2/running-matches-2.webp";
import editMatch from "../assets/mentorship-platform/v2/edit-match.webp";
import ideationSketches from "../assets/mentorship-platform/v2/ideation-sketches.webp";
import cuttingDown from "../assets/mentorship-platform/v2/cutting-down.webp";
import panelExplorations from "../assets/geology-map/panel-explorations.webp";
import geologyMapHero from "../assets/geology-map/hero.mp4";
import finalProjection from "../assets/geology-map/final_projection.mp4";
import finalTouchscreen from "../assets/geology-map/final_touchscreen.mp4";
import round1TwoStep from "../assets/geology-map/round1_2step.mp4";
import round1Tabs from "../assets/geology-map/round1_tabs.mp4";
import round1Accordion from "../assets/geology-map/round1_accordion.mp4";
import round1Setup from "../assets/geology-map/round1-setup.webp";
import round2Testing from "../assets/geology-map/round2-testing.webp";
import projectionIdleState from "../assets/geology-map/projection_idlestate.mp4";
import projectionMapInfo from "../assets/geology-map/projection_mapinfo.mp4";
import userflow from "../assets/geology-map/userflow.webp";
import iteration2After from "../assets/geology-map/iteration2_after.mp4";
import iteration2Before from "../assets/geology-map/iteration2_before.mp4";
import zoomHero from "../assets/zoom-hybrid-instruction/zoom-hero.mp4";

function placeholderProject(n) {
  return {
    slug: `project-${n}`,
    title: `[Project ${n} Title]`,
    tagline: "[One-line description of the project and what it solved]",
    tags: ["[Tag 1]", "[Tag 2]", "[Tag 3]"],
    type: "[Internship — Company Name]",
    year: "[Year]",
    meta: {
      role: "[Your role]",
      tools: "[Tools you used]",
      timeline: "[Timeline, e.g. 10-week internship]",
      team: "[Team — e.g. mentor + 2 engineers]",
      status: "[Status — e.g. Shipped]",
    },
    cover: "[A sentence or two introducing the project and why it mattered.]",
    sectionTitles: {
      problem: "[Problem section title]",
      research: "[Research section title]",
      prototyping: "[Prototyping section title]",
      failedConcepts: "[Failed concepts section title]",
      iterations: "[Iterations section title]",
      designSystem: "[Design system section title]",
      finalFlow: "[Final flow section title]",
      outcome: "[Outcome section title]",
      reflection: "[Reflection section title]",
    },
    problem: {
      significance: "[Why did this problem matter? What was at stake?]",
      audience: {
        groups: [
          { label: "Primary", description: "[Primary user group]" },
          { label: "Secondary", description: "[Secondary user group]" },
        ],
      },
      approach: "[Why did you choose this approach or format to solve it?]",
      challenge: "[The core question you framed the work around, e.g. \"How might we...\"]",
    },
    research: {
      intro: "[How did you research the problem? Who did you talk to, what did you look at?]",
      findings: [
        "[Finding 1 — something specific you learned]",
        "[Finding 2 — something specific you learned]",
        "[Finding 3 — something specific you learned]",
      ],
      designRequirements: {
        // Optional "title" field here overrides the default "Design Requirements" heading.
        intro: "[Optional — design requirements you extracted from the research, shown as cards]",
        items: [
          { label: "[Requirement 1]", description: "[What it means]" },
          { label: "[Requirement 2]", description: "[What it means]" },
          { label: "[Requirement 3]", description: "[What it means]" },
          { label: "[Requirement 4]", description: "[What it means]" },
        ],
      },
      mappingTheFlow: "[Optional — how you mapped out the flow/journey, shown as its own subsection]",
    },
    prototyping: "[How did you build and validate an early prototype?]",
    prototypingProcess: "[Optional — a process detail, shown in a second tab]",
    failedConcepts: {
      intro: "[What approaches did you try that didn't work?]",
      visitorStats: [
        { value: "[00]", label: "[what this measures]" },
        { value: "[00]", label: "[what this measures]" },
        { value: "[00]", label: "[what this measures]" },
      ],
      concepts: [
        {
          label: "[Concept A]",
          description: "[What it was and why it didn't work]",
        },
        {
          label: "[Concept B]",
          description: "[What it was and why it didn't work]",
        },
      ],
      takeaways: [
        "[Takeaway 1 — something you observed from testing]",
        "[Takeaway 2 — something you observed from testing]",
        "[Takeaway 3 — something you observed from testing]",
      ],
    },
    iterations: {
      intro: "[How did the design change across rounds? What were you testing for?]",
      rounds: [
        "[Round 1 — what changed]",
        "[Round 2 — what changed]",
        "[Round 3 — what changed]",
        "[Round 4 — what changed]",
      ],
      round2Testing: {
        intro: "[Optional — describe a later round of testing, shown as its own subsection]",
        studyDetails: "[Optional — additional study details, tucked behind a toggle]",
        visitorStats: [
          { value: "[00]", label: "[what this measures]" },
          { value: "[00]", label: "[what this measures]" },
          { value: "[00]", label: "[what this measures]" },
        ],
        takeaways: [
          { theme: "[Theme A]", text: "[Takeaway 1 — something you observed]" },
          { theme: "[Theme B]", text: "[Takeaway 2 — something you observed]" },
        ],
      },
    },
    designSystem: "[Describe the design system/visual language you built for this project.]",
    copywriting: "[Optional — describe copywriting/voice guidelines, shown below the design system images]",
    finalFlow: "[Describe the final design/flow you shipped.]",
    outcome: "[What happened after it shipped? Be specific and honest about what you actually know vs. don't.]",
  };
}

const earthquakeDiyPrepKitGame = {
  slug: "project-2",
  title: "DIY Prep Kit Game",
  challengeOrange: true,
  tagline: "Educating Bay Areans about earthquake preparation through an interactive tabletop game",
  tags: [],
  type: "",
  year: "",
  hideDesignSystem: true,
  hideFromHome: true,
  hideIterations: true,
  hideFinalFlowScreenshot: true,
  outcomeUnderReflection: true,
  meta: {
    role: "UX Designer",
    timeline: "June - Aug 2026 (8 weeks)",
    team: "Ivy T. (Digital Design), Isabel M. (Hardware Design)",
    status: "In progress",
  },
  cover:
    "My co-designer, Isabel, and I were tasked with designing a tabletop interactive game for the Earthquake Preparation section of the exhibit.",
  heroImage: earthquakePrepKitHero,
  sectionTitles: {
    problem: "Bay Areans are unprepared for earthquakes",
    research: "Observing visitors on the floor",
    prototyping: "Building the physical part of the experience with Claude Code",
    failedConcepts: "Initial testing allowed us to gauge user attitudes toward the game.",
    iterations: "[Iterations section title]",
    designSystem: "[Design system section title]",
    finalFlow: "The final game",
    outcome: "Showcasing our work at Demo Day!",
    reflection: "What I learned",
  },
  problem: {
    significance:
      "Sitting on top of a web of faults, the Bay Area is especially prone to earthquakes, making earthquake preparedness a necessity for residents. Americans in general, however, are ill-prepared for natural disasters; only **5% of U.S. households** reported having a fully stocked emergency supply kit ([safehome.org](https://safehome.org)).",
    audience: {
      groups: [
        { label: "Primary", description: "Kids in elementary to middle school." },
        {
          label: "Secondary",
          description: "Adults that are educators or parents that may acts as guides for children.",
        },
      ],
    },
    approach:
      "Several studies have found games to be an effective tool in student learning, as well as promoting behaviors in disaster risk reduction, informing the format of the game as a tabletop interactive ([Moradian & Nazdik, 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6555209/), [Li et al., 2024](https://doi.org/10.1371/journal.pone.0294350)).",
    challenge:
      "How might we design an interactive game to empower a broad, multigenerational audience in earthquake preparedness?",
  },
  research: {
    heroImage: onTheFloorObservation,
    heroImageCompact: true,
    intro:
      "Before jumping into our project, Isabel and I went on the floor of the museum to observe visitor behaviors and identified factors that contributed to good physical and digital user experience in an interactive exhibit.",
    findings: [
      "Instructions are often ignored. Visitors don't tend to read instructions first; they prefer to observe and interact.",
      "Feedback fuels engagement. Experiences with high engagement often offered instantaneous and multiple forms of feedback (e.g. audio, visual, etc).",
      "Accessible design is a standard in the museum. Elements of accessible design were weaved throughout each exhibit, whether it was through language options or accommodations for mobility device users.",
    ],
    designRequirements: {
      intro:
        "To synthesize my findings from the discovery research, observational study, and literature review, I created an affinity diagram on FigJam and extracted the following design requirements for each stage of the game experience:",
      items: [
        {
          label: "Discover",
          description: "Instructions are intuitive enough for visitors to understand how to navigate the game.",
        },
        {
          label: "Guide",
          description: "Ensure meaningful and accessible learning and understanding throughout the game.",
        },
        {
          label: "Engage",
          description:
            "Visitors remain engaged and appropriately challenged across varying knowledge baselines.",
        },
        {
          label: "Apply",
          description: "Lower the barrier for visitors to apply learnings and take actions after the exhibit.",
        },
      ],
    },
    mappingTheFlow:
      "To better visualize how the physical and digital components of the game connected, I mapped out the user flow and depicted the user journey through a storyboard.",
  },
  prototyping:
    "Now that I had an idea of the flow of the game, the next step was creating a rough mockup.\n\nStarting with the digital side, I vibecoded a quick prototype with Claude Code. For the physical parts, I then created tokens that were sandwiched with RFID stickers.",
  prototypingProcess:
    "The front of the token depicts an image of the item, while the back has its name in English, Spanish, and Vietnamese.",
  prototypingOutro:
    "Since I didn't have too much experience working with hardware, namely the ELO touchscreen interface and RFIDs, Claude was a great guide in helping me navigate this unfamiliar territory. It instructed me on how to integrate the RFID tokens into the digital prototype and how to troubleshoot issues like screen sensitivity, filling in the gaps of my knowledge.\n\nBy the end of the day, I was able to pull together a working prototype that wasn't just ready for user testing, but also something very close to the intended final product.",
  prototypingLimitationLabel: "Testing limitation",
  prototypingLimitation:
    "**Resources dictated the user experience I could test.**\n\nFor the purposes of testing, I only had access to a cheaper RFID system with a self-checkout-style UX, where users scanned a token to add it to their backpack and scanned again to remove.\n\nThe UX that I had envisioned and that will be implemented in the final game, worked more like [Uniqlo's self-checkout](https://www.youtube.com/watch?v=GqPfYnVKwGI), where users simply place items in a compartment that automatically detects them and updates accordingly on the screen.",
  failedConcepts: {
    intro:
      "I set up the prototype on the museum floor, where visitors in passing would stop by to casually test it out. There were a total of 21 visitors (ages 5-10): 4 groups (kids accompanied by chaperones, or groups of 2-3 kids) and 6 solo kids.",
    visitorStats: [
      { value: "21", label: "visitors total" },
      { value: "5–12", label: "age range" },
      { value: "4 / 6", label: "groups / solo kids" },
    ],
    concepts: [
      {
        label: "Technical issues interfered with testing gameplay.",
        image: technicalIssue,
        description:
          "RFID tags were highly sensitive, causing tokens to scan accidentally, read inconsistently, or fail to read at all. This confused participants and disrupted the flow of testing, making it difficult to observe the actual gameplay.",
      },
      {
        label: "Younger participants relied on images over words.",
        image: instructions,
        description:
          "During testing, I quickly realized that the younger kids couldn't comprehend the written instructions because of their current reading levels. The images on the tokens were their crutch for understanding the game. If they weren't accompanied by an adult, I ended up having to step in to explain the instructions.",
      },
    ],
    takeaways: [
      "The setup naturally peaked visitors' interests. Kids were curious and voluntarily came by without needing to be prompted, which was a good sign that the setup alone looked interesting enough for visitors to approach on their own.",
      "Visitors expressed overall enjoyment and enthusiasm in playing the game. Visitors' enthusiasm around the game validated the need to continue fleshing out the rest of the game. All **21** **participants** wanted keep playing; **11** **users** wanted to move on to the next level and **10** wanted to replay the round.",
    ],
  },
  iterations: {
    intro: "Insights from this first round of user testing drove the following iterations for the game.",
    rounds: [
      "Second Level. I added a second level to the game where users packed for Lisa, a mother of a newborn baby. This aligned with our initial studies that found player interest in thinking about other people's needs, as well as our goal of making the game educational and an opportunity to practice empathy.",
      "Clarifying end game screen. When users reached the personality reveal screen, they appeared confused on what it meant. So to provide more clarity on how they got the personality type, I laid out the categories in percentages, resembling the reveal pages from other personality quizzes such as 16 personalities.",
      "Rethinking post-game application. Seeing how no players seemed to be interested in saving their kits post-game, I decided to remove the feature altogether. My team had also been considering adding a component in this section of the exhibit where users get to pack their own physical kits, so we figured this wasn't necessary for the game.",
    ],
    round2Testing: {
      intro:
        "For the second round of usability testing, my co-designer and I got to merge our respective 3D printed tokens and vibecoded design into a refined prototype.\n\nSince the game was more fleshed out this time around, testing revealed more insights into the in-game experience.",
      studyDetails:
        "Given the technical difficulties of the previous user testing, we ended up getting 2 tables to put more space in between the tokens with the RFID tags and the RFID reader. While technical issues persisted, they weren't as frequent.",
      takeaways: [
        {
          theme: "Accommodating for reading levels",
          insightLabel: "User Insight",
          video: instructionGifs,
          text: "Younger visitors depended on visuals or accompanying adults to understand game instruction. I added gifs along with written instructions so that kids at different reading levels could better understand instructions for the game. In addition to younger users, the addition of images could benefit those whose second language is English and need additional context for comprehension.",
        },
        {
          theme: "Feedback Friction",
          insightLabel: "User Insight",
          image: round2Takeaway1,
          text: "**~70%** of users were unaware they reached load capacity. People didn't seem to be aware when they reached load capacity and would continue to add in items only to later realize they weren't able to continue on with the game. Since the experience requires the user's attention more on the physical parts, the placement of the load meter on the right side of the touchscreen may have not been obvious enough to catch the user's attention.",
        },
        {
          theme: "Restricted User Options",
          insightLabel: "User Insight",
          image: round2Takeaway2,
          text: "**~80%** of users received the same personality type result. Visitors naturally tended to pack essentials, leading them to \"The Ready One\" personality type. In the iteration, we decided to expand the load capacity a bit so that users had more room to consider items besides essentials.",
        },
      ],
    },
  },
  finalFlowFeatures: [
    {
      label: "The Game",
      video: finalGame1,
      description:
        "Pack your earthquake prep kit with tradeoffs in mind and get a personality type reveal.",
    },
    {
      label: "Wall of Kits",
      video: finalGame2,
      description:
        "Share your own kit and look at how other visitors in the community are packing.",
    },
    {
      label: "Level 2 - Pack for a new mother",
      video: finalGame3,
      description:
        "Players are given the opportunity to practice empathy and think about how their needs might compare to another individual's.",
    },
  ],
  designSystem:
    "Colors, corner radii, and components were intentionally chosen and designed to fit the playful ambience of the exhibit experience.",
  copywriting:
    "Ensuring accessibility extends past design; it includes language too. I created copywriting guidelines to keep the voice of the experience consistent, approachable, and accessible, emphasizing the use of plain language and active voice.",
  outcome:
    "Special thank you to Isabel, my design partner, Katie, my manager who provided support and guidance throughout the process, and my fellow intern cohort for being a wonderful sounding board!",
  reflectionCards: [
    {
      label: "The physical dictates the digital.",
      description:
        "Looking back, I would have dedicated more time to understanding RFIDs a lot earlier, so that one, I could've accounted for technical issues beforehand, and two, so that I could take into consideration the potential differences in the physical interaction when designing the digital UX.",
    },
    {
      label: "Pushing the envelope with AI.",
      description:
        "AI really helped pushed the boundaries of what I could accomplish without being bogged down by my limited knowledge in backend and physical hardware. Having mostly designed in the digital space, Claude was an incredibly useful tool in filling in the gaps in incorporating physical design.",
    },
  ],
  // Images/videos from the original case study, not yet added — swap each
  // placeholder for the real asset once you have it.
  media: {
    mappingTheFlow: [
      { type: "image", label: "User flow diagram", src: userFlow },
      { type: "image", label: "Storyboard", src: storyboard },
    ],
    designRequirements: [
      { type: "image", label: "Affinity diagram (after)", src: affinityDiagramAfter },
    ],
    prototyping: [
      { type: "image", label: "Front of tokens", short: "Front", src: tokensBack },
      { type: "image", label: "Back of tokens", short: "Back", src: tokensFront },
    ],
    prototypingDemo: [
      { type: "video", label: "Round 1 prototype demo", url: "https://youtu.be/uuexYcbPKN8" },
    ],
    failedConcepts: [
      { type: "image", label: "Round 1 testing setup", short: "Setup", src: testingSetup1 },
    ],
    iterations: [
      { type: "image", label: "A family participates in testing the prototype", src: v2Testing },
    ],
    round2Setup: [{ type: "image", label: "Round 2 prototype setup" }],
    designSystem: [{ type: "image", label: "Color variables" }],
    copywriting: [{ type: "image", label: "Copywriting guidelines doc" }],
    finalFlow: [{ type: "video", label: "Final prototype demo", url: "https://youtu.be/sW45wnLC6Mk" }],
    outcome: [
      { type: "image", label: "Showcasing the project at intern demo day", src: demoDay },
    ],
  },
};

const ucscMentorshipPlatform = {
  ...placeholderProject(1),
  title: "UC Santa Cruz Mentorship Program",
  // Shown on the Works list: a short badge (company + icon), a serif title,
  // and a punchier one-line headline — all distinct from the fuller `title`/
  // `tagline` used on the case study page itself.
  company: "UC Santa Cruz",
  companyIcon: "\u{1F393}",
  listTitle: "UCSC Mentorship Platform",
  listHeadline: "Building a scalable mentorship platform for UXers",
  heroVideo: mentorshipHero,
  heroVideoTall: true,
  // Reserves the full viewport height around the hero (instead of just the
  // video's own 90vh) so nothing below it peeks into view until scrolled.
  heroNoPeek: true,
  // Shows the full video frame uncropped on the Works list cover (instead of
  // the usual object-cover crop) so less of it is cut off — "zoomed out".
  listHeroContain: true,
  tags: ["0 → 1", "Web"],
  alignTocWithContext: true,
  type: "",
  year: "",
  tagline:
    "Facilitating the growth of mentor-mentee relationships in UC Santa Cruz's HCI graduate program",
  cover:
    "UC Santa Cruz's Human-Computer Interaction program boasts a tight knit network of mentors in the field of Human-Computer Interaction. Our team was tasked with **creating a new platform that automated the matching process for admin and facilitated sustainable relationships for mentors and mentees**.",
  impactStats: [
    "Cut labor of matching process for Admin by 30%",
    "Spearheaded Dashboard and Admin design workflow",
    "~90% of mentees and mentors preferred this platform over the program's current format",
  ],
  meta: {
    ...placeholderProject(1).meta,
    role: "UX Designer",
    tools: "Figma, Miro, Visual Studios, Claude Code",
    team: "Ivy T. (me), Tereese B., Nicole F., Diane P.",
    timeline: "July 2026 - Now",
  },
  // Replaces every template section below the overview; each section's
  // `blocks` render in order, and nav-linkable subheadings show in the sidebar.
  sections: [
    {
      id: "background",
      label: "Background",
      title: "The task: a central hub for admin, mentors, and mentees",
      blocks: [
        { type: "subheading", label: "Background", nav: false },
        {
          type: "text",
          text: "The UCSC HCI Mentorship program's goal is to help students create meaningful relationships with industry mentors.\n\nCurrently, there are gaps in the way the program's run. The administrative side is conducted manually, matching isn't perfect, and relationships don't last.",
        },
        {
          type: "audience",
          id: "audience",
          navLabel: "Audience",
          groups: [
            { label: "Program Coordinators", description: "Program Coordinators" },
            { label: "Mentors", description: "Mentors" },
            { label: "Student Mentees", description: "Student Mentees" },
          ],
        },
        {
          type: "challenge",
          id: "challenge",
          navLabel: "The challenge",
          text: "How might we design a platform that…\n1) streamlines the administrative side of matching to create optimal pairings\n2) helps cultivate sustainable professional relationships in the program?",
        },
      ],
    },
    {
      id: "solution",
      label: "Solution",
      title: "Reimagining the Mentorship Coalition Program in a new format",
      blocks: [
        {
          type: "cards",
          items: [
            {
              label: "Onboarding",
              description: "Mentees and mentors fill out information about their background and interests.",
              src: solutionOnboarding,
            },
            {
              label: "Conduct Matching",
              description:
                "The Program Coordinator runs the matching algorithm, creating pairs and pods based on onboarding data.",
              src: solutionMatching,
            },
            {
              label: "Mentor Directory",
              description: "Post-match, mentees still have the opportunity to connect with other mentors.",
              src: solutionMentorDirectory,
            },
          ],
        },
      ],
    },
    {
      id: "research",
      label: "Research",
      title: "The current format has a high cost: administrative burden.",
      blocks: [
        { type: "image", src: mentorshipResearch, alt: "Research methods overview" },
        {
          type: "text",
          text: "To understand current experiences in the Mentor Coalition program, we sent out a short **survey** and conducted **30-45 minute semi-structured interviews** with 4 mentors and 10 mentees that have participated in the program in the past year.",
        },
        {
          type: "insight",
          header: "Mentee-mentor connections often fade off by the end of the year.",
        },
        {
          type: "collapsible",
          label: "How we got here",
          text: "On FigJam, we employed affinity diagramming to synthesize insights from both research methods, leading to us extracting the following themes: program-specific issues, potential platform features, challenges with mentorship relationships, values and motivations, and structure/style preferences.",
          tabs: [
            { label: "Before", src: mentorshipAffinityBefore, alt: "Affinity diagram (before)" },
            { label: "After", src: mentorshipAffinityAfter, alt: "Affinity diagram (after)" },
          ],
        },
        {
          type: "text",
          text: "Relationships didn't last mostly because they weren't compatible from the start. Mentors and mentees pointed to misalignment in personalities, interests, and career goals.\n\nOne mentee interested in pursuing a PhD noted:",
        },
        {
          type: "quote",
          text: "Even though my mentor did have a research background, I felt like she couldn't tell me much about the PhD route… so I ended up seeking out another mentor [outside of the program].",
        },
        {
          type: "text",
          text: "This led us to prioritize improving the matching process over improving existing relationships.",
        },
        { type: "subheading", label: "How does the matching currently work?" },
        {
          type: "text",
          text: "To learn more about the current process behind the scenes, we spoke to 1 Program Coordinator. The key insight that surfaced was:",
        },
        {
          type: "insight",
          label: "Key Insight",
          header: "The matching process costs time and administrative burden.",
        },
        {
          type: "text",
          text: "They singlehandedly organize the admin side manually, from collecting individual data to creating the pairings. This amount of work on one person means there's a lot of room for human error, so matches aren't the most optimal.",
        },
        { type: "image", src: currentProcess, alt: "Current matching process", narrow: true },
      ],
    },
    {
      id: "building-the-mvp",
      label: "Building the MVP",
      title: "Prioritizing the Matching Process",
      blocks: [
        { type: "text", text: "The team focused on the following 2 flows to include in the MVP:" },
        {
          type: "cards",
          items: [
            {
              label: "Onboarding",
              description:
                "Mentees and mentors complete an onboarding form, filling out background information and pairing preferences.",
            },
            {
              label: "Matching Management",
              description:
                "The coordinator initiates the matching algorithm, creating pairings based on the form, reviews the results, and publishes.",
            },
          ],
        },
        {
          type: "text",
          text: "While half of the team focused on Onboarding for mentors and mentees, I led the end-to-end design of the Matching Management experience for program coordinator users.",
        },
        { type: "subheading", label: "Exploring design directions" },
        {
          type: "text",
          text: "My team and I proceeded to explore different design avenues through sketching and vibecoding before converging on a low-fidelity design.\n\nSimilar ways of displaying data emerged among our drawings, but our ideas diverged in the flow for navigating matching. Our entry points conflicted; one flow began with the Participant Roster, while other started with Rounds.",
        },
        {
          type: "images",
          items: [
            { src: entryPoints, alt: "Conflicting entry points" },
            { src: quickStats, alt: "Quick stats sketches" },
          ],
        },
        {
          type: "text",
          text: "After discussing with the Program Coordinator, we ended up aligning on a flow where Matching was nested in Rounds. This took into account the case where the Coordinator wasn't satisfied with the algorithm's results and decided to run it again.",
        },
        { type: "image", src: updatedFlow, alt: "Updated user flow", spaceAfter: true },
        { type: "subheading", label: "Designing with FigmaMCP" },
        {
          type: "text",
          text: "Using FigmaMCP, we fed the flow and our sketches into Claude to build out our designs on Figma.",
        },
        {
          type: "panel",
          label: "Rounds Overview",
          description: "Admin creates a new round to start the matching process.",
          src: roundsOverview,
        },
        {
          type: "panel",
          label: "Match Results",
          description: "Matches are generated with the algorithm.",
          src: matchResults,
          extra: {
            label: "Iteration",
            images: [
              { src: runningMatches1, alt: "Running matches progress screen 1" },
              { src: runningMatches2, alt: "Running matches progress screen 2" },
            ],
            text: "To add more transparency surrounding the algorithm and reassurance to users, I added progress screens before the reveal of the match results. This communicated system status while keeping the Coordinator in the loop on what the algorithm was doing with the data.",
          },
        },
        {
          type: "panel",
          label: "Edit Match",
          description: "Admin verifies all matches and makes edits accordingly.",
          src: editMatch,
        },
      ],
    },
    {
      id: "in-app-experience",
      label: "In-app Experience",
      title: "Platform MVP: Mentor Directory and Profile",
      blocks: [
        {
          type: "text",
          text: "Now that we built the foundation of the platform, matching, we moved on to address how to sustain these relationships. We ideated different features to support meeting preparation and communication, things that contributed to lasting relationships.",
        },
        {
          type: "insight",
          header: "6 out of 10 mentees were no longer in contact with their originally matched mentor.",
        },
        { type: "image", src: ideationSketches, alt: "Feature ideation sketches" },
        { type: "subheading", label: "Cutting down from 5 to 2 Features" },
        { type: "image", src: cuttingDown, alt: "Cutting down from 5 to 2 features", narrow: true },
        {
          type: "text",
          text: "I decided to strip the experience down to **Mentor Directory** and **Profile** for the MVP, which would use data already collected from Onboarding.\n\nThese features didn't necessarily address supporting an existing connection, but did tackle the issue of the matches being incompatible. In the case where matches generated by the algorithm don't work out, this would give mentees additional chances to find other connections.",
        },
        {
          type: "cards",
          items: [
            { label: "Mentor Directory", description: "Search for other mentors.", src: solutionMentorDirectory },
            {
              label: "Mentor Profiles",
              description: "Learn more about a mentor and their background.",
              src: mentorProfile,
            },
          ],
        },
      ],
    },
    {
      id: "reflection",
      label: "Reflection",
      title: "What I learned",
      blocks: [
        {
          type: "cards",
          items: [
            {
              label: "Designing for flexibility",
              description:
                "No mentee-mentor relationship looks the same. Everyone has varying preferences when it comes to communication, expectations, and goals, so it was important to approach solutions that could accommodate different types of relationships.",
            },
            {
              label: "Incorporating AI in the Design Process",
              description:
                "Coming into the project, there were an overwhelming amount of tools and possible ways of using AI with Claude Code, Claude Design, Figma MCP… the list goes on. It took some experimenting to figure out which tools fit into which parts of the design process, without sacrificing creativity and quality.",
            },
          ],
        },
      ],
    },
  ],
};

const earthquakeGeologyMapProjection = {
  ...placeholderProject(3),
  hideFromHome: true,
  hideContext: true,
  alignTocWithContext: true,
  showBackToTop: true,
  hideUsabilityTesting: true,
  hideIterations: true,
  hideDesignSystem: true,
  hideOutcome: true,
  finalFlowDeviceFrame: true,
  finalFlowWallProjection: true,
  heroVideo: geologyMapHero,
  heroVideoCompact: true,
  finalConceptCta: "Jump to Final Concept",
  finalFlowWallVideo: finalProjection,
  finalFlowTouchscreenVideo: finalTouchscreen,
  round2TestingSection: {
    title: "Building the experience of the projection",
    text: "After solidifying the UX of the touchscreen view, I then shifted my focus to creating the wall view. Rather than exactly mirroring the map on the touchscreen, we wanted this to be its own focal point that worked alongside the main experience on the digital screen.",
    cards: [
      {
        header: "An idle state to attract passersby",
        text: "The projection is simultaneously an attention grabber to visitors walking by and an accessible view for groups hovering over the interface together.",
        video: projectionIdleState,
      },
      {
        header: "Projection vs. touchscreen map information",
        text: "Information on the touchscreen's map is reflected on the projection's, but the latter reveals limited information to protect user privacy and to keep the touchscreen the main source of information.",
        video: projectionMapInfo,
        insight: {
          header: "3/5 users inputted their home address when searching for a location.",
          text: "The experience raised privacy concerns, as users were able to type in their address/zipcode or zoom into a particular street when searching for a location. Since this would have been reflected on the map projection, viewable to anyone in the vicinity, this points to a need to accommodate for different ways of searching while protecting user privacy.",
        },
      },
    ],
    subsectionTitle: "Connecting the 2 views for testing",
    subsectionText:
      "With Claude Code, I then connected the wall view and the newly iterated touchscreen view into a completed prototype ready for testing with 5 staff members. During setup, we tried replicating the measurements of the actual intended exhibit experience.",
    subsectionImage: round2Testing,
  },
  technicalChallenges: {
    title: "Technical Challenges",
    cards: [
      {
        label: "Hardware difficulties",
        description:
          "Users were struggling in using gestures on the ELO (e.g. tapping, zooming in/out, dragging, etc.). This poses potential accessibility barriers for people that have motor impairments.",
      },
      {
        label: "Implementing real data",
        description:
          "While vibecoding generated well-written content that sufficed for user testing, it was difficult to tell what information was real or made up by the LLM. I needed to explicitly inform Claude to pull data from trusted sources such as the California Geographic Survey (CGS) and verify that testimonies and stories were real.",
      },
    ],
  },
  nextSteps: {
    title: "I proposed 3 recommendations for the team to move forward with.",
    cards: [
      {
        label: "Future Testing",
        description:
          "Future testing should be conducted with a diverse range of users on the floor, including kids and families. There is also a need to validate whether the idle state actually attracts passersby.",
      },
      {
        label: "Projection Explorations",
        description:
          "Although it wasn't surprising that users who were driving the touchscreen experience had little motivation to look at the map, there is an opportunity to explore how to make the projection's map more interesting, such as adding animations or a 3D view.",
      },
      {
        label: "Accessibility Considerations",
        description:
          "The experience should accommodate for accessibility (e.g. hearing, vision, motor impairments) as well as Spanish and Vietnamese translations.",
      },
    ],
  },
  researchLabel: "Exploration",
  prototypingLabel: "User Testing",
  userTestingIntro:
    "For user testing, I connected the prototypes to the ELO 2402L touchscreen on my office desk, where 5 staff members came by to quickly test out the experience.",
  userTestingImage: round1Setup,
  userTestingCards: [
    {
      label: "Tabs offer the highest flexibility in navigation.",
      header: "4/5 users preferred the Tabs layout.",
      text: "Users preferred having the flexibility of being able to navigate quickly back and forth between the content. The linear aspect of the tabs appeared to encourage users to follow the given order and were thus more likely to actually go through all the content compared to the other layouts.",
      quote:
        "The tabs are more linear, like a story, and the accordion feels like a choose-your-own adventure.",
      video: round1Tabs,
    },
    {
      label: "Unmet expectations in interactivity",
      cards: [
        {
          header: "5/5 users had mistakenly tapped on a component that they expected to get feedback for.",
          text: "Users expected more opportunities for interaction with the content on the right panel, not just on the map. They would repeatedly tap on something, only to realize that it wasn't clickable.",
        },
        {
          header: "Solution: Allow for more interactivity through the content and the map.",
          text: "On the right side panel, I made more components interactive so that there were more chances of getting more information either within the panel or on the map upon tapping. Similarly, I added more interactive components on the map itself; for instance, clicking on a circle representing an earthquake would trigger the panel to display more info about it.\n\nThis added more entry points to the experience, instead of needing to search for location first.",
          imageTabs: [
            {
              label: "After",
              video: iteration2After,
              caption: "An added entry point from the home screen",
            },
            {
              label: "Before",
              video: iteration2Before,
              caption: "Previously, users needed to search for a location and click on the tab before access to the same information",
            },
          ],
        },
      ],
    },
  ],
  title: "Earthquake Geology Map Projection",
  tags: ["Exploration", "Concept Design"],
  type: "",
  year: "",
  tagline: "Educating museum visitors about Bay Area earthquake geology, hazards, and history.",
  cover:
    "As the starting point of the Earthquake Exhibit, the Geology Map is a floor-to-ceiling projected map of the San Francisco Bay Area accompanied by a touchscreen interactive that's intended to drive the user experience. In this project, I explore initial conceptualizations of this dual-interface interactive.",
  meta: {
    ...placeholderProject(3).meta,
    role: "UX Designer",
    tools: "Claude Design, Claude Code, ELO 2402L, Nebula projector",
    timeline: "3 weeks",
    team: "Ivy T., Katie O. (Concept), Beth M. (Art + Visual Concepts)",
  },
  problem: {
    significance:
      "As the entry point to The Tech Interactive's Earthquake Exhibit, the Geology Map sets the tone for a visitor's entire experience. Housed as a floor-to-ceiling projection paired with a touchscreen interactive, it needed to orient visitors to Bay Area earthquake geology, hazards, and history before they moved deeper into the exhibit — all within the few minutes a typical museum visitor spends at any single interactive.",
    audience: {
      groups: [
        {
          label: "Primary",
          description: "Museum visitors, including families and school groups, encountering the exhibit for the first time.",
        },
        {
          label: "Secondary",
          description: "Museum staff and educators who guide visitors through the exhibit floor.",
        },
      ],
    },
    challenge:
      "How might we design a dual-interface experience that helps visitors intuitively orient themselves to Bay Area earthquake geology, hazards, and history?",
  },
  sectionTitles: {
    ...placeholderProject(3).sectionTitles,
    problem: "A dual-interface entry point to the Earthquake Exhibit",
    research: "I explored 3 different navigation experiences with Claude Design.",
    prototyping: "Users wanted flexibility, privacy, and more interactivity.",
    finalFlow: "The Final Result",
  },
  finalFlow: "",
  research: {
    ...placeholderProject(3).research,
    heroImage: userflow,
    intro:
      "I first mapped out the flow with the required topics (geology, hazards, history, etc.) to visualize how users would be orienting themselves between the map and information. Given the short timeline and intention of this phase of the project to be purely discovery and exploration, I jumped into vibecoding, using the flow as context.\n\nWith Claude Design, I quickly created 3 different layouts of the information panel I had ideated: 2-step, tabs, and accordion. This allowed me to produce 3 prototypes ready for user testing.",
    tabs: [
      { label: "Overview", src: panelExplorations },
      { label: "2-step", video: round1TwoStep },
      { label: "Tabs", video: round1Tabs },
      { label: "Accordion", video: round1Accordion },
    ],
    designRequirements: null,
    mappingTheFlow: null,
    findings: [],
  },
};

const earthquakeExhibit = {
  ...placeholderProject(4),
  title: "The Tech Interactive Earthquake Exhibit",
  company: "The Tech Interactive",
  companyIcon: "\u{1F3DB}\u{FE0F}",
  listTitle: "The Tech Interactive Earthquake Exhibit",
  listHeadline: "Educating museum visitors about Bay Area earthquakes",
  tagline: "Educating museum visitors about earthquake geology and preparation through an interactive exhibit experience",
  tags: ["Internship", "Fabrication", "Usability Testing"],
  heroImage: techInteractiveLogo,
  heroImageCompact: true,
  heroImageFull: true,
  heroNoPeek: true,
  type: "",
  year: "",
  tldrImage: techMuseum,
  cover:
    "[The Tech Interactive Museum](https://www.thetech.org/), a science and technology center in the heart of the Silicon Valley, is relaunching its popular Earthquake Exhibit in Summer 2027.\n\nI designed 2 digital experiences that would be part of the exhibit.\n\nProjected to reach **~250,000** to **400,000** visitors in the next year.",
  meta: {
    ...placeholderProject(4).meta,
    role: "UX Designer",
    tools: "Figma, Miro, Visual Studios, Claude Design, Claude Code, RFID, 3D printing",
    timeline: "June - Sept 2026 (8 weeks)",
    team: "Ivy T. (Digital Design), Isabel M. (Hardware Design), Katie O. (Manager), Beth M. (Art + Concept Design)",
  },
  linkedCaseStudies: ["project-3", "project-2"],
  hideToc: true,
  hideOverview: true,
  hideContext: true,
  solution: "",
  hideResearch: true,
  hidePrototyping: true,
  hideUsabilityTesting: true,
  hideIterations: true,
  hideDesignSystem: true,
  hideFinalFlow: true,
  hideOutcome: true,
};

const zoomHybridInstruction = {
  ...placeholderProject(5),
  title: "ZoomMate in the Classroom",
  company: "Zoom",
  companyIcon: "\u{1F4AC}",
  listTitle: "ZoomMate in the Classroom",
  // Breaks out of the two-column Works list to span the full width.
  listFullWidth: true,
  listHeadline: "Exploring conversational AI in hybrid instruction",
  tagline: "Improving hybrid synchronous instruction in higher education",
  heroVideo: zoomHero,
  heroVideoTall: true,
  tags: ["Capstone", "Conversational AI", "Research"],
  hideToc: true,
  meta: {
    ...placeholderProject(5).meta,
    role: "Product Designer\n\nProject Manager",
    tools: "",
    team: "Alison C., Anvitha G., Jasmine D., Diane P.",
    timeline: "April 2026 - Now",
  },
  sectionTitles: {
    ...placeholderProject(5).sectionTitles,
    problem: "Exploring Conversational AI in Hybrid Instruction",
  },
  challengeDark: true,
  contextLabel: "Background",
  problem: {
    ...placeholderProject(5).problem,
    challengeLabel: "The Opportunity",
    challenge:
      "How might conversational AI be leveraged to enrich live synchronous hybrid instruction in higher education?",
    notice:
      "This work is under NDA. Reach out at [ivjtang@ucsc.edu](mailto:ivjtang@ucsc.edu) to learn more!",
    plainText:
      "Zoom partnered with our capstone team to explore opportunities in **enabling AI-first experiences** to enhance meetings. With users already granting microphone and camera access for meeting experiences, the video-conferencing platform holds a unique advantage in the **conversational AI space** in particular.\n\nIn this project, we set out to investigate how to harness conversational AI in optimizing **educational experiences**.",
  },
  hideResearch: true,
  hideTldr: true,
  hidePrototyping: true,
  hideUsabilityTesting: true,
  hideIterations: true,
  hideDesignSystem: true,
  hideFinalFlow: true,
  hideOutcome: true,
};

export const projects = [
  ucscMentorshipPlatform,
  earthquakeExhibit,
  zoomHybridInstruction,
  earthquakeDiyPrepKitGame,
  earthquakeGeologyMapProjection,
];
