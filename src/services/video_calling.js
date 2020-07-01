import  firebase from '../fireconfig'
const db = firebase.firestore()
const rtdb = firebase.database()

const delete_existing_host_candidates = async id=>{
    return db.collection("Rooms").doc(id).collection("hostIceCandidates").get().then(querySnapshot=>{
        querySnapshot.forEach(async doc=>{
            await db.collection("Rooms").doc(id).collection("hostIceCandidates").doc(doc.id).delete()
        })
    })
}
const delete_existing_participant_candidates = async (id,participantId)=>{
    return db.collection("Rooms").doc(id).collection("Participants").doc(participantId).collection("IceCandidates").get().then(querySnapshot=>{
        querySnapshot.forEach(async doc=>{
            await db.collection("Rooms").doc(id).collection("Participants").doc(participantId).collection("IceCandidates").doc(doc.id).delete()
        })
    })
}

export const upload_offer = (id,offer)=>{
    return db.collection('Rooms').doc(id).update({
        offer:{
            sdp:offer.sdp,
            type:offer.type
        }
    })
}
export const upload_faculty_ice_candidate =  async (id,candidate) => {
    await delete_existing_host_candidates(id)
    return db.collection('Rooms').doc(id).collection('hostIceCandidates').add(candidate)
}

export const upload_student_ice_candidate = async (id,participantId,candidate)=>{
    await delete_existing_participant_candidates(id,participantId)
    return db.collection("Rooms").doc(id).collection("Participants").doc(participantId).collection("IceCandidates").add(candidate)
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

export const add_faculty_ice_candidates_listener = (id,callback) =>{
    db.collection("Rooms").doc(id).collection('hostIceCandidates').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
                callback(change.doc.data())
            }
        });
    });
}


export const send_video_mute_event = (id,ismuted)=>{
    console.log("Creating path ",`rooms/${id}/host_video_muted : ${ismuted}`)
    rtdb.ref(`rooms/${id}/host_video_muted`).set(ismuted,err=>{
        if(err) console.log("error esnding event",err)
        else console.log("Successfully Sent event")
    })
}
export const send_audio_mute_event = (id,ismuted)=>{
    console.log("Creating path ",`rooms/${id}/host_audio_muted : ${ismuted}`)
    rtdb.ref(`rooms/${id}/host_audio_muted`).set(ismuted,err=>{
        if(err) console.log("error sending event",err)
        else console.log("Successfully Sent event")
    })
}

export const listen_video_mute_event = (id,callback)=>{
    rtdb.ref(`rooms/${id}/host_video_muted`).on('value',snapshot => {
        console.log("Event fired",snapshot.val())
        callback(snapshot.val())
    })
}

export const listen_audio_mute_event = (id,callback)=>{
    rtdb.ref(`rooms/${id}/host_audio_muted`).on('value',snapshot => {
        console.log("Event fired",snapshot.val())
        callback(snapshot.val())
    })
}

export const  test = ()=>{
    return db.collection('test').doc('asdasdsad').set({name:"test"})
}