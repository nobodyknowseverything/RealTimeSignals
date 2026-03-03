// api/sentiment.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const query = 'XRP OR $XRP (price OR sentiment OR bull OR bear OR reversal OR whale OR ETF OR dump OR fear OR buy OR sell OR moon)';
  const limit = 15;

  try {
    // Use a public, CORS-enabled X search proxy (this one is more stable for JSON results)
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://api.x.com/2/search/adaptive.json?q=${encodeURIComponent(query)}&count=${limit}`)}`;
    
    const response = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) throw new Error('Proxy fetch failed: ' + response.status);

    const data = await response.json();
    const tweets = data.globalObjects?.tweets || {};
    const posts = Object.values(tweets)
      .map(tweet => tweet.full_text || tweet.text || '')
      .filter(text => text.length > 20)
      .slice(0, limit);

    console.log(`Found ${posts.length} real X posts`);
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Sentiment API error:', error.message);
    res.status(200).json({ posts: [] }); // fallback to empty
  }
}
