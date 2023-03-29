import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import JSCookies from "js-cookie";
import defaultPicture from "../../images/default-picture.jpeg";

interface Props {
  userId: string;
}

const UserPhoto = ({ userId }: Props) => {  
  const [photoURL, setPhotoURL] = useState<string>(defaultPicture);

  useEffect(() => {
    const getUserPic = async () => {
      const response = await fetch(`http://localhost:3003/pictures/${userId}`, {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      });
      const path = await response.blob();
      const url = URL.createObjectURL(path);
      setPhotoURL(url);
    };
    const displayPhoto = async () => {
      const response = await fetch(
        "http://localhost:3003/pictures/is-image-default",
        {
          method: "Get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSCookies.get("accessToken")}`,
          },
        }
      );

      const data = await response.json();
      if (!data["status"] && userId) getUserPic();
    };
    displayPhoto();
  }, [userId]);
  return <img id="photo" src={photoURL}/>;
};

export default UserPhoto;
