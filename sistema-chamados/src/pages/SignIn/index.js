import './signin.css';
import { useState, useContext } from 'react';

import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

/*import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });*/

function SignIn(){

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const { signIn , loadingAuth } = useContext(AuthContext);

    function handleSubmit(e){
        e.preventDefault();

        if(email !== '' && password !== '' ){
            signIn(email, password)
        }

    }

    return(
        <div className="container-center">
            <div className="login">
                <div className="login-area">
                    <img src={logo} alt="Sistemas logo"/>
                </div>
                <form onSubmit={handleSubmit}>
                    <h1>Entrar</h1>
                    <input type="text" placeholder="email@email.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="*******" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button type="submit">{loadingAuth ? 'Carregando...': 'Acessar' }</button>
                </form>
                <Link to="/register">Criar uma conta</Link>

            </div>
        </div>
    );
}

export default SignIn;