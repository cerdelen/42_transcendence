import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import JSCookies from "js-cookie";
import defaultPicture from "../../images/default-picture.jpeg";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";

interface Props {
  userId: string;
}

const UserPhoto = ({ userId }: Props) => {  
  const [photoURL, setPhotoURL] = useState<string>(defaultPicture);
	const { picture_map, set_picture_map, pushPictureToMap } = useMyProfile_picture_Context();

  useEffect(() => {
    const getUserPic = async () => {
      if(picture_map.has(Number(userId)))
      {
        setPhotoURL(picture_map.get(Number(userId)) ?? '');
        return ;
      }
      setPhotoURL(pushPictureToMap(Number(userId), picture_map, set_picture_map));
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
