const axios = require('axios');

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
                            content: "You are an AI assistant that helps that gives summaries on my music taste based on statistics.",
                        },
                        {
                            role: 'user',
                            content: `Below are AVERAGES for stats of multiple albums listened to by me: summarise my music taste. Just return the summary, nothing else should be returned\n\n${text}`,
                        },
                    ],
                    max_tokens: 150,
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
            const summary = response.data.choices[0]?.message?.content?.trim();
            return res.status(200).json({ summary });

        } catch (error) {
            console.error('OpenAI API error:', error.response?.data || error.message);
            return res.status(500).json({ error: 'An error occurred while fetching data from OpenAI' });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
