const axios = require('axios');

module.exports = async (req, res) => {
    // Set the CORS headers to allow requests from any origin or specifically from localhost
    res.setHeader('Access-Control-Allow-Origin', '*');  // Change '*' to 'http://localhost:3001' for security in local dev
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // If it's a pre-flight request (OPTIONS request), we just respond with status 200
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
                            content: "You are an AI assistant that helps users come up with friendly and conversational message suggestions for a social media app for music lovers.",
                        },
                        {
                            role: 'user',
                            content: `Suggest what to say after this message:\n\n${text}, make it music-related too, as this is for a social media app for music lovers, and just return the message, don't return anything else apart from the message you are suggesting`,
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
            const suggestion = response.data.choices[0]?.message?.content?.trim();
            return res.status(200).json({ suggestion });

        } catch (error) {
            console.error('OpenAI API error:', error.response?.data || error.message);
            return res.status(500).json({ error: 'An error occurred while fetching data from OpenAI' });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
