export default function Job({ job, isExpanded, onToggle }) {
  return (
    <div
      className={`job-card ${isExpanded ? 'expanded' : ''}`}
      onClick={onToggle}
    >
      {/* Always visible - collapsed view */}
      <div className="job-header">
        <span className="job-role">{job.role}</span>
        <span className="job-company">{job.company}</span>
        <span className="job-location">
          {job.remote ? 'Remote' : job.location || 'On-site'}
        </span>
        <span className="expand-icon">{isExpanded ? '-' : '+'}</span>
      </div>
      {/* Only visible when expanded */}
      {isExpanded && (
        <div className="job-details">
          {job.tags && job.tags.length > 0 && (
            <div className="job-tags">
              {job.tags.map((tag, i) => (
                <span key={i} className="tag-pill">{tag}</span>
              ))}
            </div>
          )}
          <div className="job-description">
            {job.raw || 'No description available'}
          </div>
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="apply-btn"
            >
              View Original Post
            </a>
          )}
        </div>
      )}
    </div>
  );
}
