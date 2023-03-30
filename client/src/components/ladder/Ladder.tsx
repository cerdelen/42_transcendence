import { useEffect, useState } from "react";
import JSCookies from "js-cookie";
import "./Ladder.css"


const Ladder_card = ({ rank, mmr, name }: { rank: number, mmr: number, name: string }) =>
{
    return (
        <li key={rank} className="ladder-card"> {rank + 1}   {name}{mmr}</li>
    )
}


const Ladder = () =>
{
	const [ladder, set_ladder] = useState<{mmr: number, name: string}[]>([])

	useEffect(() => {
		const get_ladder = async () =>
		{
			const response = await fetch("http://localhost:3003/user/get_ladder", {
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