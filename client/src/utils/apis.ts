import axios from "axios";

const API_URL = 'http://localhost:3003'
// const config: AxiosProxyConfig = { }


export const getConversationMsgs = (id: number) => {
	console.log("here");
	console.log(id);
	 return axios.get(`${API_URL}/msg/${id}`); 
} 