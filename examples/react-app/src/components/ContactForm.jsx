import React, { useState } from 'react'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Product Leader',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          role: 'Product Leader',
          message: ''
        })
        setSubmitStatus(null)
      }, 2000)
    }, 1500)
  }

  const getSubmitButtonContent = () => {
    if (isSubmitting) {
      return (
        <>
          <i className="chassis-icon chassis-icon-spinner me-1"></i>
          Sending...
        </>
      )
    }
    
    if (submitStatus === 'success') {
      return (
        <>
          <i className="chassis-icon chassis-icon-check me-1"></i>
          Sent!
        </>
      )
    }
    
    return (
      <>
        <i className="chassis-icon chassis-icon-send me-1"></i>
        Send Message
      </>
    )
  }

  const getSubmitButtonClass = () => {
    let baseClass = 'button primary'
    if (isSubmitting) baseClass += ' loading'
    if (submitStatus === 'success') baseClass = 'button success'
    return baseClass
  }

  return (
    <section className="py-xlarge">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-large-8">
            <div className="card slide-up">
              <div className="card-header">
                <h4 className="mb-0">React Contact Form</h4>
                <p className="mb-0 small text-muted">
                  Demonstrating form handling with React state and Chassis styling
                </p>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-medium-6 mb-medium">
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-medium-6 mb-medium">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-medium">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-medium">
                    <label htmlFor="role" className="form-label">
                      Role
                    </label>
                    <select
                      className="form-control"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option>Product Leader</option>
                      <option>Design Leader</option>
                      <option>Development Leader</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-large">
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  
                  <div className="d-flex gap-medium">
                    <button
                      type="submit"
                      className={getSubmitButtonClass()}
                      disabled={isSubmitting}
                    >
                      {getSubmitButtonContent()}
                    </button>
                    <button 
                      type="button" 
                      className="button outline"
                      onClick={() => setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        role: 'Product Leader',
                        message: ''
                      })}
                    >
                      Reset
                    </button>
                  </div>
                </form>
                
                {submitStatus === 'success' && (
                  <div className="notification success mt-medium fade-in">
                    <i className="chassis-icon chassis-icon-check-circle me-2"></i>
                    Thank you! Your message has been sent successfully.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
