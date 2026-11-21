/**
 * Official programme pages the robot reads on its own, then re-checks every 14 days.
 * You never have to touch this. If a page cannot be opened, the robot just skips it.
 * To add one later, copy a line, change the label and the address.
 */
export interface Seed {
  label: string;
  url: string;
}

export const SEED_PAGES: Seed[] = [
  { label: "Commonwealth Shared Scholarships", url: "https://cscuk.fcdo.gov.uk/shared" },
  { label: "Commonwealth Master's Scholarships", url: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarship/" },
  { label: "Chevening Scholarships", url: "https://www.chevening.org/scholarships/" },
  { label: "Gates Cambridge Scholarship", url: "https://www.gatescambridge.org/apply/" },
  { label: "Rhodes Scholarship", url: "https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/" },
  { label: "DAAD Scholarships Germany", url: "https://www.daad.de/en/study-and-research-in-germany/scholarships/" },
  { label: "Mastercard Foundation Scholars Program", url: "https://mastercardfdn.org/all/scholars/" },
  { label: "Tony Elumelu Foundation Entrepreneurship Programme", url: "https://www.tefconnect.com/" },
  { label: "Swedish Institute Scholarships for Global Professionals", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/" },
  { label: "Fulbright Foreign Student Program", url: "https://foreign.fulbrightonline.org/" },
  { label: "Google Summer of Code", url: "https://summerofcode.withgoogle.com/" },
  { label: "Outreachy Remote Internships", url: "https://www.outreachy.org/apply/" },
  { label: "MLH Fellowship", url: "https://fellowship.mlh.io/" },
  { label: "Y Combinator Application", url: "https://www.ycombinator.com/apply" },
  { label: "Microsoft Learn Student Ambassadors", url: "https://studentambassadors.microsoft.com/" },
  { label: "ALX Africa Tech Programmes", url: "https://www.alxafrica.com/" },
];
