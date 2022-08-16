export function parseQueryString(queryString: string): { [key: string]: string } {
  if (!queryString) return {};

  return queryString.split('&').reduce((acc, part) => {
    const [key, val] = part.split('=');
    acc[key] = val;
    return acc;
  }, {});
}
