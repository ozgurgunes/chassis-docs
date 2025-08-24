import React from 'react'

const Header = ({ theme, onThemeToggle }) => {
  return (
    <header className="py-large context primary">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-6">
            <h1 className="mb-0 fade-in">
              <i className="chassis-icon chassis-icon-layers me-small"></i>
              Chassis React Example
            </h1>
          </div>
          <div className="col-6 text-end">
            <button 
              className="button outline me-small"
              onClick={onThemeToggle}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              <i className={`chassis-icon chassis-icon-${theme === 'light' ? 'moon' : 'sun'}`}></i>
            </button>
            <button className="button outline me-small">Documentation</button>
            <button className="button">Get Started</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
