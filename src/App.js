import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBe-1lkKMpZk9gKH2UMIu9_pBNBqp7IQ4w",
  authDomain: "superchat-8ea58.firebaseapp.com",
  projectId: "superchat-8ea58",
  storageBucket: "superchat-8ea58.appspot.com",
  messagingSenderId: "38545705606",
  appId: "1:38545705606:web:6d0eec684e1c315cfe1f07",
  measurementId: "G-KLFXB2V0T3"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [ user ] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
      <h1>⚛️🔥💬</h1>
      <SignOut />
      </header>
      
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const useSignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
    <button className='sign-in' onClick={useSignInWithGoogle}>Sign in with Google</button>
    </>
  )
}
function SignOut() {
  return auth.currentUser && (

    <button className='sign-out' onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {


  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behaviour: 'smooth' });


  }

  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <div ref={dummy}></div>
      </main>
      
      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder='say something nice' />

        <button type='submit' disabled={!formValue}>🕊️</button>
      </form>
      </>
  )

}

function ChatMessage (props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://storage.googleapis.com/pai-images/060362d8f84a42ae9f24b830acadb0a6.jpeg'} alt='' />
      <p>{text}</p>

    </div>
    </>)
}
export default App;
