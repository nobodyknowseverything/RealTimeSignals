// api/sentiment.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey = 'my3hesnzk4d46q914cqilr3ymma877461sg76ub'; // Your LunarCrush key
  const symbol = 'XRP';

  try {
    const response = await fetch(`https://api.lunarcrush.com/v2?data=assets&key=${apiKey}&symbol=${symbol}`);
    if (!response.ok) throw new Error('LunarCrush API failed: ' + response.status);

    const data = await response.json();
    const asset = data.data[0] || {};

    const sentiment = asset.sentiment_absolute || 50;
    const socialVolume = asset.social_volume || 0;
    const galaxyScore = asset.galaxy_score || 50;

    let shortText = 'X Sentiment: Neutral';
    let className = 'neutral';
    let sentimentLabel = 'Neutral';

    if (sentiment > 60 || galaxyScore > 70) {
      shortText = 'X Sentiment: Bullish (high social volume & positive sentiment)';
      className = 'bullish';
      sentimentLabel = 'Bullish';
    } else if (sentiment < 40 || galaxyScore < 40) {
      shortText = 'X Sentiment: Bearish (negative sentiment & low volume)';
      className = 'bearish';
      sentimentLabel = 'Bearish';
    }

    console.log(`LunarCrush sentiment for XRP: ${sentiment} (Galaxy: ${galaxyScore})`);

    res.status(200).json({
      sentiment: sentimentLabel,
      shortText,
      class: className,
      socialVolume,
      galaxyScore
    });
  } catch (error) {
    console.error('Sentiment API error:', error.message);
    res.status(200).json({
      sentiment: 'Neutral',
      shortText: 'X Sentiment: Error loading data',
      class: 'neutral'
    });
  }
}
