import { SITE_URL, INDEXNOW_KEY } from './config';

export async function submitIndexNow(urls: string[]): Promise<void> {
  if (!INDEXNOW_KEY || urls.length === 0) return;
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'partidosdehoy.live',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/indexnow-key.txt`,
        urlList: urls,
      }),
    });
  } catch {
    // Non-critical — best effort
  }
}
