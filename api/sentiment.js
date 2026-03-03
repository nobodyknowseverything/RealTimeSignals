// api/sentiment.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey = 'my3hesnzk4d46q914cqilr3ymma877461sg76ub'; // Your key
  const symbol = 'XRP';

  try {
    console.log('Calling LunarCrush API...');
    const url = `https://api.lunarcrush.com/v2?data=assets&key=${apiKey}&symbol=${symbol}`;
    console.log('URL:', url);
    const response = await fetch(url);
    console.log('Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LunarCrush error:', errorText);
      throw new Error('API failed: ' + response.status);
    }

    const data = await response.json();
    console.log('LunarCrush data:', JSON.stringify(data, null, 2));

    const asset = data.data?.[0] || {};
    const sentiment = asset.sentiment_absolute || 50;
    const galaxyScore = asset.galaxy_score || 50;

    let shortText = 'X Sentiment: Neutral';
    let className = 'neutral';
    let sentimentLabel = 'Neutral';

    if (sentiment > 60 || galaxyScore > 70) {
      shortText = 'X Sentiment: Bullish';
      className = 'bullish';
      sentimentLabel = 'Bullish';
    } else if (sentiment < 40 || galaxyScore < 40) {
      shortText = 'X Sentiment: Bearish';
      className = 'bearish';
      sentimentLabel = 'Bearish';
    }

    res.status(200).json({
      sentiment: sentimentLabel,
      shortText,
      class: className
    });
  } catch (error) {
    console.error('Sentiment API error:', error.message);
    res.status(200).json({
      sentiment: 'Neutral',
      shortText: 'X Sentiment: LunarCrush unavailable',
      class: 'neutral'
    });
  }
}
