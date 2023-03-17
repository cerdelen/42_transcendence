import axios from "axios";
import { ConversationType } from './types';

const API_URL = 'http://localhost:3003'
// const config: AxiosProxyConfig = { }


export const getConversationMsgs = (id: number) => {
	console.log("here");
	console.log(id);
	 return axios.get(`${API_URL}/msg/${id}`); 
} 

export const getConversations = () => {
	return axios.get(`/conversation/`);
}