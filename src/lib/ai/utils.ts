export const parseRecommendations = (content: string) => {
  const titleRegex = /"title":\s*"([^"]+)"?/g;
  const releaseYearRegex = /"release_year":\s*"?(\d{4})?/g;
  const whyRegex = /"why":\s*"([^"]+)"?/g;

  const titles = [...content.matchAll(titleRegex)].map((m) => m[1]?.trim());
  const releaseYears = [...content.matchAll(releaseYearRegex)].map((m) => m[1]?.trim());
  const whys = [...content.matchAll(whyRegex)].map((m) => m[1]?.trim());

  const length = Math.max(titles.length, releaseYears.length, whys.length);

  const recommendations: { title: string; why: string; releaseYear: number }[] = [];

  for (let i = 0; i < length; i++) {
    recommendations.push({
      title: titles[i] || '',
      releaseYear: releaseYears[i] ? +releaseYears[i] : 0,
      why: whys[i] || '',
    });
  }

  return recommendations;
};
