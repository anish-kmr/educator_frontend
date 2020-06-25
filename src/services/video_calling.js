import  firebase from '../fireconfig'
const db = firebase.firestore()

export const createRoom = (facultyId,facultyName,subject,batch,year,startTime,endTime)=>{
    
}

export const  test = ()=>{
    return db.collection('test').doc('asdasdsad').set({name:"test"})
}