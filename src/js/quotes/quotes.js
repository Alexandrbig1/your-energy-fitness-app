import ApiService from '../api-service/index.js';

const quoteEl = document.getElementById('daily-quote'),
  quoteAuthorEl = document.getElementById('quote-author');

const fetch = new ApiService();

function getDate() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');

  const today = `${day}/${month}/${year}`;

  return today;
}

async function fetchNewQuote() {
  try {
    const data = await fetch.fetchQuote();
    const quote = data.quote;
    const author = data.author;

    const currentDate = getDate();

    localStorage.setItem('today', currentDate);
    localStorage.setItem('quote', quote);
    localStorage.setItem('author', author);

    return { quote, author };
  } catch (error) {
    console.error('Error fetching quote:', error.message);
  }
}

const storedDate = localStorage.getItem('today');
const currentDate = getDate();

if (!storedDate || storedDate !== currentDate) {
  fetchNewQuote().then(({ quote, author }) => {
    quoteEl.textContent = quote;
    quoteAuthorEl.textContent = author;
  });
} else {
  const storedQuote = localStorage.getItem('quote');
  if (storedQuote) {
    quoteEl.textContent = storedQuote;
  }

  const author = localStorage.getItem('author');
  if (author) {
    quoteAuthorEl.textContent = author;
  }
}
