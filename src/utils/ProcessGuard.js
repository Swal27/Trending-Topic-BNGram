import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProcessGuard = ({ children }) => {
    const { isProcessed } = useSelector((state) => state.perform);
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        console.log(isProcessed);
        if (!isProcessed) {
            setIsBlocked(true);
        } else {
            setIsBlocked(false);
        }
    }, [isProcessed]);

    if (isBlocked) {
        return (<h3 className="text-center">
            You have never performed Processing
        </h3>);
    }

    return <>{children}</>;
};

export default ProcessGuard;
