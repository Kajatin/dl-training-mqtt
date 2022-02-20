import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import mqtt from 'mqtt'

export default function App({ Component, pageProps }) {
    const router = useRouter();

    const broker = process.env.NEXT_PUBLIC_MQTT_URI;
    const options = {
        port: 8884,
        protocol: 'mqtts',
        clientId: process.env.NEXT_PUBLIC_MQTT_CLIENTID,
        username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
        password: process.env.NEXT_PUBLIC_MQTT_PASSWORD
    }
    const client = mqtt.connect(broker, options);

    client.on('connect', () => {
        console.log("connected 2");
        client.subscribe('api/post/f1/#');
    });
    client.on('reconnect', () => {
    });
    client.on('disconnect', () => {
    });
    client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
    });

    useEffect(() => {
        // We can't use router.query because it's delayed.
        // So we do it manually:
        const query = new URLSearchParams(router?.asPath?.split(/\?/)?.[1]);

        if (query?.get('auth_key')) {
            Cookies.set('authorization', query?.get('auth_key'), {
                // expires: 10000,
                secure: true,
                sameSite: 'strict',
            });
            router.replace(router.pathname);
        }
    }, [router?.asPath?.split(/\?/)?.[1]]);

    return <Component {...pageProps} client={client} />
}
