import { useContext, useEffect, useState } from "react";
import JSCookies from "js-cookie";
import "./Ladder.css"
import { Serv_context } from "../../contexts/Server_host_context.";


const Ladder_card = ({ rank, mmr, name }: { rank: number, mmr: number, name: string }) =>
{
    return (
        <li key={rank} className="ladder-card"> {rank + 1}   {name}{mmr}</li>
    )
}


const Ladder = () =>
{
	const [ladder, set_ladder] = useState<{mmr: number, name: string}[]>([])
	 const serv_ip : string = process.env.REACT_APP_Server_host_ip ?? 'localhost';

	useEffect(() => {
		const get_ladder = async () =>
		{
			const response = await fetch(`http://${serv_ip}:3003/user/get_ladder`, {
				method: "Get",
				headers: {
				Authorization: `Bearer ${JSCookies.get("accessToken")}`,
				},
			});
			const data : {mmr: number, name: string} [] = await response.json();
			set_ladder(data);
		}
		get_ladder();

	  },[] );
	  

	  console.log(JSON.stringify(ladder));
	  

	return(
		<ul className="rankings-ladder">
			{
				ladder.map((player:{mmr: number, name: string}, idx)=>(
					<Ladder_card key={idx} rank={idx} mmr={player.mmr} name={player.name}/>
					))
			}
		</ul>
	)
}

export default Ladder