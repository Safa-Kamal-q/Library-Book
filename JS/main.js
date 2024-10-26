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
    alert("The book added successfully, you can see it in the book cards")
}

function changeReadStatus(bookId, bookCard = null) {
    const books = getBooks();
    const book = books.find(b => b.id === bookId);

    if (book) {
        book.reading_status = !book.reading_status;

        if (bookCard) {
            const tooltip = bookCard.querySelector('.tooltiptext');
            const iconPath = bookCard.querySelector('path'); 

            tooltip.textContent = book.reading_status ? 'Mark as unread' : 'Mark as read';

            bookCard.querySelector('.bg-book').style.border = book.reading_status ? '2px solid green' : '';

            if (book.reading_status) {
                iconPath.setAttribute('fill', '#01394c'); 
                iconPath.setAttribute('d', 'M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5l0-377.4c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8L0 454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5l0-370.3c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11L304 456c0 11.4 11.7 19.3 22.4 15.5z');
            } else {
                iconPath.setAttribute('fill', '#37405f'); 
                iconPath.setAttribute('d', 'M0 96C0 43 43 0 96 0l96 0 0 190.7c0 13.4 15.5 20.9 26 12.5L272 160l54 43.2c10.5 8.4 26 .9 26-12.5L352 0l32 0 32 0c17.7 0 32 14.3 32 32l0 320c0 17.7-14.3 32-32 32l0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0L96 512c-53 0-96-43-96-96L0 96zM64 416c0 17.7 14.3 32 32 32l256 0 0-64L96 384c-17.7 0-32 14.3-32 32z');
            }
        }
        
        localStorage.setItem("books", JSON.stringify(books));
        alert("The reading status changed successfully");
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
