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
                            content: `Below are AVERAGES for stats of multiple albums listened to by me: recommend 12 albums, 
                            along with an explanation to why you are recommending that album in json format, just return the json, DO NOT return anything else \n\n 
                             albums {
                                album {
                                        albumName: "", (this is just the album name, so don't include the artist name here too)
                                        explanation: ""
                                }, 
                            } \n\n${text} `,
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

            // Log the raw response from OpenAI for debugging
            console.log("OpenAI Response:", response.data);

            // Get the recommendations and parse out the raw JSON
            const recommendations = response.data.choices[0]?.message?.content?.trim();
            console.log("Raw Recommendations:", recommendations); // Log raw recommendation content

            // Assuming the returned response is already in valid JSON format
            let recommendationsJson;
            try {
                recommendationsJson = JSON.parse(recommendations);
            } catch (e) {
                console.error("Failed to parse recommendations:", e);
                return res.status(500).json({ error: 'Failed to parse response from OpenAI API' });
            }

            return res.status(200).json(recommendationsJson);

        } catch (error) {
            console.error('OpenAI API error:', error.response?.data || error.message);
            return res.status(500).json({ error: 'An error occurred while fetching data from OpenAI' });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
