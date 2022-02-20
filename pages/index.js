import { useState, useEffect } from 'react'

export default function Home(props) {
    const client = props.client;
    const [messages, setMessages] = useState([]);

    const clearMessages = () => {
        setMessages((msgs) => []);
    };

    const processNewMessage = (topic, message) => {
        const payload = { topic: topic, message: JSON.parse(message.toString()) };
        // console.log(payload);
        setMessages((msgs) => [ ...msgs, payload ]);
    };

    useEffect(() => {
        client.on('message', processNewMessage);
    }, [client]);

    return (
        <div>
            <h2>Incomming Messages:</h2>
            {
                messages.map((m) => {
                    return <div key={Math.random()}>{JSON.stringify(m)}</div>
                })
            }
            <button onClick={() => clearMessages()}>Clear</button>
        </div>
    )
}
