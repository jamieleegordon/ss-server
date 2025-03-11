module.exports = (req, res) => {
    // Set the CORS headers to allow requests from localhost
    res.setHeader('Access-Control-Allow-Origin', '*'); // or use 'http://localhost:3001' to restrict to only your local dev
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // If it's a pre-flight request (OPTIONS request), we just respond with status 200
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method == 'GET') {
        res.json([
            { name: "efjhiefiejfioee" }
        ]);
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
