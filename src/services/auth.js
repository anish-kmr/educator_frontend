import axios from 'axios'
import { baseUrl } from './config'

console.log("config",baseUrl)
export const createFaculty = async (name,email, password) => {
    let payload = {
        email:email,
        name: name,
        password: password
    }
    console.log("bu",baseUrl)
    return axios.post(`${baseUrl}/faculty/create`,payload)
}

export const createStudent = async (name,batch,year,email, password) => {
    let payload = {
        name: name,
        batch:batch,
        year: year,
        email:email,
        password: password
    }

    return axios.post(`${baseUrl}/student/create`,payload)
}

export const authenticateStudent = (email,password) => {
    let payload = {
        email: email,
        password:password
    }
    return axios.post(`${baseUrl}/student/authenticate`,payload)
}
export const authenticateFaculty = (email,password) => {
    let payload = {
        email: email,
        password:password
    }
    return axios.post(`${baseUrl}/faculty/authenticate`,payload)
}