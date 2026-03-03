// api/sentiment.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey = 'my3hesnzk4d46q914cqilr3ymma877461sg76ub'; // Your key
  const symbol = 'XRP';

  try {
    console.log('Calling LunarCrush API with key:', apiKey.substring(0, 5) + '...');
    const url = `https://api.lunarcrush.com/v2?data=assets&key=${apiKey}&symbol=${symbol}`;
    console.log('Fetching URL:', url);
    const response = await fetch(url);
    console.log('LunarCrush response status:', response.status);

    const responseText = await response.text();
    console.log('Raw LunarCrush response:', responseText.substring(0, 500)); // first 500 chars for debug

    if (!response.ok) {
      throw new Error('LunarCrush API failed: ' + response.status + ' - ' + responseText);
    }

    const data = JSON.parse(responseText);
    console.log('Parsed LunarCrush data:', JSON.stringify(data, null, 2));

    const asset = data.data?.[0] || {};

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
      shortText: 'X Sentiment: Error loading data - check key',
      class: 'neutral'
    });
  }
}
