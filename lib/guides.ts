export interface GuideSection {
  id: string;
  heading: string;
  body: string[];
  bullets?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  updated: string; // YYYY-MM-DD, edit when you update the guide
  readMins: number;
  category: string; // category slug for the "see live listings" link
  sections: GuideSection[];
}

/**
 * EDIT THESE. Google rewards real experience. Add your own stories, screenshots,
 * names of programmes you have seen, and mistakes you have made. Then update "updated".
 */
export const GUIDES: Guide[] = [
  {
    slug: "find-remote-tech-jobs-africa",
    title: "How to Find Real Remote Tech Jobs as an African Developer",
    description:
      "A practical, honest guide to finding remote tech jobs from Nigeria or anywhere in Africa: where to look, how to read a job post, and how to avoid scams.",
    updated: "2026-11-14",
    readMins: 6,
    category: "remote-jobs",
    sections: [
      {
        id: "start-here",
        heading: "Start here: what “remote” really means",
        body: [
          "When a post says “remote”, it can mean three very different things. It can mean work from anywhere in the world. It can mean work from specific countries only. Or it can mean remote inside one time zone, which quietly rules out many of us.",
          "Before you write a single line of a cover letter, find the sentence about location. If it says “US only” or “must be authorised to work in the EU”, move on. Your time is worth more than a long shot.",
        ],
      },
      {
        id: "where-to-look",
        heading: "Where to look (and where not to)",
        body: [
          "The best leads usually come from three places: a company’s own careers page, a hiring post by a real person on a professional network, and a curated directory like this one that links to the original source.",
          "Be careful with posts that only exist on a random chat group with no company name. If you can’t find the employer’s website, treat the post as unverified.",
        ],
        bullets: [
          "Check the company has a real website and real people on a professional profile.",
          "Search the company name with the word “scam” before you apply.",
          "Apply on the company’s own page when you can, not through a middleman form.",
        ],
      },
      {
        id: "read-the-post",
        heading: "How to read a job post in two minutes",
        body: [
          "Look for the stack, the level and the time zone. A role asking for 8 years of experience and paying junior money is a red flag. So is a role that is vague about what you will actually build.",
          "Then check the hours. If the team works 9 to 5 in New York, you will be working from about 2 pm to 10 pm in Lagos. Some people love that. Some burn out. Decide before you apply.",
        ],
      },
      {
        id: "get-paid",
        heading: "Getting paid across borders",
        body: [
          "Ask early how you will be paid. Many African developers use a mix of bank transfers, payment platforms and, in some cases, a local contractor agreement. Whatever the method, get the terms in writing and keep records for tax.",
          "A real employer will never ask you to pay for equipment, training or a “processing fee” before you start.",
        ],
      },
      {
        id: "scam-signs",
        heading: "Quick signs of a fake offer",
        body: ["If you see two or more of these, stop and check again."],
        bullets: [
          "The offer arrives before any real interview.",
          "They ask for money, gift cards or your bank login.",
          "The email comes from a free address that does not match the company.",
          "The pay is far above the market for the job.",
        ],
      },
      {
        id: "next-step",
        heading: "Your next step",
        body: [
          "Pick five roles from the live list, write a short, specific note for each, and send them this week. Small and steady beats perfect and never sent.",
        ],
      },
    ],
  },
  {
    slug: "fellowships-for-african-tech-talent",
    title: "Fellowships for African Tech Talent: How to Apply and Stand Out",
    description:
      "How fellowships work, who they are for, and a simple method for writing an application that gets read, with a checklist you can reuse.",
    updated: "2026-11-14",
    readMins: 5,
    category: "fellowships",
    sections: [
      {
        id: "what-is-a-fellowship",
        heading: "What a fellowship actually is",
        body: [
          "A fellowship is a structured programme that gives you funding, mentorship, a network, or all three, usually for a fixed period. Some are for researchers, some for founders, some for early-career engineers. They are not the same as a job, and they are not the same as a scholarship.",
          "Read the first paragraph of the official page twice. It tells you who the programme is built for. If that person is not you, save your energy for the next one.",
        ],
      },
      {
        id: "who-qualifies",
        heading: "Who usually qualifies",
        body: [
          "Eligibility is where most people lose time. Look for age limits, residency rules, education level, and whether you must already have a project or a company.",
        ],
        bullets: [
          "Age and career stage (student, early-career, mid-career).",
          "Country of citizenship or residence.",
          "Whether English proficiency or a test is required.",
          "Whether you need a reference letter, and from whom.",
        ],
      },
      {
        id: "write-it",
        heading: "A simple way to write the application",
        body: [
          "Selectors read hundreds of applications. Make yours easy. Say what you have built, what you want to build next, and why this programme is the right place to do it. Use numbers where you can, like users, sales, or hours saved.",
          "Write the first draft in plain words, as if you were telling a friend. Then cut every sentence that does not prove something.",
        ],
      },
      {
        id: "checklist",
        heading: "Before you press submit",
        body: ["Run through this once, slowly."],
        bullets: [
          "Did I answer exactly the question that was asked?",
          "Did I check the deadline in my own time zone?",
          "Did someone else read it for typos?",
          "Did I save a copy of everything I sent?",
        ],
      },
    ],
  },
  {
    slug: "spot-fake-jobs-and-scholarships",
    title: "How to Spot Fake Jobs, Scholarships and Fellowships (Scam Checklist)",
    description:
      "A short checklist to tell real opportunities from scams, with the red flags we see most often and what to do if you already paid.",
    updated: "2026-11-14",
    readMins: 4,
    category: "news",
    sections: [
      {
        id: "golden-rule",
        heading: "The golden rule",
        body: [
          "Real opportunities do not charge you to be considered. If you are asked to pay an application fee, a “processing” fee or a “slot” fee, walk away. Genuine programmes make their money elsewhere.",
        ],
      },
      {
        id: "red-flags",
        heading: "Red flags that show up again and again",
        body: ["Scammers copy real brands, so the logo alone proves nothing."],
        bullets: [
          "Pressure to act today, or you will “lose your slot”.",
          "Contact only through chat apps, never a company email.",
          "Spelling and grammar that a real organisation would not publish.",
          "A link that looks like the real site but has a slightly different address.",
          "Promises of guaranteed admission or guaranteed income.",
        ],
      },
      {
        id: "verify",
        heading: "How to verify in five minutes",
        body: [
          "Open the organisation’s official website by typing the address yourself, not by clicking a message. Find the same opportunity there. If it isn’t listed, ask them by email using the address on their own site.",
          "Search the programme name together with “scam” or “fake”. Real people usually warn each other.",
        ],
      },
      {
        id: "paid-already",
        heading: "If you already paid",
        body: [
          "Stop sending money. Keep screenshots and receipts. Tell your bank or payment provider quickly, and report the account to your local cybercrime unit. It may not bring the money back, but it protects the next person.",
        ],
      },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
