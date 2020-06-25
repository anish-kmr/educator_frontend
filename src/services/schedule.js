import axios from 'axios'
import { BASE_URL } from './config'

export const upload_schedule = (facultyId,facultyName,schedules)=>{
    let payload = {
        facultyId:facultyId,
        facultyName:facultyName,
        schedules: schedules
    }
    return axios.post(`${BASE_URL}/schedules`,payload)
}

export const get_faculty_schedules = async (facultyId)=>{
    return axios.get(`${BASE_URL}/schedules/faculty/${facultyId}`)
    
    
}