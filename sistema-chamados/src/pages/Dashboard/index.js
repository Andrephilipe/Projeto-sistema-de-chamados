import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../contexts/auth';
import './dashboard.css';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2, FiDelete } from 'react-icons/fi';
import { format } from 'date-fns';
import {Link } from 'react-router-dom';
import firebase from '../../services/firebaseConnection';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';



const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export default function Dashboard(){
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [ isEmpty, setIsEmpty ] = useState(false);
    const [ showPostModal, setShowPostModal ] = useState(false);
    const [ detail, setDetail ] = useState();

    const [lastDocs, setLastDocs ] = useState();

    useEffect(()=>{

        loadChamados();

        return()=>{

        }
    }, []);

    async function deleteItem(id){
        await firebase.firestore().collection('chamados').doc(id)
        .delete()
        .then(() => {
            toast.warn('Chamado deletado com sucesso!');
        })
        .catch((err) => {
            toast.error('Ops algo deu errado.');
        })
    }

    async function loadChamados(){
        await listRef.limit(5)
        .get()
        .then((snapshot)=>{
            updateState(snapshot)
        })
        .catch((err)=>{
            console.log(err);
            setLoadingMore(false);
        })

        setLoading(false);
    }

    async function updateState(snapshot){
        const isCollectionEmpty = snapshot.size === 0;

        if(!isCollectionEmpty){
            let lista = [];
            snapshot.forEach((doc)=>{
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clientedId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length -1 ];// Pegar o ultimo documento da busca

            setChamados(chamados => [...chamados, ...lista ]);
            setLastDocs(lastDoc);
        }else{
            setIsEmpty(true);
        }
        setLoadingMore(false);
    }
    async function handleMore(){
        setLoadingMore(true);
        await listRef.startAfter(lastDocs).limit(5)
        .get()
        .then((snapshot)=>{
            updateState(snapshot)
        })
    }

    function togglePostModal(item){
        setShowPostModal(!showPostModal)
        setDetail(item);
    }

    if(loading){
        return(
            <div>
                <Header/>
                <div className="content">
                    <Title name="Atendimentos">
                        <FiMessageSquare size={25}/>
                    </Title>
                    <div className="container dashboard">
                        <span>Buscando chamados....</span>
                    </div>

                </div>
            </div>
        )
    }

    return(
        <div>
            <Header/>

            <div className="content">
                <Title name="Antendimentos">
                    <FiMessageSquare size={25}/>
                </Title>
                {chamados.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum chamados registrado</span>
                            <Link to="/new" className="new">
                                <FiPlus size={25} color="#fff" />
                                Novo chamado
                            </Link>
                    </div>
                ) : (
                    <>
                        <Link to="/new" className="new">
                          <FiPlus size={25} color="#fff"/>
                          Novo Chamado
                        </Link>
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Clientes</th>
                                    <th scope="col">Assunto</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Cadastrado em</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chamados.map((item, index)=>{
                                    return(
                                        <tr key={index}>
                                            <td data-label="Cliente">{item.cliente}</td>
                                            <td data-label="Assunto">{item.assunto}</td>
                                            <td data-label="Status">
                                                <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>{item.status}</span>
                                            </td>
                                            <td data-label="Cadastrado">{item.createdFormated}</td>
                                            <td data-label="#">
                                                <button className="action" style={{backgroundColor: '#3583f6'}} onClick={ () => togglePostModal(item)}>
                                                    <FiSearch color="#fff" size={17} />
                                                </button>
                                                <Link className="action" style={{backgroundColor: '#f6a935'}} to={`/new/${item.id}`}>
                                                    <FiEdit2 color="#fff" size={17} />
                                                </Link>
                                                <Link className="action" style={{backgroundColor: 'red'}} onClick={ () => deleteItem(item.id)}>
                                                    <FiDelete color="#fff" size={17} />

                                                </Link>
                                            </td>
                                        </tr>

                                    )
                                })}
                               
                            </tbody>
                        </table>
                        {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15 }}>Buscando Chamados</h3>}
                        { !loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar Mais</button>}
                    </>
                )}
               
            </div>
            {showPostModal && (
                <Modal
                    conteudo={detail}
                    close={togglePostModal}
                />
            )}
        </div>
    )
}