import  firebase from '../fireconfig'
const db = firebase.firestore()

export const upload_offer = (id,offer)=>{
    return db.collection('Rooms').doc(id).update({
        offer:{
            sdp:offer.sdp,
            type:offer.type
        }
    })
}
export const upload_faculty_ice_candidate =  (id,candidate) => {
    return db.collection('Rooms').doc(id).collection('hostIceCandidates').add(candidate)
}

export const create_room = (facultyId,facultyName,subject,batch,year,startTime,endTime)=>{
    return db.collection('Rooms').doc(facultyId).set({
        host_faculty:facultyName,
        subject: subject,
        batch: batch,
        year:year,
        startTime: startTime,
        endTime: endTime
    })
}
export const participant_listener = (id,callback)=>{
    db.collection("Rooms").doc(id).collection("Participants").onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(async change=>{
            if(change.type === "added"){
                callback(change.doc.id,change.doc.data())
            }
        })
    })
}

export const add_participant_ice_candidate_listener = (id,participantId,callback) =>{
    db.collection("Rooms").doc(id).collection("Participants").doc(participantId).collection("IceCandidates").onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(async change=>{
            if(change.type == "added"){
                await callback(participantId,change.doc.data())
            }
        })
    })
}

export const get_offer = async id =>{
    return db.collection("Rooms").doc(id).get().then(doc=>{
        return doc.data().offer
    }).catch(err=>{return null})
}

export const upload_participant = (id,student,answer)=>{
    return db.collection("Rooms").doc(id).collection("Participants").doc(student.uid).set({
        name:student.displayName,
        answer:{
            sdp:answer.sdp,
            type:answer.type
        }
    })
}

export const upload_student_ice_candidate = (id,participantId,candidate)=>{
    return db.collection("Rooms").doc(id).collection("Participants").doc(participantId).collection("IceCandidates").add(candidate)
}

export const add_faculty_ice_candidates_listener = (id,callback) =>{
    db.collection("Rooms").doc(id).collection('hostIceCandidates').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
                callback(change.doc.data())
            }
        });
    });
}

export const  test = ()=>{
    return db.collection('test').doc('asdasdsad').set({name:"test"})
}