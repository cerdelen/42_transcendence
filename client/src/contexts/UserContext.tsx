import { createContext } from 'react';



type UserContextType = {
	userId: string,
	name: string,
	mail: string,
	two_FA_enabled: boolean,
	two_FA_secret: string,
	friendlist: number[],
	stats: any,
	games: number[],				// ids of games??
	blocked_users: number[]
};

export const UserContext = createContext<UserContextType>({
	userId: '',
	name: '',
	mail: '',
	two_FA_enabled: false,
	two_FA_secret: '',
	friendlist: [],
	stats: {},
	games: [],				// ids of games??
	blocked_users: []
});

// export const useMyProfile_picture_Context = () => useContext(Profile_picture_Context);

// type MyContextProviderProps = {
//   children: React.ReactNode;
// };

// export function Profile_picture_Provider({ children }: MyContextProviderProps) {
//   const [picture_map, set_picture_map] = useState<Map<number, string>>(new Map());
  
//   useEffect(() => {
//     const get_all_pictures = async () => {
//       const res = await fetch(`http://localhost:3003/user/get_all_user_ids`, {
//         method: "Get",
//         headers: {
//           Authorization: `Bearer ${JSCookies.get("accessToken")}`,
//         },
//       })
//       const all_users: {id: number}[] = await res.json();
//       for (let i = 0; i < all_users.length; i++)
//       {
//         await pushPictureToMap(all_users[i].id, picture_map, set_picture_map);
//       }
//       console.log("this do be news " + JSON.stringify(picture_map));
//     }
//       get_all_pictures();
//   }, [])

//   console.log(picture_map);
  
//   const value = {
//     picture_map,
//     set_picture_map,
//     pushPictureToMap,
//   };

//   return (
//     <Profile_picture_Context.Provider value={value}>
//       {children}
//     </Profile_picture_Context.Provider>
//   );
// }

// export default Profile_picture_Provider;