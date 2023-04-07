import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import JSCookies from "js-cookie";
import { our_socket } from "../utils/context/SocketContext";
import ipAddress from '../constants';

const pushPictureToMap = async (user_id: number, picture_map: Map<number, string>, set_picture_map:  React.Dispatch<React.SetStateAction<Map<number, string>>>) => {
  try {
    if (picture_map.has(user_id))
      return ;
    const response = await fetch(`http://${ipAddress}:3003/pictures/${user_id}`, {
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

const pushNameToMap = async (user_id: number, name_map: Map<number, string>, set_name_map:  React.Dispatch<React.SetStateAction<Map<number, string>>>) => {
  try {
    if (name_map.has(user_id))
      return ;
      const response = await fetch(`http://${ipAddress}:3003/user/user_name`, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
        body: JSON.stringify({ user_id: user_id }),
      });
      const name = await response.text();
      // console.log("this is a new name i wanna add to map " + name);
      
    name_map.set(user_id, name);
    set_name_map(new Map(name_map));
    return (name);
  } catch (error) {
    console.error(`fetch pushPictureToMap in ListFriends failed: ${error}`);
    return ;
  }
};

type Profile_picture_contextType = {
  picture_map: Map<number, string>;
  set_picture_map: React.Dispatch<React.SetStateAction<Map<number, string>>>;
  name_map: Map<number, string>;
  set_name_map: React.Dispatch<React.SetStateAction<Map<number, string>>>;
  pushPictureToMap: any;
  pushNameToMap: any;
};

const Profile_picture_Context = createContext<Profile_picture_contextType>({
  picture_map: new Map(),
  set_picture_map: () => {},
  pushPictureToMap: () => {},
  name_map: new Map(),
  pushNameToMap: () => {},
  set_name_map: () => {},
});

export const useMyProfile_picture_Context = () => useContext(Profile_picture_Context);

type MyContextProviderProps = {
  children: React.ReactNode;
};

export function Profile_picture_Provider({ children }: MyContextProviderProps) {
  const [picture_map, set_picture_map] = useState<Map<number, string>>(new Map());
  const [name_map, set_name_map] = useState<Map<number, string>>(new Map());
  
  useEffect(() => {
    const get_all_pictures = async () => {
      const res = await fetch(`http://${ipAddress}:3003/user/get_all_user_ids`, {
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
    }
    const get_all_names = async () => {
      const res = await fetch(`http://${ipAddress}:3003/user/get_all_user_ids`, {
        method: "Get",
        headers: {
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      })
      const all_users: {id: number}[] = await res.json();
      for (let i = 0; i < all_users.length; i++)
      {
        await pushNameToMap(all_users[i].id, name_map, set_name_map);
      }
    }
    if (JSCookies.get("accessToken")) //workaround why does it run though? when we press logout
    {
      get_all_pictures();
      get_all_names();
    }
  }, [])

  useEffect(() => {
    const update_new_picture = async (id: string) => {
      await pushPictureToMap(Number(id), picture_map, set_picture_map);

    }
    our_socket.on("new_user", (new_user: string) => {
      update_new_picture(new_user);
      our_socket.off("new_user");
    });
  }, []);
  

  // console.log("this is name map "+ JSON.stringify(name_map));
  // console.log("this is picutre map "+ JSON.stringify(picture_map));
  

  const value = {
    picture_map,
    set_picture_map,
    pushPictureToMap,
    name_map,
    set_name_map,
    pushNameToMap
  };

  return (
    <Profile_picture_Context.Provider value={value}>
      {children}
    </Profile_picture_Context.Provider>
  );
}

export default Profile_picture_Provider;