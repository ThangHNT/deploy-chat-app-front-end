import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLogin from '~/layouts/ContentLogin';
import Header from '~/layouts/Header';

function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('chat-app-hnt'));
        if (user) {
            navigate('/');
        }
    });

    return (
        <>
            <Header />
            <ContentLogin />
        </>
    );
}

export default Login;
