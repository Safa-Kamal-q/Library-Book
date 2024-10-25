const getApiURL = "https://my.api.mockaroo.com/Book.json?key=c7b763e0";

async function fetchBooksFromAPI() {
    if (!localStorage.getItem("books")) {
        try {
            const response = await fetch(getApiURL);
            const books = await response.json();
            localStorage.setItem("books", JSON.stringify(books));
        } catch (error) {
            console.error("Error fetching books from API:", error);
        }
    }
}

function getBooks() {
    return JSON.parse(localStorage.getItem("books")) || [];
}

function addBook(book) {
    const books = getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
}

function changeReadStatus(bookId) {
    const books = getBooks();
    const book = books.find(b => b.id === bookId);
    if (book) {
        book.reading_status = !book.reading_status;
        localStorage.setItem("books", JSON.stringify(books));
    }
}

function SearchFunction(renderFunction) {
    const filterButton = document.getElementById("filterButton");
    const filterOptions = document.getElementById("filterOptions");
    const searchInput = document.querySelector(".search-books input[type='search']");
    let selectedFilter = "title";

    filterButton.addEventListener("click", () => {
        filterOptions.style.display = filterOptions.style.display === "none" || filterOptions.style.display === "" ? "block" : "none";
    });

    filterOptions.addEventListener("click", (event) => {
        const selectedOption = event.target;
        if (selectedOption.tagName === 'LI') {
            selectedFilter = selectedOption.getAttribute('data-filter');
            searchInput.placeholder = `Search by ${selectedOption.textContent}`;
            filterOptions.style.display = "none";
        }
    });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const books = getBooks();

        const filteredBooks = books.filter(book => {
            return book[selectedFilter].toLowerCase().includes(query);
        });

        renderFunction(filteredBooks);
    });
}

export { fetchBooksFromAPI, getBooks, addBook, changeReadStatus, SearchFunction };
