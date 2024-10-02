import React from "react";

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

  export default AgentRoleCheckboxes