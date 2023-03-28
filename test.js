const puppeteer = require('puppeteer');

async function getBooksByGenre(genre) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.goodreads.com/shelf/show/${genre}`);

  // Wait for the book list to load
  await page.waitForSelector('.bookTitle');

  // Extract book data
  const books = await page.evaluate(() => {
    const bookTitleElements = document.querySelectorAll('.bookTitle');
    const bookAuthorElements = document.querySelectorAll('.authorName');

    const books = [];

    for (let i = 0; i < bookTitleElements.length; i++) {
      const bookTitle = bookTitleElements[i].innerText;
      const bookAuthor = bookAuthorElements[i].innerText;
      books.push({ title: bookTitle, author: bookAuthor });
    }

    return books;
  });

  await browser.close();

  return books;
}

// Example usage:
getBooksByGenre('romance').then((books) => {
  console.log(books);
}).catch((err) => {
  console.error(err);
});
