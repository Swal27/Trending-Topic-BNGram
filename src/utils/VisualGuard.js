import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PullerGuard = ({ children }) => {
    const { isVisual } = useSelector((state) => state.perform);
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        if (!isVisual) {
            setIsBlocked(true);
        } else {
            setIsBlocked(false);
        }
    }, [isVisual]);

    if (isBlocked) {
        return (<h3 className="text-center">
            You have never performed Visualization
        </h3>);
    }

    return <>{children}</>;
};

export default PullerGuard;
