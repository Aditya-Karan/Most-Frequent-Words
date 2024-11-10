async function analyzeURL() {
    const url = document.getElementById('url').value;
    const nValue = document.getElementById('n_value').value || 10;

    if (!url) {
        alert('Please enter a URL');
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, n_value: parseInt(nValue) })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        const tableBody = document.getElementById('wordTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

        // Display the words and frequencies in the table
        data.top_words.forEach(wordData => {
            const row = tableBody.insertRow();
            const cellWord = row.insertCell(0);
            const cellCount = row.insertCell(1);
            cellWord.textContent = wordData.word;
            cellCount.textContent = wordData.frequency;
        });

        // Make the table and title visible
        document.getElementById('tableContainer').classList.remove('d-none');
        document.getElementById('tableTitle').classList.remove('d-none');

    } catch (error) {
        console.log('Error:', error);
        alert('Failed to analyze the URL');
    }
}