const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

// Function to count word frequency
function countWordFrequency(text, n) {
    const words = text.toLowerCase().match(/\b[a-zA-Z]+\b/g);
    const frequencyMap = {};

    if (words) {
        words.forEach(word => {
            frequencyMap[word] = (frequencyMap[word] || 0) + 1;
        });
    }

    return Object.entries(frequencyMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([word, frequency]) => ({ word, frequency }));
}


app.get('/', (req, res) => {
    res.render('index'); 
});


app.post('/analyze', async (req, res) => {
    const { url, n_value = 10 } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const response = await axios.get(url);

        if (response.status !== 200) {
            return res.status(400).json({ error: "Could not fetch the URL content" });
        }

        const $ = cheerio.load(response.data);

        $('script, style, link').remove();

        const text = $('body').text();

        const topWords = countWordFrequency(text, n_value);
        res.json({ top_words: topWords });
    } catch (error) {
        console.error("Error fetching or processing the URL:", error.message);
        res.status(500).json({ error: "Failed to fetch and process the URL" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
