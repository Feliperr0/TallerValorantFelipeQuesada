import { useState, useEffect } from 'react';
import './App.css';
function App() {
  const [agents, setAgents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const CallAGents = async () => {
      try {
        const response = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
        const data = await response.json();
        setAgents(data.data);
      } catch (error) {
        console.error("Can't call the agents:", error);
      }
    };
  
    CallAGents();
  
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  console.log(favorites);

  const handleRoleChange = (role) => {
    setSelectedRoles(rolesS =>
      rolesS.includes(role) ? rolesS.filter(r => r !== role) : [...rolesS, role]
    );
    setCurrentPage(1); // 
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    setCurrentPage(1); // con esto se controla que se renderice la primera página cuando se cambia el texto de búsqueda
  };

  const addFavorite = (agent) => {
    if (favorites.length < 5) {
      setFavorites([...favorites, agent]);
    } else {
      alert('Maximum agent limit reached (5)');
    }
  };

  const removeFavorite = (agent) => {
    setFavorites(favorites.filter(fav => fav.uuid !== agent.uuid));
  };

  const filteredAgents = agents.filter(agent => {
    const findSearchText = agent.displayName.toLowerCase().includes(searchText.toLowerCase());
    const findRole = selectedRoles.length === 0 || selectedRoles.includes(agent.role.displayName);
    return findSearchText && findRole;
  });

  // control de páginacion
  const indexOfLastAgent = currentPage * itemsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - itemsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);
  console.log(currentAgents)

  // para cambiar la págiba
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className='flex justify-end'>
        <Navbar searchText={searchText} setSearchText={handleSearchChange} />
      </div>
      <div className="text-xl text-left font-bold text-red-600">VALORANT</div>
      <div className="text-xl text-left font-bold">DISCOVER</div>
      <div className="text-xl text-left font-bold">ALL THE AGENTS!</div>
      <div>
        <h1>Create your team!</h1>
      </div>
      <AgentRoleCheckboxes selectedRoles={selectedRoles} handleRoleChange={handleRoleChange} />
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Agents of Valorant</h1>
        {currentAgents.length > 0 ? (
          <div className="cards-container flex flex-wrap justify-center">
            {currentAgents.map((agent) => (
              <AgentCard
                key={agent.uuid}
                agent={agent}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
                isFavorite={favorites.some(fav => fav.uuid === agent.uuid)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-500">No agents found</p>
        )}
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredAgents.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setShowFavorites(!showFavorites)}
      >
        {showFavorites ? 'Hide Team' : 'Show Team'}
      </button>
      {showFavorites && (
        <FavoritesModal favorites={favorites} removeFavorite={removeFavorite} closeModal={() => setShowFavorites(false)} />
      )}
    </>
  );
}


function AgentCard({ agent, addFavorite, removeFavorite, isFavorite }) {
  const [details, setDetails] = useState(false);

  function handleClickDetails() {
    setDetails(!details);
  }

  return (
    <div className="card max-w-xs bg-gray-900 rounded-lg shadow-lg hover:scale-105 transition-transform hover:bg-gradient-to-br hover:from-red-600 hover:to-purple-600 hover:text-white m-4 sm:w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
      <img src={agent.displayIcon} alt={agent.displayName} className="rounded-t-lg w-full" />
      <div className='p-4'>
        <h2 className="mb-2 text-xl font-bold tracking-tight text-white">{agent.displayName}</h2>
        <h2 className='mb-2 text-lg font-semibold tracking-tight text-gray-300'>Role:</h2>
        <h3 className='mb-2 text-lg font-semibold tracking-tight text-gray-300'>{agent.role.displayName}</h3>
      
        <button className='bg-yellow-500 text-black px-4 py-2 font-bold w-full' onClick={handleClickDetails}>
          {details ? 'Hide Details' : 'Read More'}
        </button>

        {details && (
          <div className='mt-4'>
            <p className="text-gray-300">{agent.description}</p>
          </div>
        )}

        <button
          className={`mt-2 px-4 py-2 font-bold w-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-green-500 text-black'}`}
          onClick={() => isFavorite ? removeFavorite(agent) : addFavorite(agent)}
        >
          {isFavorite ? 'Remove from your team' : 'Add to your team'}
        </button>
      </div>
    </div>
  );
}

function SearchBar({ searchText, setSearchText }) {
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Search Agents..."
        value={searchText}
        onChange={handleSearchChange}
        className="p-2 mb-2 w-full max-w-md border border-gray-300 rounded"
      />
      <button
        type="button"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md"
        aria-label="Search"
      >
        🔍︎
      </button>
    </div>
  );
}

function Navbar({ searchText, setSearchText }) {
  return (
    <div className='flex justify-end border-solid border-2 bg-white shadow-xl p-4'>
      <SearchBar searchText={searchText} setSearchText={setSearchText} />
    </div>
  );
}

function AgentRoleCheckboxes({ selectedRoles, handleRoleChange }) {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
        const data = await response.json();

        const uniqueRoles = [...new Set(data.data.map(agent => agent.role.displayName))];
        setRoles(uniqueRoles);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
      {roles.map(role => (
        <div key={role} className="flex justify-center items-center mb-2">
          <input
            type="checkbox"
            id={role}
            className="mr-2"
            checked={selectedRoles.includes(role)}
            onChange={() => handleRoleChange(role)}
          />
          <label htmlFor={role} className="text-sm">{role}</label>
        </div>
      ))}
    </div>
  );
}

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
function FavoritesModal({ favorites, removeFavorite, closeModal }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            {favorites.length > 0 ? "Your Team" : "Empty Team"}
          </h2>
          <button className="text-white text-xl border-solid bg-red-600" onClick={closeModal}>Hide Team</button>
        </div>
        {favorites.length > 0 ? (
          <div className="flex flex-wrap justify-center">
            {favorites.map((agent) => (
              <div key={agent.uuid} className="card max-w-xs bg-gray-900 rounded-lg shadow-lg m-4">
                <img src={agent.displayIcon} alt={agent.displayName} className="rounded-t-lg w-full" />
                <div className='p-4'>
                  <h2 className="mb-2 text-xl font-bold tracking-tight text-white">{agent.displayName}</h2>
                  <h2 className='mb-2 text-lg font-semibold tracking-tight text-gray-300'>Role:</h2>
                  <h3 className='mb-2 text-lg font-semibold tracking-tight text-gray-300'>{agent.role.displayName}</h3>
                  <button className="mt-2 bg-red-500 text-white px-4 py-2 font-bold w-full"
                   onClick={() => removeFavorite(agent)} >  Remove from your team  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-500">Your team is Empty</p>
        )}
      </div>
    </div>
  );
}


export default App;