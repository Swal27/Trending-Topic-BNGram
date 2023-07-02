import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PullerGuard = ({ children }) => {
    const { isPulled } = useSelector((state) => state.perform);
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        if (!isPulled) {
            setIsBlocked(true);
        } else {
            setIsBlocked(false);
        }
    }, [isPulled]);

    if (isBlocked) {
        return (<h3 className="text-center">
            You have never performed Puller
        </h3>);
    }

    return <>{children}</>;
};

export default PullerGuard;
