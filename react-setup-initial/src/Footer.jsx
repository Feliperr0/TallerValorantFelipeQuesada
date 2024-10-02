import React from "react"


function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-4 w-full">
        <div className="container mx-auto flex flex-col items-center sm:flex-row justify-between px-4">
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/ValorantLatam" target="_blank" rel="noopener noreferrer">
              <svg className="w-6 h-6 fill-current text-white hover:text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .733.592 1.324 1.325 1.324h11.495v-9.294h-3.125v-3.622h3.125v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.312h3.587l-.467 3.622h-3.12v9.294h6.116c.733 0 1.325-.591 1.325-1.324v-21.351c0-.733-.592-1.325-1.325-1.325z" />
              </svg>
            </a>
            <a href="https://playvalorant.com/" target="_blank" rel="noopener noreferrer">
              <svg className="w-6 h-6 fill-current text-white hover:text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 0l-12 12 12 12 12-12-12-12zm0 3.515l8.485 8.485-8.485 8.485-8.485-8.485 8.485-8.485zm0 2.121l-6.364 6.364 6.364 6.364 6.364-6.364-6.364-6.364z" />
              </svg>
            </a>
            <a href="https://www.riotgames.com/" target="_blank" rel="noopener noreferrer">
              <svg className="w-6 h-6 fill-current text-white hover:text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 0l-12 12 12 12 12-12-12-12zm0 3.515l8.485 8.485-8.485 8.485-8.485-8.485 8.485-8.485zm0 2.121l-6.364 6.364 6.364 6.364 6.364-6.364-6.364-6.364z" />
              </svg>
            </a>
          </div>
          <p className="text-center text-xs mt-4 sm:mt-0">Made by Felipe Quesada</p>
        </div>
      </footer>
    );
  }

  export default Footer