import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawUrl = searchParams.get('url');

    if (!rawUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    let url = rawUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    // Direct high-resolution screenshot generation
    const cleanUrl = url.replace(/^https?:\/\//, '');
    const screenshotUrl = `https://image.thum.io/get/width/1200/crop/800/noanimate/${encodeURI(cleanUrl)}`;

    let extractedTitle = '';
    let extractedDescription = '';

    // Fast attempt to grab real title & meta tags from the site
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
        },
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();

        // Extract <title>
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          extractedTitle = titleMatch[1].trim();
        }

        // Extract description
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                          html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i) ||
                          html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
        if (descMatch && descMatch[1]) {
          extractedDescription = descMatch[1].trim();
        }
      }
    } catch {
      // Fetch failed or timed out; continue with direct screenshot URL
    }

    return NextResponse.json({
      success: true,
      url,
      clean_url: cleanUrl,
      screenshot_url: screenshotUrl,
      title: extractedTitle || cleanUrl,
      description: extractedDescription,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to generate website preview' },
      { status: 500 }
    );
  }
}
