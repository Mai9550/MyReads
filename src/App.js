import React,{Component} from 'react';
import { Route, Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI'
import  './App';
import './index.css';

class BookApp extends React.Component {
  bookshelves = [
    { key: 'currentlyReading', name: 'Currently Reading' },
    { key: 'wantToRead', name: 'Want to Read' },
    { key: 'read', name: 'Have Read' },
  ];

  state = {
    books: [],
    SearchBooks: [],
  };
SearchBooks = query => {
    if (query.length > 0) {
      BooksAPI.search(query).then(books => {
        if (books.error) {
          this.setState({ SearchBooks: [] });
        } else {
          this.setState({ SearchBooks: books });
        }
      });
    } else {
      this.setState({ SearchBooks: [] });
    }
  };
  resetSearch = () => {
    this.setState({ SearchBooks: [] });
  };
componentDidMount = () => {
    BooksAPI.getAll().then(books => {
      this.setState({ books: books });
    });
  };
 move = (book, shelf) => {
   BooksAPI.update(book, shelf).then(books => {
      console.log(books);
    });
 
    const updateBook = this.state.books.map(b => {
      if (b.id === book.id) {
        b.shelf = shelf;
      }
      return b;
    });

    this.setState({
      books: updateBook,
    });
  
 };
  render() {
    const { books } = this.state;
    return (
      <div className="app">
        <Route exact path="/" render={() => (
            <ListBooks bookshelves={this.bookshelves} books={books} />
          )}
        />
        <Route path="/search" render={() => <SearchBooks books={SearchBooks}
              onSearch={this.SearchBooks}
              onMove={this.moveBook}
              onResetSearch={this.resetSearch} />} />
      </div>
    );
  }
}



class SearchBooks extends Component {
  render() {
    const { books,onSearch, onResetSearch } = this.props;
    return (
          <div className="search-books">
       <SearchBar onSearch={onSearch} onResetSearch={onResetSearch}/>
        <SearchResults books={books}/>
      </div>
      )
  }
}
const SearchBar = props => {
  const { onSearch, onResetSearch } = props;
  return (
            <div className="search-books-bar">           
              <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
);
};
 const CloseSearchButton = props => {
   const { onResetSearch } = props;
 
  return (
    <Link to="/">
      <button className="close-search">Close</button>
    </Link>
  );
};

class SearchBooksInput extends Component {
  state = {
    value: '',
  };
  handleChange = event => {
    const val = event.target.value;
    this.setState({ value: val }, () => {
      this.props.onSearch(val);
    });
  };
 
  render() {
    return (
      <div className="search-books-input-wrapper">
        <input type="text" value={this.state.value}
          placeholder="Search by title or author"
          onChange={this.handleChange}
          autoFocus />
      </div>
    );
  }
}

const SearchResults = props => {
  const { books } = props;
  return (
    <div className="search-books-results">
      <ol className="books-grid">
        {books.map(book => (
          <Book key={book.id} book={book} shelf="none" />
        ))}
      </ol>
    </div>
  );
};

            
  
class ListBooks extends Component {
  render() {
    const { bookshelves,books,ifMove} = this.props;
    return (
      
    
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <Bookcase bookshelves={bookshelves} books={books} onMove={ifMove} />
        <OpenSearchButton />
      </div>
    );
  }
}

const OpenSearchButton = () => {
  return (
    <div className="open-search">
      <Link to="search">
        <button>Add a Book</button>
      </Link>
    </div>
  );
};

const Bookcase = props => {
  const { bookshelves, books } = props;
  return (
    <div className="list-books-content">
      <div>
        {bookshelves.map(shelf => (
          <Bookshelf key={shelf.key} shelf={shelf} />
        ))}
      </div>
    </div>
  );
};

const Bookshelf = props => {
  const { book,shelf } = props;
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{shelf.name}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          <Book book={{}} />
        </ol>
      </div>
    </div>
  );
};

const Book = props => {
  const { book } = props;
  return (
    <li>
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 193,
              backgroundImage:
                'url("http://books.google.com/books/content?id=PGR2Aw...")',
            }}
          />
          <BookshelfChanger />
        </div>
        <div className="book-title">To Kill a Mockingbird</div>
        <div className="book-authors">Harper Lee</div>
      </div>
    </li>
  );
};

class BookshelfChanger extends Component {
  state = {
    value: this.props.shelf,
  };
handleChange = event => {
    this.setState({ value: event.target.value });
    this.props.ifMove(this.props.book, event.target.value);
  };
  render() {
    return (
      <div className="book-shelf-changer">
                 <select value={this.state.value} onChange={this.handleChange}>
 
          <option value="move" disabled>
            Move to...
          </option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">Read</option>
          <option value="none">None</option>
        </select>
      </div>
 
         
      
)
}
}

export default BookApp
