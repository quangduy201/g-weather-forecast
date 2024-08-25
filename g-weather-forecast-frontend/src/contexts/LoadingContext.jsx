import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const LoadingContext = createContext({
    loading: false,
    showLoading: () => {},
    hideLoading: () => {},
});

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [abortController, setAbortController] = useState(null);

    const showLoading = () => {
        const controller = new AbortController();
        setLoading(true);
        setAbortController(controller);
        return controller;
    }

    const hideLoading = () => {
        if (abortController) {
            abortController.abort(); // Abort the fetch request
        }
        setLoading(false);
        setAbortController(null);
    }

    return (
        <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

LoadingProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useLoading = () => useContext(LoadingContext);
