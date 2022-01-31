import { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }){

   

    const [ user, setUser ] = useState(null);
    const [ loadingAuth, setLoadinAuth ] = useState(false);
    const [ loading, setLoading ] = useState(true);

    useEffect(()=>{

    function loadStorage(){
        const storageUser = localStorage.getItem('SistemaUser');
            if(storageUser){
            setUser(JSON.parse(storageUser));
            setLoading(false);
    }
    setLoading(false);

        }
        loadStorage();
    }, [])

//função para fazer p login do usuario

    async function signIn(email, password){
        setLoadinAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then( async (value)=> {
            let uid = value.user.uid;

            const userProfile = await firebase.firestore().collection('users')
            .doc(uid).get();

            let data = {
                uid: uid,
                nome: userProfile.data().nome,
                avatarUrl: userProfile.data().avatarUrl,
                email: value.user.email
            };

            setUser(data);
            storageUser(data);
            setLoadinAuth(false);
            toast.success('Bem vindo de volta');

        })
        .catch((error)=>{
            console.log(error);
            toast.error('Algo deu errado!')
            setLoadinAuth(false);
        })
    }

    //fazer o cadastro do usuario

    async function signUp(email, password, nome){
        setLoadinAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( async (value)=>{
            let uid = value.user.uid;

            await firebase.firestore().collection('users')
            .doc(uid).set({
                nome: nome,
                avatarUrl: null,
            })
            .then( () => {
                let data = {
                    uid: uid,
                    nome: nome,
                    email: value.user.email,
                    avatarUrl: null
                };
                setUser(data);
                storageUser(data);
                setLoadinAuth(false);
                toast.success('Bem vindo a plataforma!');
            })

        })
        .catch((error)=>{
            console.log(error);
            setLoadinAuth(false);
            toast.error('Algo deu errado!');
        })
    }
    //fim da função de cadastrar o usuario 


    function storageUser(data){
        localStorage.setItem('SistemaUser', JSON.stringify(data));
    }
//fazer o logout do usuario
    async function signOut(){
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        setUser(null);
    }

    return(
        <AuthContext.Provider 
        value={{ 
            signed: !!user,
            user,
            loading,
            signUp,
            signOut,
            signIn,
            loadingAuth,
            setUser,
            storageUser
         }}>

            {children}

        </AuthContext.Provider>
    )
}

export default AuthProvider;