export function getRepoNameFromUrl(url: string): string {
  const match = url.match(/github.com[/:]([^/]+)\/([^/.]+)(?:.git)?$/);
  if (match) {
    return match[2];
  }
  throw new Error(`Cannot parse repo name from URL: ${url}`);
}
