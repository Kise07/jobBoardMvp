export function isLocation(text: string): boolean {
  const locationIndicators = [
    "remote",
    "hybrid",
    "onsite",
    "on-site",
    "usa",
    "europe",
    "asia",
    "netherland",
    "germany",
    "san francisco",
    "new york",
    "london",
    "berlin",
    "paris",
    "tokyo",
    "sydney",
    "canada",
    "australia",
    "india",
    "brazil",
    "remote-friendly",
  ];

  const jobKeywords = [
    "engineer",
    "developer",
    "manager",
    "designer",
    "lead",
    "senior",
    "junior",
    "staff",
    "principal",
    "technical",
    "full-stack",
    "front-end",
    "back-end",
    "software",
    "web",
    "mobile",
    "cloud",
    "data",
    "machine learning",
    "ai",
    "devops",
    "qa",
    "test",
    "product",
    "project",
  ];

  const lower = text.toLowerCase();
  const hasLocationIndicator = locationIndicators.some((i) =>
    lower.includes(i),
  );
  const hasJobKeyword = jobKeywords.some((k) => lower.includes(k));

  return hasLocationIndicator && !hasJobKeyword;
}

export function parseRoleFromRaw(raw: string): string {
  const parts = raw.split("|").map((p) => p.trim());
  return parts[2] || parts[1] || raw;
}
