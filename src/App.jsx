
import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiPencilLine, RiDeleteBinLine } from "react-icons/ri";
import Swal from "sweetalert2";

function App() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editBookId, setEditBookId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://backendbook-blue.vercel.app/api/books"
        );
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`https://backendbook-blue.vercel.app/api/books/${editBookId}`, formData);
        setEditMode(false);
        setEditBookId(null);
        fetchBooks();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Book updated successfully!",
        });
      } else {
        await axios.post("https://backendbook-blue.vercel.app/api/books", formData);
        fetchBooks();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Book added successfully!",
        });
      }
      setFormData({
        title: "",
        author: "",
        genre: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const handleEdit = (book) => {
    setEditMode(true);
    setEditBookId(book._id);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
    });
    Swal.fire({
      icon: "info",
      title: "Update Mode",
      text: "You are now in update mode!",
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backendbook-blue.vercel.app/api/books/${id}`);
      fetchBooks();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Book deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset current page when search query changes
  };

  // Pagination logic...
  
  return (
    <div className="container mt-4">
      <h1>Bookstore</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="border p-4">
            <h2>Add/Edit Book</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="author" className="form-label">
                  Author
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="genre" className="form-label">
                  Genre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {editMode ? "Update" : "Add"} Book
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border p-4">
            <h2>Books List</h2>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => handleEdit(book)}
                      >
                        <RiPencilLine />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(book._id)}
                      >
                        <RiDeleteBinLine />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                {/* Pagination buttons */}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;



