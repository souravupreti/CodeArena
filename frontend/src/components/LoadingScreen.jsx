/**
 * LoadingScreen — A premium, branded loading component.
 *
 * Props:
 *   variant: 'fullscreen' | 'section' | 'inline'
 *     - fullscreen: covers entire viewport (for initial page loads)
 *     - section: fills parent container (for content sections within a page)
 *     - inline: compact loader (for components like SubmissionHistory)
 *   message: optional text to display below the spinner
 */
const LoadingScreen = ({ variant = 'fullscreen', message = '' }) => {
  if (variant === 'inline') {
    return (
      <div className="loading-inline">
        <div className="loading-dots">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
        </div>
        {message && <span className="loading-msg-sm">{message}</span>}
      </div>
    );
  }

  return (
    <div className={variant === 'fullscreen' ? 'loading-fullscreen' : 'loading-section'}>
      <div className="loading-content">
        {/* Animated logo mark */}
        <div className="loading-logo-ring">
          <div className="loading-ring" />
          <div className="loading-ring loading-ring-delay" />
          <div className="loading-logo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="loading-icon-svg"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
        </div>

        {/* Brand text */}
        <div className="loading-brand">
          <span className="loading-brand-text">Code</span>
          <span className="loading-brand-accent">Arena</span>
        </div>

        {/* Progress bar */}
        <div className="loading-bar-track">
          <div className="loading-bar-fill" />
        </div>

        {message && <span className="loading-msg">{message}</span>}
      </div>
    </div>
  );
};

export default LoadingScreen;
