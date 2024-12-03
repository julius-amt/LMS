const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const booksGrid = document.getElementById("booksGrid");
const noResultsMessage = document.getElementById("noResultsMessage");
const bookCards = Array.from(document.querySelectorAll(".book-card"));
const searchIcon = document.querySelector(".search-icon"); // Select the search icon

// Add event listener for the search icon
searchIcon.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
        filterBooks(searchTerm.toLowerCase());
    }
});

// Sort functionality
sortSelect.addEventListener("change", sortBooks);

function filterBooks(searchTerm) {
    let visibleBooks = 0;

    bookCards.forEach((card) => {
        const title = card.querySelector("h2").textContent.toLowerCase();
        const author = card.querySelector("p").textContent.toLowerCase();
        const description = card
            .querySelector("p.text-gray-500")
            ?.textContent.toLowerCase();

        const isVisible =
            title.includes(searchTerm) ||
            author.includes(searchTerm) ||
            (description && description.includes(searchTerm));

        card.style.display = isVisible ? "block" : "none";
        visibleBooks += isVisible ? 1 : 0;
    });

    noResultsMessage.classList.toggle("hidden", visibleBooks > 0);
}

function sortBooks() {
    const [sortBy, order] = sortSelect.value.split("-");
    const sortedBooks = Array.from(bookCards).sort((a, b) => {
        let valueA, valueB;
        switch (sortBy) {
            case "title":
                valueA = a.querySelector("h2").textContent;
                valueB = b.querySelector("h2").textContent;
                break;
            case "author":
                valueA = a.querySelector("p").textContent;
                valueB = b.querySelector("p").textContent;
                break;
        }
        if (order === "asc") {
            return valueA.localeCompare(valueB);
        } else {
            return valueB.localeCompare(valueA);
        }
    });

    // Reorder in the DOM
    sortedBooks.forEach((book) => booksGrid.appendChild(book));
}

// View Details Button
document.querySelectorAll(".view-details-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const bookId = e.target.getAttribute("data-book-id");
        window.location.href = `/books/${bookId}`;
    });
});

async function borrowBook(bookId) {
    // const bookId = borrowButton.getAtctribute("data-book-id");

    if (!bookId) {
        console.error("Book ID not found.");
        return;
    }

    try {
        // Make the fetch request to borrow the book
        const response = await fetch(`/books/${bookId}/borrow`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            alert("Book borrowed successfully!");
            window.location.reload();
        } else {
            // Handle errors (e.g., book not available)
            const errorData = await response.json();
            alert(errorData.message || "Failed to borrow the book.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred while borrowing the book. Please try again.");
    }
}

// logout functionality
async function logoutUser() {
    try {
        const response = await fetch("/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = "/auth/login"; // replace with your login URL
            alert(data.message);
        } else {
            alert("Logout failed. Please try again.");
        }
    } catch (error) {
        console.error("Error logging out:", error);
        alert("Error logging out. Please try again.");
    }
}

// delete book functionality
async function deleteBook(bookId) {
    const confirmation = confirm("Are you sure you want to delete this book?");

    if (confirmation) {
        try {
            const response = await fetch(
                `
                    /admin/books/${bookId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                alert("Book deleted successfully");
                window.location.reload();
            } else {
                alert("Failed to delete book, please try again");
            }
        } catch (error) {
            alert("Error deleting book, try again later");
        }
    }
}
