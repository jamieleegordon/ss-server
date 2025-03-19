const axios = require('axios');

// git add .
// git commit -m 'first'
// git push

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { text } = req.body; // Extract the text from the request body

            if (!text) {
                return res.status(400).json({ error: 'Text is required' });
            }

            // Call OpenAI API using axios to get the message suggestion
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: "You are an AI assistant that returns analysis, stats and breakdowns on specified music albums",
                        },
                        {
                            role: 'user',
                            content: `Breakdown and analyse the album in JSON format like below:\n\n{
                              "audio_features": {
                                "genre": "hip hop",
                                "danceability": 0.72,
                                "energy": 0.80,
                                "key": 5,
                                "loudness": -5.5,
                                "mode": 1,
                                "speechiness": 0.13,
                                "acousticness": 0.11,
                                "instrumentalness": 0.02,
                                "liveness": 0.09,
                                "valence": 0.55,
                                "tempo": 92.0,
                                "key_changes": 1,
                                "time_signature": 4,
                                "featured_artists": ["Dr. Dre", "Snoop Dogg"],
                                "song_themes": ["Struggle", "Success", "Revolution"],
                                "peak_emotion": "Introspective",
                                "most_common_instrument": "Piano",
                                "pitch": 0.57,
                                "pace": "Moderate"
                              }
                            } give me a breakdown of \n\n${text} like above in json format, dont give me any explanations or words, just return me the json`,
                        },
                    ],
                    max_tokens: 500,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    },
                }
            );

            // Return the suggested message from OpenAI API
            const albumAnalysis = response.data.choices[0]?.message?.content?.trim();
            return res.status(200).json({ albumAnalysis });

        } catch (error) {
            console.error('OpenAI API error:', error.response?.data || error.message);
            return res.status(500).json({ error: 'An error occurred while fetching data from OpenAI' });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
