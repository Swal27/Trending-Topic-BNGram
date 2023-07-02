import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PreprocessGuard = ({ children }) => {
    const { isPreProcessed } = useSelector((state) => state.perform);
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        if (!isPreProcessed) {
            setIsBlocked(true);
        } else {
            setIsBlocked(false);
        }
    }, [isPreProcessed]);

    if (isBlocked) {
        return (<h3 className="text-center">
            You have never performed Pre processing
        </h3>);
    }

    return <>{children}</>;
};

export default PreprocessGuard;
