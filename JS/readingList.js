import { getBooks, changeReadStatus, fetchBooksFromAPI, SearchFunction} from './main.js';

async function renderReadingList(filteredBooks = null) {
    const booksCardContainer = document.querySelector(".books-card");
    booksCardContainer.innerHTML = "";
    const books = filteredBooks || getBooks();
    const readBooks = books.filter(book => book.reading_status === true);

    if (readBooks.length === 0) {
        booksCardContainer.innerHTML = `<p>No read books to display</p>`;
        return;
    }

    readBooks.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-details");
        bookCard.innerHTML = `
        <div>
            <div class="book-details">
                <div class="img-book">
                    <img src=${book.cover_img}>
                </div>
                <div class="content-book">
                    <h3>${book.title}</h3>
                    <p>${book.description}</p>
                    <div class="details">
                        <div>
                            <span><b>Author:</b>${book.author}</span>
                            <span><b>Language:</b>${book.language}</span>
                        </div>
                        <div>
                            <span><b>Type:</b>${book.gener}</span>
                            <span><b>Date:</b>${book.date_added}</span>
                        </div>
                    </div>
                   <div class="bt-book" data-id=${book.id}>
                        <div class="tooltip">
                            <span class="tooltiptext">Mark as unread</span>
                            <svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 576 512" class="change-reading-status" data-id="${book.id}">
                                <path fill="#01394c" d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5l0-377.4c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8L0 454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5l0-370.3c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11L304 456c0 11.4 11.7 19.3 22.4 15.5z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        booksCardContainer.appendChild(bookCard);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchBooksFromAPI();
    renderReadingList();
    SearchFunction(renderReadingList);

    document.querySelector(".books-card").addEventListener("click", (event) => {
        const iconClicked = event.target.closest('.change-reading-status');
        
        if (iconClicked) {
            const bookId = parseInt(iconClicked.getAttribute("data-id"));
            const userConfirmed = confirm("Are you sure you want to change the reading status");

            if (userConfirmed) {
                changeReadStatus(bookId);
                renderReadingList();
            } else {
                console.log("Action canceled by the user.");
            }
        }
    });
});
