// Book object to store the book information including book's title, author and isbn
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// UI object with method that alter the layout of the page
class UI {
    addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.className = 'row book-info';
        row.innerHTML = `
            <td class="col titleTable">${book.title}</td>
            <td class="col authorTable">${book.author}</td>
            <td class="col isbnTable">${book.isbn}</td>
            <td class="col-1"><a href="#" class="delete"><i class="fas fa-minus-circle"></i></a></td>
        `;
        list.appendChild(row);
    }
    clearField() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
    showAlert(msg, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.setAttribute('role', 'alert');
        div.appendChild(document.createTextNode(msg));
        const form = document.querySelector('#book-form');
        form.appendChild(div);
        setTimeout(function() {document.querySelector('.alert').remove()}, 3000);
    }
    deleteBook(target) {
        if (target.parentElement.className === 'delete') {
            target.parentElement.parentElement.parentElement.remove(); // Remove the tr element
            this.showAlert('Book is deleted', 'alert-warning');
        }
    }
    filter(text) {
        const infoList = document.querySelectorAll('.book-info');
        infoList.forEach(info => {
            const titleValue = info.querySelector('.titleTable').textContent.toLocaleLowerCase();
            const authorValue = info.querySelector('.authorTable').textContent.toLocaleLowerCase();
            const isbnValue = info.querySelector('.isbnTable').textContent.toLocaleLowerCase();
            if (titleValue.indexOf(text) !== -1 || authorValue.indexOf(text) !== -1 || isbnValue.indexOf(text) !== -1) {
                info.style.display = "flex";
            } else {
                info.style.display = 'none';
            }
        })
    }
}
// Object that hold the static method for local storage
class Storage {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static displayBooks() {
        let books = Storage.getBooks();
        books.forEach(book => {
            const ui = new UI();
            ui.addBookToList(book);
        });
    }
    static addBook(book) {
        let books = Storage.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        let books = Storage.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}
// Render the data stored in local storage to the page
window.addEventListener('DOMContentLoaded', Storage.displayBooks);
// Event for adding book to the book list (submitting the form)
document.querySelector('#book-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Get form value
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    // Create a book object
    const book = new Book(title, author, isbn);
    const ui = new UI();
    if (title === '' || author === '' || isbn === '') {
        ui.showAlert('All fields are required', 'alert-danger');
    } else {
        ui.addBookToList(book);
        Storage.addBook(book);
        ui.clearField();
        ui.showAlert('Book is added successfully', 'alert-success');
    }
});
// Event for removing book from book list
document.querySelector('#book-list').addEventListener('click', function(e) {
    e.preventDefault();
    const ui = new UI();
    ui.deleteBook(e.target);
    const isbn = e.target.parentElement.parentElement.previousElementSibling.textContent;
    Storage.removeBook(isbn); 
});
// Event for filter the data
document.querySelector('#filter').addEventListener('keyup', function(e) {
    e.preventDefault();
    const text = e.target.value.toLowerCase();
    console.log(text);
    const ui = new UI();
    ui.filter(text);
})