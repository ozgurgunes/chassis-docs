import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ContextExamples from './components/ContextExamples'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'

function App() {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <div className="react-example">
      <Header theme={theme} onThemeToggle={toggleTheme} />
      
      <main>
        <Hero />
        <ContextExamples />
        <ContactForm />
      </main>
      
      <Footer />
    </div>
  )
}

export default App
