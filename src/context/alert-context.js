import React, { useContext, useState, useEffect } from 'react';
import SnackbarAlert from '@/components/SnackbarAlert';

const AlertContext = React.createContext();

const AlertProvider = ({ children }) => {
    const [alertMessage, setAlertMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);

    return (
        <AlertContext.Provider
            value={{
                alertMessage,
                setAlertMessage,
                isError,
                setIsError,
                alertOpen,
                setAlertOpen,
            }}
        >
            {alertOpen && <SnackbarAlert />}
            {children}
        </AlertContext.Provider>
    );
};

export const useAlertContext = () => {
    return useContext(AlertContext);
};

export { AlertContext, AlertProvider };
