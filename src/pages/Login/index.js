import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLogin from '~/layouts/ContentLogin';
import Header from '~/layouts/Header';
import { UserContext } from '~/components/Context/UserContext';

function Login() {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
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
