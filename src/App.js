import './App.css';
import { initializeApp } from "firebase/app";
import { getFirestore, collection,addDoc,deleteDoc,doc,updateDoc } from "firebase/firestore";
import { useState,useCallback } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore"




const firebaseConfig = {
  apiKey: "AIzaSyA7qiQtww5YjnO7Q1E5hQTuKmk6dco0gcg",
  authDomain: "project-937ca.firebaseapp.com",
  projectId: "project-937ca",
  storageBucket: "project-937ca.appspot.com",
  messagingSenderId: "799745950299",
  appId: "1:799745950299:web:06522d5d3588a0c01b357e",
  measurementId: "G-Y1W3M24PYT"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const productConvert = {toFirestore: (product)=>{
  return {name: product.name, desc: product.desc}
},fromFirestore: (snapshot,opt) =>{
 const data = snapshot.data(opt);
 return {id: snapshot.id,name: data.name, desc: data.desc};
}};



const App = ()=>{
  const [id,setId] = useState("");
  const [name,setName] = useState("");
  const [desc,setDesc] = useState("");


const handleNameChange = useCallback((event)=>{
  setName(event.currentTarget.value)
},[]);
const handleDesc = useCallback((event)=>{
  setDesc(event.currentTarget.value)
},[]);

// Loading Empty Data

const [products,loading] = useCollectionData(collection(db,"products").withConverter(productConvert));

//Create data in FireStore
  const handleCreate = useCallback(async (e)=>{
  e.preventDefault();
  if (!name||!desc) {
    alert("Don't be Empty"); 
    return;
  }
  if(id)
  {
    const ref = doc(db,"products",id); 
    await updateDoc(ref,{
      name: name,
      desc: desc,
    });
  }
  else{
    const ref = collection(db,"products");
    await addDoc(ref,{
      name: name,
      desc: desc,
    }); 
  }
    setId("");
    setName("");
    setDesc("");
 },[id,name,desc]);
 
// Delete data from FireStore
  const handleDelete = useCallback(id=>{
    deleteDoc(doc(db,"products",id))
  },[]);

  // Update data in FireStore
  const handleUpdate = useCallback(product=>{
    setId(product.id);
    setName(product.name);
    setDesc(product.desc);
  },[]);

  return (
    <div>
      <form onSubmit={handleCreate}>
        <input type='text' placeholder='name' id='name' value={name} onChange={handleNameChange}></input>
        <input type='text' placeholder='desc' id='desc' value={desc} onChange={handleDesc}></input>
        <button type='submit'>Submit</button>
      </form>
     {loading && <span> loading ...</span>}
     {products?.map((p)=>(<li key={p.id}><span onClick={()=>handleUpdate(p)}>{p.name}-{p.desc}-{" "}</span><button type='button' onClick={()=>handleDelete(p.id)}>X</button></li>))}
    </div>
  )
} 
export default App;
