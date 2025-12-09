import { useState, useEffect } from 'react'
import { formSections } from '../formData'
import Sidebar from './Sidebar'
import FormSection from './FormSection'

function Form() {
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState({})
  const [sectionProgress, setSectionProgress] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    calculateProgress()
  }, [formData])

  const calculateProgress = () => {
    const progress = {}
    formSections.forEach((section) => {
      const answeredQuestions = section.questions.filter(
        (q) => formData[q.id] && formData[q.id] !== ''
      ).length
      const totalQuestions = section.questions.length
      progress[section.id] = Math.round((answeredQuestions / totalQuestions) * 100)
    })
    setSectionProgress(progress)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSectionClick = (index) => {
    setCurrentSection(index)
  }

  const handleNext = () => {
    if (currentSection < formSections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('http://localhost:3000/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        const result = await response.json()
        setSubmitMessage('Form submitted successfully!')
        setFormData({})
        setCurrentSection(0)
      } else {
        setSubmitMessage('Error submitting form. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('Error connecting to server. Please try again.')
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLastSection = currentSection === formSections.length - 1
  const totalProgress = Object.values(sectionProgress).reduce((a, b) => a + b, 0) / formSections.length

  return (
    <div className="form-container">
      <Sidebar
        sections={formSections}
        currentSection={currentSection}
        sectionProgress={sectionProgress}
        onSectionClick={handleSectionClick}
      />

      <main className="form-main">
        <div className="form-header">
          <h1>Facility Questionnaire</h1>
          <div className="overall-progress">
            <span>Overall Progress: {Math.round(totalProgress)}%</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <FormSection
            section={formSections[currentSection]}
            formData={formData}
            onChange={handleInputChange}
          />

          <div className="form-navigation">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="btn btn-secondary"
            >
              Previous
            </button>

            {!isLastSection ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>

          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('successfully') ? 'success' : 'error'}`}>
              {submitMessage}
            </div>
          )}
        </form>
      </main>
    </div>
  )
}

export default Form
