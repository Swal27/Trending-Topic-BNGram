import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProcessGuard = ({ children }) => {
    const { isProccessed } = useSelector((state) => state.process);
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        if (!isProccessed) {
            setIsBlocked(true);
            console.log("not processed");
        } else {
            setIsBlocked(false);
        }
    }, [isProccessed]);

    if (isBlocked) {
        return <div>Block</div>;
    }

    return <>{children}</>;
};

export default ProcessGuard;
