import { fetchBooksFromAPI, getBooks, addBook, changeReadStatus, SearchFunction } from './main.js';

let currentPage = 1;
const itemsPerPage = 10;

function renderMyLibrary(filteredBooks = null, page = 1) {
    const bookList = document.querySelector(".book-list");
    bookList.innerHTML = "";

    const books = filteredBooks || getBooks();
    const totalItems = books.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const paginatedBooks = books.slice(start, end);

    if (paginatedBooks.length === 0) {
        bookList.innerHTML = `<p>No books to display</p>`;
        renderPaginationControls(totalPages, page);
        return;
    }

    paginatedBooks.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        bookCard.innerHTML = `
            <div class="bg-book">
                <img class="img-book" src="${book.cover_img || 'https://via.placeholder.com/150'}" alt="${book.title}">
                <div>
                    <span class="genre">${book.genre || "Unknown Genre"}</span>
                    <h3 style="margin-top: 5px;">${book.title}</h3>
                    <label>${book.author}</label>

                    <div class="bt-book">
                        <div class="tooltip" style="margin-top: 0;">
                            <span class="tooltiptext">${book.reading_status ? "Mark as unread" : "Mark as read"}</span>
                            <svg class="mark-read-icon" data-id="${book.id}" xmlns="http://www.w3.org/2000/svg" height="20" width="22.5" viewBox="0 0 576 512">
                                <path fill="${book.reading_status ? '#01394c' : '#37405f'}" 
                                    d="${book.reading_status
                ? 'M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5l0-377.4c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8L0 454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5l0-370.3c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11L304 456c0 11.4 11.7 19.3 22.4 15.5z'
                : 'M0 96C0 43 43 0 96 0l96 0 0 190.7c0 13.4 15.5 20.9 26 12.5L272 160l54 43.2c10.5 8.4 26 .9 26-12.5L352 0l32 0 32 0c17.7 0 32 14.3 32 32l0 320c0 17.7-14.3 32-32 32l0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0L96 512c-53 0-96-43-96-96L0 96zM64 416c0 17.7 14.3 32 32 32l256 0 0-64L96 384c-17.7 0-32 14.3-32 32z'}" />
                            </svg>
                        </div>
                        <div class="view-book" data-id-model="${book.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="22.5" viewBox="0 0 576 512">
                                <path fill="#37405f" d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (book.reading_status) {
            bookCard.querySelector('.bg-book').style.border = "2px solid #798897";
        }

        bookList.appendChild(bookCard);
    });

    document.querySelectorAll(".view-book").forEach(button => {
        button.addEventListener("click", openModalView);
    });

    renderPaginationControls(totalPages, page);
}

function setupAddBookForm() {
    const addButton = document.getElementById("btn-add");
    const formBook = document.getElementById("form-book");
    const submitButton = formBook.querySelector(".submit-button button");
    const books = getBooks();

    formBook.style.display = "none";
    addButton.style.right = "0";

    addButton.addEventListener("click", () => {
        if (formBook.style.display === "none") {
            formBook.style.display = "block";
            addButton.style.right = "36%";
        } else {
            formBook.style.display = "none";
            addButton.style.right = "0";
        }
    });

    submitButton.addEventListener("click", () => {
        const title = document.getElementById("title-book").value;
        const description = document.getElementById("desc-book").value;
        const author = document.getElementById("author-book").value;
        const language = document.getElementById("language-book").value;
        const genre = document.getElementById("genre-book").value;
        const cover_img = document.getElementById("url-img").value;

        if (!title || !author || !language) {
            alert("Please enter the Title, Author, and Language for the book.");
            return;
        }

        const newBook = {
            id: books.length,
            title: title,
            description: description,
            author: author,
            language: language,
            genre: genre,
            cover_img: cover_img,
            date_added: Date.now(),
            reading_status: false,
        };

        addBook(newBook);
        renderMyLibrary(getBooks(), currentPage);
        formBook.style.display = "none";
    });
}

function setupModalView() {
    const modal = document.getElementById("modal-book");
    const closeButton = modal.querySelector(".close");
    const btnClose = document.getElementById("btn-close");

    closeButton.onclick = btnClose.onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function openModalView(event) {
    const bookId = parseInt(event.currentTarget.getAttribute("data-id-model"));
    const book = getBooks().find(book => book.id === bookId);
    const modal = document.getElementById("modal-book");

    modal.querySelector(".sec-1 img").src = book.cover_img || "https://via.placeholder.com/150";
    modal.querySelector(".sec-2 h1").textContent = book.title;
    modal.querySelector(".sec-2 .author-name span").textContent = book.author;
    modal.querySelector(".sec-2 p").textContent = book.description;
    modal.querySelector("#model-book-genre").textContent = book.genre;
    modal.querySelector("#model-book-language").textContent = book.language;
    modal.querySelector("#model-added-date").textContent = `Added Date: ${book.date_added}`;

    modal.style.display = "block";
}

function renderPaginationControls(totalPages, currentPage) {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.classList.add("page-button");
        pageButton.textContent = i;
        if (i === currentPage) pageButton.classList.add("active");

        pageButton.addEventListener("click", () => {
            currentPage = i;
            renderMyLibrary(getBooks(), currentPage);
        });

        paginationContainer.appendChild(pageButton);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchBooksFromAPI();
    renderMyLibrary(getBooks(), currentPage);

    SearchFunction(renderMyLibrary);
    setupAddBookForm();
    setupModalView();

    document.querySelector(".book-list").addEventListener("click", (event) => {
        const iconClicked = event.target.closest('.mark-read-icon');

        if (iconClicked) {
            const bookId = parseInt(iconClicked.getAttribute("data-id"));
            const userConfirmed = confirm("Are you sure you want to mark this book as read?");
            const bookCard = iconClicked.closest(".book-card");

            if (userConfirmed) {
                changeReadStatus(bookId, bookCard);
            } else {
                console.log("Action canceled by the user.");
            }
        }
    });
});