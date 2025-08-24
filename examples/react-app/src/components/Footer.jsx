import React from 'react'

const Footer = () => {
  return (
    <footer className="py-large context primary mt-auto">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-medium-6">
            <h6 className="mb-small">
              <i className="chassis-icon chassis-icon-react me-small"></i>
              Chassis React Example
            </h6>
            <p className="mb-0 small">
              Demonstrating React integration with Chassis design system components and state management.
            </p>
          </div>
          <div className="col-medium-6 text-medium-end mt-medium mt-medium-0">
            <div className="d-flex gap-small justify-content-center justify-content-medium-end">
              <button className="button small outline">
                <i className="chassis-icon chassis-icon-book me-1"></i>
                Docs
              </button>
              <button className="button small outline">
                <i className="chassis-icon chassis-icon-brand-github me-1"></i>
                GitHub
              </button>
              <button className="button small outline">
                <i className="chassis-icon chassis-icon-brand-npm me-1"></i>
                NPM
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
