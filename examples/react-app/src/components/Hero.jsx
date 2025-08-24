import React from 'react'

const Hero = () => {
  return (
    <section className="py-xlarge text-center slide-up">
      <div className="container">
        <h2 className="display-large fw-bold mb-medium">
          React + Chassis Design System
        </h2>
        <p className="lead mb-large text-muted">
          This example demonstrates how to integrate Chassis CSS framework 
          with React components using modern build tools and best practices.
        </p>
        <div className="d-flex gap-medium justify-content-center flex-wrap">
          <button className="button large primary">
            <i className="chassis-icon chassis-icon-download me-1"></i>
            Install Package
          </button>
          <button className="button large outline secondary">
            <i className="chassis-icon chassis-icon-brand-github me-1"></i>
            View on GitHub
          </button>
        </div>
        
        <div className="row mt-xlarge">
          <div className="col-large-4 mb-large">
            <div className="card h-100 text-center">
              <div className="card-body">
                <i className="chassis-icon chassis-icon-react" style={{fontSize: '3rem', color: 'var(--cx-info)'}}></i>
                <h5 className="mt-medium">React Components</h5>
                <p className="text-muted">Pre-built React components using Chassis design tokens</p>
              </div>
            </div>
          </div>
          
          <div className="col-large-4 mb-large">
            <div className="card h-100 text-center">
              <div className="card-body">
                <i className="chassis-icon chassis-icon-palette" style={{fontSize: '3rem', color: 'var(--cx-success)'}}></i>
                <h5 className="mt-medium">Design Tokens</h5>
                <p className="text-muted">Consistent design tokens automatically synced from Figma</p>
              </div>
            </div>
          </div>
          
          <div className="col-large-4 mb-large">
            <div className="card h-100 text-center">
              <div className="card-body">
                <i className="chassis-icon chassis-icon-code" style={{fontSize: '3rem', color: 'var(--cx-warning)'}}></i>
                <h5 className="mt-medium">Type Safety</h5>
                <p className="text-muted">Full TypeScript support with generated type definitions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
