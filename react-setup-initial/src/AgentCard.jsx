import React from "react"


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

  export default AgentCard
