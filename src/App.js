import './App.css';

//firebase
import { db, auth } from './firebaseConection'
import { 
  doc, setDoc, collection,
  addDoc, getDoc, getDocs, 
  updateDoc, deletePost, deleteDoc, 
  onSnapshot } from 'firebase/firestore'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, onAuthStateChanged } from 'firebase/auth';
//states
import { useState, useEffect } from 'react'
import { async } from '@firebase/util';


function App() {

  const [title, setTitle] = useState('')
  const [autor, setAutor] = useState('')
  const [posts, setPosts] = useState([])
  const [idPost, setIdPost] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignIn, setIsSigIn] = useState(false)
  const [userSistem, setUserSistem] = useState({})
  const [error, setError] = useState('')

  /*async function handleAdd() {
    await setDoc(doc(db, 'posts', '12345'), {
      titulo: title,
      autor: autor
    })
      .then(
        () => {
          console.log('SUCESSO NO REGISTRO!')
          setTitle('')
          setAutor('')
        }
      )
      .catch(error => console.log('Erro' + error))


  } */


  useEffect(() => {

    async function loadPosts() {

      const docRef = collection(db, 'posts')
      const setingPosts = onSnapshot(docRef, (snapshot) => {
        let postsList = []

        snapshot.forEach((doc) => {
          postsList.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        })

        setPosts(postsList)

      })
    }

    loadPosts()
  }, [])

  //mantendo o login salvo:
  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user)=>{
        if(user){
          console.log(user)
          setIsSigIn(true)
          setUserSistem({
            uid: user.uid,
            email: user.email
          })
        }else{
          setIsSigIn(false)
          setUserSistem('')

        }
      })
    }
    checkLogin()
  }, [])
  

  async function handleGetPost() {

    let postsRef = collection(db, 'posts')

    await getDocs(postsRef)
      .then(
        snapshot => {
          let list = []
          snapshot.forEach(post => {
            list.push({
              id: post.id,
              titulo: post.data().titulo,
              autor: post.data().autor
            })
          })
          setPosts(list)
        }
      )
  }

  async function handleAddAuttomatic() {

    const dataRef = collection(db, 'posts')

    await addDoc(dataRef, {
      titulo: title,
      autor: autor
    })
      .then(() => {
        console.log('Cadastrado com sucesso')
        setAutor('')
        setTitle('')
      }
      )

  }

  async function updatePost() {

    let dataRef = doc(db, 'posts', idPost)
    await updateDoc(dataRef, {
      titulo: title,
      autor: autor
    })
      .then(() => {
        console.log('post atualizado')
        setIdPost('')
        setAutor('')
        setTitle('')
      })
      .then(
        () => console.log('Erro ao atualizar o banco de dados!')
      )
  }

  async function deletePost(id) {

    const postRef = doc(db, 'posts', id)
    await deleteDoc(postRef)
      .then(
        alert('Post deletado com sucesso!')
      )
      .catch(
        console.log('Erro ao deletar o post')
      )


  }


  /* const docRef = doc(db, 'posts', '123')
  await getDoc(docRef)
  .then((snapshot)=>{
     setAutor(snapshot.data().autor)
     setTitle(snapshot.data().titulo)
   })
   .catch(
     (error)=> console.log(error)
   )*/

  async function addUser() {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(
        (value) => {
          console.log(value)
          setEmail('')
          setPassword('')
        }
      )
      .catch(
        (error) => {
          if (error.code === 'auth/weak-password') {
            alert('A senha precisa de 6 ou mais elementos')
          } else if (error.code === 'auth/email-already-in-use') {
            alert('Email já cadastrado')
          }
        }
      )
  }

  async function login() {
    await signInWithEmailAndPassword(auth, email, password)
      .then((value) => {
        console.log('Logado com sucesso')
        setUserSistem({
          uid: value.user.uid,
          email: value.user.email
        })
        setIsSigIn(true)
        setEmail('')
        setPassword('')

      })
      .catch(()=>{
        setError('Erro no login, verifique a senha e email')
      })
  }

  async function logoutUser(){
    await signOut(auth)
    setIsSigIn(false)
    setUserSistem('')
  }

  return (
    <div className="App">
      <h1>React + Firebase</h1>
      <div className="container">

        {!isSignIn &&(
          <>
          <label>
          E-mail:
          <input type='email' value={email} onChange={e => setEmail(e.target.value)} ></input><br />
        </label><br />
        <label>
          Senha :
          <input type='password' value={password} onChange={e => setPassword(e.target.value)} ></input><br />
        </label><br />
        <button onClick={addUser}>Cadastrar</button>
        <button onClick={login}>Fazer Login</button><br />
        {error!=='' && (
          <p>{error}</p>
        )}

        <hr />
        <hr /><br />
          </>
        )}

        {isSignIn &&(
          <>
          <strong>Seja bem vindo {userSistem.email}</strong><br />
          <button onClick={logoutUser}>Sair da Conta</button><br /><br />

          <label>
          ID do Post:
          <input type='text' value={idPost} onChange={e => setIdPost(e.target.value)} ></input><br />
        </label>
        <label> Título:
          <textarea
            type='text' placeholder='Digite o título' value={title}
            onChange={e => setTitle(e.target.value)}>
          </textarea>
        </label><br />

        <label> Autor:
          <input type="text" placeholder='Autor do post' value={autor}
            onChange={e => setAutor(e.target.value)
            } />
        </label><br /><br />

        <button onClick={handleAddAuttomatic} >Cadastrar</button><br />
        <button onClick={handleGetPost} >Buscar</button><br />
        <button onClick={updatePost} >Atualizar Post</button><br />

        <ul>
          {posts && posts.map(item => {
            return (
              <li key={item.id}>
                <strong>ID: {item.id}</strong><br />
                <span>Título: {item.titulo}</span><br />
                <span>Autor: {item.autor}</span><br />
                <button onClick={() => deletePost(item.id)}>Excluir</button><br /><br />
              </li>
            )
          })}
        </ul>
          </>
        )}

      </div>
    </div>
  );
}

export default App;
