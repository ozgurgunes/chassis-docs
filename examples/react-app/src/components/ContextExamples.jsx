import React, { useState } from 'react'

const contexts = ['primary', 'secondary', 'success', 'warning', 'danger', 'info']

const ContextCard = ({ context, onContextChange }) => {
  const getIcon = (context) => {
    const icons = {
      primary: 'star',
      secondary: 'layers',
      success: 'check-circle',
      warning: 'exclamation-triangle',
      danger: 'exclamation-circle',
      info: 'info-circle'
    }
    return icons[context] || 'circle'
  }

  return (
    <div className="col-medium-6 col-large-4 mb-large">
      <div className={`card context ${context} h-100`}>
        <div className="card-body text-center">
          <i 
            className={`chassis-icon chassis-icon-${getIcon(context)}`}
            style={{fontSize: '3rem'}}
          ></i>
          <h5 className="card-title mt-medium text-capitalize">
            {context} Context
          </h5>
          <p className="card-text">
            Interactive {context} context demonstration with React state management
          </p>
          <button 
            className={`button ${context}`}
            onClick={() => onContextChange(context)}
          >
            Change Context
          </button>
        </div>
      </div>
    </div>
  )
}

const ContextExamples = () => {
  const [selectedContext, setSelectedContext] = useState('primary')

  const handleContextChange = (currentContext) => {
    const currentIndex = contexts.indexOf(currentContext)
    const nextIndex = (currentIndex + 1) % contexts.length
    const nextContext = contexts[nextIndex]
    setSelectedContext(nextContext)
  }

  return (
    <section className="py-xlarge context alternate">
      <div className="container">
        <div className="text-center mb-xlarge">
          <h3>Interactive Context System</h3>
          <p className="lead text-muted">
            Click any button to cycle through different contexts dynamically
          </p>
          <div className="mt-medium">
            <span className="badge large primary">Current: {selectedContext}</span>
          </div>
        </div>
        
        <div className="row">
          {contexts.map(context => (
            <ContextCard 
              key={context}
              context={context}
              onContextChange={handleContextChange}
            />
          ))}
        </div>
        
        {/* Live sizing demo */}
        <div className="text-center mt-xlarge">
          <h4 className="mb-large">Dynamic Button Sizing</h4>
          <div className="d-flex gap-medium justify-content-center align-items-center flex-wrap">
            {['xsmall', 'small', 'medium', 'large', 'xlarge'].map(size => (
              <button 
                key={size}
                className={`button ${size} ${selectedContext}`}
                onClick={() => console.log(`${size} ${selectedContext} button clicked`)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContextExamples
