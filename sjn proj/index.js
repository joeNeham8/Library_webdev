console.log("This is index.js");

// Constructor for Book
function Book(id, name, author, type) {
    this.id = id;
    this.name = name;
    this.author = author;
    this.type = type;
}

// Display Constructor
function Display() {}

// Add methods to display prototype
Display.prototype.add = function (book) {
    console.log("Adding to UI");
    let tableBody = document.getElementById('tableBody');
    let uiString = `
        <tr data-id="${book.id}">
            <td>${book.name}</td>
            <td>${book.author}</td>
            <td>${book.type}</td>
            <td><button class="btn btn-sm btn-danger delete">Delete</button></td>
        </tr>`;
    tableBody.innerHTML += uiString;
};

// Implement the clear function
Display.prototype.clear = function () {
    let libraryForm = document.getElementById('libraryForm');
    libraryForm.reset();
};

// Implement the validate function
Display.prototype.validate = function (book) {
    return book.name.length >= 2 && book.author.length >= 2;
};

// Display message to user
Display.prototype.show = function (type, displayMessage) {
    let message = document.getElementById('message');
    message.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                            <strong>Message:</strong> ${displayMessage}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>`;
    setTimeout(function () {
        message.innerHTML = '';
    }, 2000);
};

// Add submit event listener to libraryForm
let libraryForm = document.getElementById('libraryForm');
libraryForm.addEventListener('submit', libraryFormSubmit);

function libraryFormSubmit(e) {
    e.preventDefault();
    console.log('You have submitted the library form');

    let name = document.getElementById('bookName').value;
    let author = document.getElementById('author').value;
    let type;
    let fiction = document.getElementById('fiction');
    let programming = document.getElementById('programming');
    let cooking = document.getElementById('cooking');

    if (fiction.checked) {
        type = fiction.value;
    } else if (programming.checked) {
        type = programming.value;
    } else if (cooking.checked) {
        type = cooking.value;
    }

    let bookId = Date.now();  // Unique ID for each book
    let book = new Book(bookId, name, author, type);
    console.log(book);

    let display = new Display();

    if (display.validate(book)) {
        display.add(book);
        display.clear();
        display.show('success', 'Your book has been successfully added');

        // Send data to the server
        fetch('http://localhost:3000/addBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: bookId, bookName: name, author: author, type: type })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Server Response:", data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        display.show('danger', 'Sorry, you cannot add this book');
    }
}

// Delete Book
document.getElementById('tableBody').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete')) {
        let bookRow = e.target.parentElement.parentElement;
        let bookId = bookRow.getAttribute('data-id'); // Get the unique ID of the book
        
        // Remove the selected book row from the table
        bookRow.remove();
        
        let display = new Display();
        display.show('success', 'The book has been deleted');

        // Send delete request to the server
        fetch(`http://localhost:3000/deleteBook/${bookId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log("Server Response:", data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
