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

    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    let screenshotUrl = '';
    let extractedTitle = '';
    let extractedDescription = '';
    let ogImageUrl = '';

    // PROVIDER 1: Microlink High-Res Screenshot & Metadata API (Fast, Free, Real browser engine)
    try {
      const mlController = new AbortController();
      const mlTimeout = setTimeout(() => mlController.abort(), 8000);

      const mlRes = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=true`,
        {
          signal: mlController.signal,
          headers: { Accept: 'application/json' },
        }
      );
      clearTimeout(mlTimeout);

      if (mlRes.ok) {
        const mlData = await mlRes.json();
        if (mlData.status === 'success' && mlData.data) {
          if (mlData.data.screenshot?.url) {
            screenshotUrl = mlData.data.screenshot.url;
          }
          if (mlData.data.title) {
            extractedTitle = mlData.data.title.trim();
          }
          if (mlData.data.description) {
            extractedDescription = mlData.data.description.trim();
          }
          if (mlData.data.image?.url) {
            ogImageUrl = mlData.data.image.url;
          }
        }
      }
    } catch {
      // Continue to next provider
    }

    // PROVIDER 2: WordPress mshots Fallback (Guaranteed to return screenshot for any live domain)
    if (!screenshotUrl) {
      screenshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1200&h=800`;
    }

    // Direct HTML metadata fallback if title/description not yet found
    if (!extractedTitle || !extractedDescription) {
      try {
        const htmlController = new AbortController();
        const htmlTimeout = setTimeout(() => htmlController.abort(), 3500);

        const res = await fetch(url, {
          signal: htmlController.signal,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml',
          },
        });
        clearTimeout(htmlTimeout);

        if (res.ok) {
          const html = await res.text();

          if (!extractedTitle) {
            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
              extractedTitle = titleMatch[1].trim();
            }
          }

          if (!extractedDescription) {
            const descMatch =
              html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
              html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i) ||
              html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
            if (descMatch && descMatch[1]) {
              extractedDescription = descMatch[1].trim();
            }
          }

          if (!ogImageUrl) {
            const ogMatch =
              html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i) ||
              html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["']/i);
            if (ogMatch && ogMatch[1]) {
              ogImageUrl = ogMatch[1].trim();
            }
          }
        }
      } catch {
        // Fallback silently
      }
    }

    return NextResponse.json({
      success: true,
      url,
      clean_url: cleanUrl,
      screenshot_url: screenshotUrl,
      og_image: ogImageUrl,
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

