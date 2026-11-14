import type { Category } from "./types";

export interface CategoryInfo {
  name: Category;
  slug: string;
  navLabel: string;
  h1: string;
  title: string;
  description: string;
  intro: string[];
}

export const CATEGORY_INFO: CategoryInfo[] = [
  {
    name: "Remote Jobs",
    slug: "remote-jobs",
    navLabel: "Remote Jobs",
    h1: "Remote Jobs for Africans",
    title: "Remote Tech Jobs for Africans (Updated Daily)",
    description:
      "Fresh remote tech jobs open to people in Nigeria and across Africa. Each listing is checked and links straight to the employer’s own page.",
    intro: [
      "Remote work is the closest thing many of us have to a level playing field. A company in Berlin or Toronto can hire you without caring which city you log in from, as long as you can do the work and be reliable on a call.",
      "The catch is that a lot of “remote” posts are not open to Africa at all, or they hide a fee, or they are simply old. We read each one, note where the role is actually open, and send you to the official page so you never have to trust us blindly.",
    ],
  },
  {
    name: "Fellowships",
    slug: "fellowships",
    navLabel: "Fellowships",
    h1: "Fellowships for African Tech Talent",
    title: "Fellowships for Africans: Open Applications & Deadlines",
    description:
      "Fellowships, residencies and leadership programmes open to African applicants, with deadlines, who can apply and a link to apply officially.",
    intro: [
      "A good fellowship gives you three things money can’t easily buy: a network, a credible name on your profile and time to build something properly. Many are fully funded and open to people early in their careers.",
      "Deadlines move fast, so we show the closing date first and tell you in plain words who is eligible before you spend a weekend on an application.",
    ],
  },
  {
    name: "Internships",
    slug: "internships",
    navLabel: "Internships",
    h1: "Tech Internships in Nigeria and Across Africa",
    title: "Tech Internships in Nigeria & Africa (Remote and On-site)",
    description:
      "Paid and unpaid tech internships for students and graduates in Nigeria and across Africa, including remote options, with deadlines and official links.",
    intro: [
      "Your first internship is usually the hardest thing to land and the most useful thing you can have on a CV. We list internships for developers, designers, data people and product beginners, and we flag which ones are remote.",
    ],
  },
  {
    name: "Scholarships",
    slug: "scholarships",
    navLabel: "Scholarships",
    h1: "Scholarships for African Students",
    title: "Scholarships for Africans: Latest Open Scholarships",
    description:
      "Undergraduate, masters and PhD scholarships open to African students, with deadlines, eligibility and links to the official application page.",
    intro: [
      "A scholarship can change the direction of a whole family. We keep this page focused on awards that are open to African applicants, and we always show the deadline and eligibility up front so you can decide quickly.",
      "Apply only through the official page we link to. A real scholarship never asks you to pay to be considered.",
    ],
  },
  {
    name: "Grants & Funding",
    slug: "grants-funding",
    navLabel: "Grants",
    h1: "Grants and Funding for African Founders and Creators",
    title: "Grants & Funding for African Startups and Creators",
    description:
      "Grants, accelerators and funding calls for African founders, builders and creators, with deadlines, eligibility and official application links.",
    intro: [
      "Funding calls for African builders appear all the time, then disappear before most people hear about them. This page collects the open ones so you can apply while the window is still open.",
    ],
  },
  {
    name: "Bootcamps & Training",
    slug: "bootcamps-training",
    navLabel: "Training",
    h1: "Free and Funded Tech Training Programmes",
    title: "Free & Funded Tech Bootcamps and Training for Africans",
    description:
      "Free and sponsored bootcamps, courses and training programmes for Africans learning software, data, design and product skills.",
    intro: [
      "Good training is the shortcut between “I want to work in tech” and a real portfolio. We list free and sponsored programmes, and we say clearly whether a programme is a course, a bootcamp or a cohort with a job pipeline.",
    ],
  },
  {
    name: "News",
    slug: "news",
    navLabel: "News",
    h1: "Tech Career and Opportunity News for Africa",
    title: "African Tech Careers News: Hiring, Funding & Programmes",
    description:
      "Short, sourced news about hiring, funding and programmes that affect African tech workers and students.",
    intro: [
      "Not everything is an application form. Sometimes the useful thing is knowing that a company has started hiring in Africa, or a programme has changed its rules. We summarise it in our own words and link to the original reporting.",
    ],
  },
];

export const categoryBySlug = (slug: string) => CATEGORY_INFO.find((c) => c.slug === slug);
export const categorySlug = (name: Category) =>
  CATEGORY_INFO.find((c) => c.name === name)?.slug ?? "news";
