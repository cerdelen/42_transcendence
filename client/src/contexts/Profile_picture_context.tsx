import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import JSCookies from "js-cookie";
import { Serv_context } from "./Server_host_context.";

const pushPictureToMap = async (user_id: number, picture_map: Map<number, string>, set_picture_map:  React.Dispatch<React.SetStateAction<Map<number, string>>>) => {
  const serv_ip : string = process.env.REACT_APP_Server_host_ip ?? 'localhost';
  try {
    if (picture_map.has(user_id))
      return ;
    const response = await fetch(`http://${serv_ip}:3003/pictures/${user_id}`, {
      method: "Get",
      headers: {
        Authorization: `Bearer ${JSCookies.get("accessToken")}`,
      },
    });
    const path = await response.blob();
    const url = URL.createObjectURL(path);
    picture_map.set(user_id, url);
    set_picture_map(new Map(picture_map));
    return (url);
  } catch (error) {
    console.error(`fetch pushPictureToMap in ListFriends failed: ${error}`);
    return ;
  }
};

type Profile_picture_contextType = {
  picture_map: Map<number, string>;
  set_picture_map: React.Dispatch<React.SetStateAction<Map<number, string>>>;
  pushPictureToMap: any;
};

const Profile_picture_Context = createContext<Profile_picture_contextType>({
  picture_map: new Map(),
  set_picture_map: () => {},
  pushPictureToMap: () => {},
});

export const useMyProfile_picture_Context = () => useContext(Profile_picture_Context);

type MyContextProviderProps = {
  children: React.ReactNode;
};

export function Profile_picture_Provider({ children }: MyContextProviderProps) {
  const [picture_map, set_picture_map] = useState<Map<number, string>>(new Map());
	 const serv_ip : string = process.env.REACT_APP_Server_host_ip ?? 'localhost';
  
  useEffect(() => {
    const get_all_pictures = async () => {
      const res = await fetch(`http://${serv_ip}:3003/user/get_all_user_ids`, {
        method: "Get",
        headers: {
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      })
      const all_users: {id: number}[] = await res.json();
      for (let i = 0; i < all_users.length; i++)
      {
        await pushPictureToMap(all_users[i].id, picture_map, set_picture_map);
      }
      console.log("this do be news " + JSON.stringify(picture_map));
    }
      get_all_pictures();
  }, [])

  console.log(picture_map);
  
  const value = {
    picture_map,
    set_picture_map,
    pushPictureToMap,
  };

  return (
    <Profile_picture_Context.Provider value={value}>
      {children}
    </Profile_picture_Context.Provider>
  );
}

export default Profile_picture_Provider;