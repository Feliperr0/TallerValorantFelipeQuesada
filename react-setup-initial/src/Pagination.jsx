import React from "react"


function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav className="bg-gray-900 p-4 rounded-lg shadow-lg">
        <ul className="pagination flex justify-center space-x-2">
          {pageNumbers.map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'} rounded-full`}>
              <button
                onClick={() => paginate(number)}
                className={`page-link px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-110 ${currentPage === number ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  export default Pagination