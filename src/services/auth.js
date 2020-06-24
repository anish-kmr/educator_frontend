import axios from 'axios'
import { BASE_URL } from './config'

console.log("config",BASE_URL)
export const createFaculty = async (name,email, password) => {
    let payload = {
        email:email,
        name: name,
        password: password
    }
    return axios.post(`${BASE_URL}/faculty/create`,payload)
}

export const createStudent = async (name,batch,year,email, password) => {
    let payload = {
        name: name,
        batch:batch,
        year: year,
        email:email,
        password: password
    }

    return axios.post(`${BASE_URL}/student/create`,payload)
}

export const authenticateStudent = (email,password) => {
    let payload = {
        email: email,
        password:password
    }
    return axios.post(`${BASE_URL}/student/authenticate`,payload)
}
export const authenticateFaculty = (email,password) => {
    let payload = {
        email: email,
        password:password
    }
    return axios.post(`${BASE_URL}/faculty/authenticate`,payload)
}