import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import JSCookies from "js-cookie";
import defaultPicture from "../../images/default-picture.jpeg";

const UserPhoto = () => {
  const { name } = useContext(UserContext);

  const [photoURL, setPhotoURL] = useState<string>(defaultPicture);

  useEffect(() => {
    const getUserPic = async () => {
      const response = await fetch("http://localhost:3003/pictures/me", {
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
    let useDefaultImage = false;
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
      if (!data["status"]) getUserPic();
    };
    displayPhoto();
  }, []);
  return <img src={photoURL} style={{ maxWidth: "264px" }} />;
};

export default UserPhoto;
