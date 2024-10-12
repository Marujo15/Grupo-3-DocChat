document.getElementById('scrapeButton')?.addEventListener('click', async () => {
  const url = (document.getElementById('docUrl') as HTMLInputElement).value;
  if (!url) {
    alert('Please enter a URL');
    return;
  }

  try {
    const response = await fetch('/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    document.getElementById('result')!.innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to scrape data');
  }
});