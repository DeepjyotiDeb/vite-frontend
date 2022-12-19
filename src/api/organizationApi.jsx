import Axios from "axios";
const url = process.env.REACT_APP_AUTH_API_URL
export const getOrganizations = async () => {
    const res = await Axios.get(url+"/org/get");
    return res    
}