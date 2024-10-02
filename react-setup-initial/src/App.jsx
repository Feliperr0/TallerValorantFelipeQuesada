import { useState, useEffect } from 'react';
import './App.css';
import Footer from "./Footer.jsx"
import Pagination from "./Pagination.jsx"

function App() {
  const [agents, setAgents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    const callAgents = async () => {
      try {
        const response = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
        const data = await response.json();
        setAgents(data.data);
      } catch (error) {
        console.error("Can't call the agents:", error);
      } finally {
        setLoading(false);
      }
    };

    callAgents();

    const localFavorites = JSON.parse(localStorage.getItem('favorites')) || []; /// Aún no funciona :C 
    setFavorites(localFavorites);
  }, []);



  const handleRoleChange = (role) => {
    setSelectedRoles(rolesSelect =>
      rolesSelect.includes(role) ? rolesSelect.filter(r => r !== role) : [...rolesSelect, role]
    );
    setCurrentPage(1);
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
      <main className='bg bg-gray-500'>
      
        <div className=' bg-gray-900'>
          <div className="text-4xl font-bold text-red-600 p-2">VALORANT</div>
          <div className="text-2xl font-bold m-3 text-yellow-500">DISCOVER</div>
          <div className="text-2xl font-bold m-3 text-blue-400">ALL THE AGENTS!</div>
        </div>
        <div className='flex justify-end'>
          <Navbar searchText={searchText} setSearchText={handleSearchChange} />
        </div>
        <div>
          <h1>Create your team!</h1>
        </div>
        <AgentRoleCheckboxes selectedRoles={selectedRoles} handleRoleChange={handleRoleChange} />
        <div className="container mx-auto">


          <h1 className="text-3xl font-bold mb-4">Agents of Valorant</h1>
          <ButtonModal className="p-4" favorites={favorites} removeFavorite={removeFavorite}></ButtonModal>
          {loading ? (<div>Loading...</div>
          ) : (
            currentAgents.length > 0 ? (
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
            )
          )}
          <Pagination itemsPerPage={itemsPerPage}
            totalItems={filteredAgents.length}
            paginate={paginate}
            currentPage={currentPage}></Pagination>
        </div>


      </main>

      <Footer />
    </>
  );
}

function AgentCard({ agent, addFavorite, removeFavorite, isFavorite }) {
  const [details, setDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // tiemp de carga 
    const clock = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(clock);
  }, []);

  function handleClickDetails() {
    setDetails(!details);
  }

  return (
    <>
      <div className="card max-w-xs bg-gray-900 rounded-lg shadow-lg hover:scale-105 transition-transform hover:bg-gradient-to-br hover:from-red-600 hover:to-purple-600 hover:text-white m-4 sm:w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        ) : (
          <>
            <img src={agent.displayIcon} alt={agent.displayName} className="rounded-t-lg w-full" />
            <div className='p-4'>
              <h2 className="mb-2 text-xl font-bold tracking-tight text-white">{agent.displayName}</h2>
              <h2 className='mb-2 text-lg font-semibold tracking-tight text-gray-300'>Role:</h2>
              <h3 className='mb-2 text-lg font-semibold tracking-tight text-gray-300'>{agent.role.displayName}</h3>

              <button className='bg-red-500 text-black px-4 py-2 font-bold w-full' onClick={handleClickDetails}>
                {details ? 'Hide Details' : 'Read More'}
              </button>

              {details && (
                <div className='mt-4'>
                  <p className="text-gray-300">{agent.description}</p>
                </div>
              )}

              <button
                className={`mt-2 px-4 py-2 font-bold w-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'}`}
                onClick={() => isFavorite ? removeFavorite(agent) : addFavorite(agent)}
              >
                {isFavorite ? 'Remove from your team' : 'Add to your team'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}


function SearchBar({ searchText, setSearchText }) {
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 p-4 bg-gray-800 rounded-lg shadow-lg">
      <input
        type="text"
        placeholder="Search Agents..."
        value={searchText}
        onChange={handleSearchChange}
        className="p-2 w-full sm:max-w-md border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
      />
      <button
        type="button"
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md transition-transform transform hover:scale-105"
        aria-label="Search">
        🔍︎
      </button>
    </div>
  );
}

function Navbar({ searchText, setSearchText }) {
  return (

    <SearchBar searchText={searchText} setSearchText={setSearchText} />


  );
}

function AgentRoleCheckboxes({ selectedRoles, handleRoleChange }) {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
        const data = await response.json();

        const findRoles = [...new Set(data.data.map(agent => agent.role.displayName))];
        setRoles(findRoles);
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


function ButtonModal({ favorites, removeFavorite }) {
  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <>
      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => setShowFavorites(!showFavorites)}>
        {showFavorites ? 'Hide Team' : 'Show Team'}
      </button>

      {showFavorites && (
        <FavoritesModal
          favorites={favorites}
          removeFavorite={removeFavorite}
          closeModal={() => setShowFavorites(false)}
        />
      )}
    </>
  );
}

export default App;