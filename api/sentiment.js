// api/sentiment.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS from anywhere (for browser)

  const query = 'XRP OR $XRP (price OR sentiment OR bull OR bear OR reversal OR whale OR ETF OR dump OR fear OR buy OR sell OR moon)';
  
  try {
    // Use a simple public search proxy (replace with your own if needed)
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://x.com/search?q=${encodeURIComponent(query)}&f=live`)}`);
    
    if (!response.ok) throw new Error('Search failed');
    
    const html = await response.text();
    
    // Very basic parsing (extract tweet text – not perfect but works for demo)
    const tweetMatches = html.match(/data-testid="tweetText">(.*?)<\/div>/g) || [];
    const posts = tweetMatches
      .map(m => m.replace(/data-testid="tweetText">/, '').replace(/<\/div>/, '').trim())
      .filter(text => text.length > 20)
      .slice(0, 10);

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(200).json({ posts: [] }); // Fallback to empty
  }
}
