import React, { createContext, useContext, useEffect, useRef } from 'react';
import { driver, Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { AppMode } from '../types';
import { TOUR_STEPS } from '../utils/tourSteps';

interface TutorialContextType {
    startTour: (mode: AppMode) => void;
    isActive: boolean;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const driverRef = useRef<Driver | null>(null);
    const [isActive, setIsActive] = React.useState(false);

    useEffect(() => {
        driverRef.current = driver({
            showProgress: true,
            animate: true,
            allowClose: true,
            doneBtnText: "Concluir",
            nextBtnText: "Próximo",
            prevBtnText: "Anterior",
            progressText: "{{current}} de {{total}}",
            onDestroyed: () => setIsActive(false),
            // Custom styling class
            popoverClass: 'driverjs-theme-neon',
        });
    }, []);

    const startTour = (mode: AppMode) => {
        if (!driverRef.current) return;

        const modeSteps = TOUR_STEPS[mode] || [];
        const globalSteps = TOUR_STEPS['GLOBAL'];

        // Combine global intro steps with specific page steps if needed, 
        // or just run specific steps. For now, let's just run specific steps 
        // if they exist, otherwise fallback to a generic message or simpler tour.

        let steps = modeSteps;

        // If the array is empty, maybe we don't start the tour or we show a "Coming Soon" toast?
        // For now let's try to show global sidebar steps + generic
        if (steps.length === 0) {
            steps = globalSteps;
        }

        if (steps.length > 0) {
            setIsActive(true);
            driverRef.current.setSteps(steps);
            driverRef.current.drive();
        }
    };

    return (
        <TutorialContext.Provider value={{ startTour, isActive }}>
            {children}
        </TutorialContext.Provider>
    );
};

export const useTutorial = () => {
    const context = useContext(TutorialContext);
    if (!context) {
        throw new Error('useTutorial must be used within a TutorialProvider');
    }
    return context;
};
