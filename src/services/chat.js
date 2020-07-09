import  firebase from '../fireconfig'
const rtdb = firebase.database()

export const send_message = async (roomId,senderId,senderName,message) => {
    let doubtref = rtdb.ref(`rooms/${roomId}/doubts`).push()
    return doubtref.set(
        {
            senderId:senderId,
            senderName:senderName,
            message:message
        },
        err=>{
            if(err) return false
            else return true
        }
    )
}

export const message_listener =(roomId,callback)=>{
    console.log("Setting listener")
    rtdb.ref(`rooms/${roomId}/doubts`).on('child_added',async data=>{
        console.log("Message",data)
        callback(data)
    })
    console.log("listener set")
}

export const fetch_messages = (roomId, callback)=>{
    console.log("Fetching messages")
    // rtdb.ref(`rooms/${roomId}/doubts`).once('value',async data=>{
    //     console.log("Message",data)
    //     callback(data)
    // })
    
}