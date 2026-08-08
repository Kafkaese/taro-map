import React from 'react';

import './ErrorBoundary.css';

/**
 * Catches JS errors thrown while rendering anywhere in its child tree and
 * shows a fallback UI instead of the blank page React leaves behind by
 * default. Must be a class component - React has no hook equivalent of
 * getDerivedStateFromError/componentDidCatch.
 *
 * @param {function} [reload] Called when the Reload button is clicked - defaults to a real window.location.reload(). Overridable so tests can verify the button is wired up correctly without needing to intercept window.location.reload() itself, which recent jsdom versions make impossible: its 'reload' property (and window.location as a whole) is non-configurable and non-writable, so none of Object.defineProperty, jest.spyOn, or even jest.replaceProperty (added specifically for this kind of case) can touch it.
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

    handleReload = () => {
        (this.props.reload || (() => window.location.reload()))();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-fallback">
                    <h1>Something went wrong</h1>
                    <p>Please try reloading the page.</p>
                    <button onClick={this.handleReload}>Reload</button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
