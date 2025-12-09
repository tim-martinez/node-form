function FormSection({ section, formData, onChange }) {
  return (
    <div className="form-section">
      <h2 className="section-title">{section.title}</h2>
      <div className="questions">
        {section.questions.map((question) => (
          <div key={question.id} className="form-group">
            <label htmlFor={question.id} className="form-label">
              {question.label}
              {question.required && <span className="required">*</span>}
            </label>

            {question.type === 'text' && (
              <input
                type="text"
                id={question.id}
                name={question.id}
                value={formData[question.id] || ''}
                onChange={onChange}
                required={question.required}
                className="form-input"
              />
            )}

            {question.type === 'number' && (
              <input
                type="number"
                id={question.id}
                name={question.id}
                value={formData[question.id] || ''}
                onChange={onChange}
                required={question.required}
                className="form-input"
              />
            )}

            {question.type === 'date' && (
              <input
                type="date"
                id={question.id}
                name={question.id}
                value={formData[question.id] || ''}
                onChange={onChange}
                required={question.required}
                className="form-input"
              />
            )}

            {question.type === 'select' && (
              <select
                id={question.id}
                name={question.id}
                value={formData[question.id] || ''}
                onChange={onChange}
                required={question.required}
                className="form-select"
              >
                <option value="">Select an option</option>
                {question.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FormSection
