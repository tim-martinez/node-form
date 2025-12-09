function Sidebar({ sections, currentSection, sectionProgress, onSectionClick }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Progress</h2>
      </div>
      <nav className="sidebar-nav">
        {sections.map((section, index) => {
          const progress = sectionProgress[section.id] || 0
          const isActive = currentSection === index
          const isComplete = progress === 100

          return (
            <button
              key={section.id}
              className={`sidebar-item ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
              onClick={() => onSectionClick(index)}
            >
              <div className="sidebar-item-content">
                <span className="section-number">{index + 1}</span>
                <span className="section-title">{section.title}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{progress}%</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
