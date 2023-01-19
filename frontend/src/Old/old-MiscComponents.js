export const subscribeToSocketWithTag = (subscribedTag, x = null) => {

    // a useEffect Wrapper
    const [value, setValue] = useState(x);
    const socketRef = useSocketContext();

    useEffect(() => {

        async function doSocket() {
            while (!socketRef.current) { await new Promise(res => setTimeout(res, 100)) };



            socketRef.current.addEventListener("message", (message) => {

                // need to put above event listener function in a state variable so it can be removed later
                const data = JSON.parse(message.data);
                if (data.tag === subscribedTag) {
                    setValue(data.value)
                }
            });
        }

        doSocket().catch(console.error);

    }, [subscribedTag]);

    return value;
}
