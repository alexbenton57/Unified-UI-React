import React, {useEffect, useState} from "react";

// a debug hook, useful for debuggin rerenders
export default function useLogOnChange(variable, name) {

    const [callNo, setCallNo] = useState(0)

    useEffect(() => {
        console.log("change - ", name, "(call", callNo, ")", variable)
        setCallNo(callNo => callNo + 1)
    }, [variable, name])

}