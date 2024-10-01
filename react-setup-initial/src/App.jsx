import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [agents, setAgents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
      .then(response => response.json())
      .then(data => {
        setAgents(data.data);
      })
      .catch(error => {
        console.error('Error fetching the agents:', error);
      });
  }, []);

  const handleRoleChange = (role) => {
    setSelectedRoles(prevRoles =>
      prevRoles.includes(role)
        ? prevRoles.filter(r => r !== role)
        : [...prevRoles, role]
    );
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearchText = agent.displayName.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(agent.role.displayName);
    return matchesSearchText && matchesRole;
  });

  return (
    <>
      <div className='flex justify-end'>
        <Navbar searchText={searchText} setSearchText={setSearchText} />
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
        <div className="cards-container flex flex-wrap justify-center">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.uuid} agent={agent} />
          ))}
        </div>
      </div>
    </>
  );
}

function AgentCard({ agent }) {
  return (
    <div className="card max-w-sm bg-white rounded-lg shadow-md hover:scale-105 transition-transform hover:bg-gradient-to-br hover:from-red-500 hover:to-purple-500 hover:text-white m-4 sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
      <img src={agent.displayIcon} alt={agent.displayName} className="rounded-t-lg w-full" />
      <div className='p-5'>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{agent.displayName}</h2>
        <h3 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>{agent.role.displayName}</h3>
        <p className="mb-3 font-normal text-gray-900">{agent.description}</p>
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
        placeholder="Buscar agentes..."
        value={searchText}
        onChange={handleSearchChange}
        className="p-2 mb-2 w-full max-w-md border border-gray-300 rounded"
      />
      <button
        type="button"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md"
        aria-label="Buscar"
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

export default App;