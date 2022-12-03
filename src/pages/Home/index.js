import {  useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '~/layouts/Header';
import HomeContent from '~/layouts/HomeContent';

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('chat-app-hnt'));
        if (!user) {
            document.querySelector('html').classList.remove('darkmode');
            navigate('/login');
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Header />
            <HomeContent />
        </>
    );
}

export default Home;
