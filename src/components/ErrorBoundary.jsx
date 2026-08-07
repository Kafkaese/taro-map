import React from 'react';

import './ErrorBoundary.css';

/**
 * Catches JS errors thrown while rendering anywhere in its child tree and
 * shows a fallback UI instead of the blank page React leaves behind by
 * default. Must be a class component - React has no hook equivalent of
 * getDerivedStateFromError/componentDidCatch.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error in component tree:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-fallback">
                    <h1>Something went wrong</h1>
                    <p>Please try reloading the page.</p>
                    <button onClick={() => window.location.reload()}>Reload</button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
