module.exports = (req, res) => {
    if (req.method == 'GET') {
        res.json([
            {name: "name"}
        ])
    } else {

    }
}