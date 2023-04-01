import { useEffect, useState } from "react";
import defaultPicture from "../../images/default-picture.jpeg";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";

interface Props {
  userId: string;
}

const UserPhoto = ({ userId }: Props) => {
  const [photoURL, setPhotoURL] = useState<string>(defaultPicture);
  const { picture_map, set_picture_map, pushPictureToMap } =
    useMyProfile_picture_Context();

  useEffect(() => {
    const getUserPic = async () => {
      if (picture_map.has(Number(userId))) {
        setPhotoURL(picture_map.get(Number(userId)) ?? "");
        return;
      }
      setPhotoURL(
        pushPictureToMap(Number(userId), picture_map, set_picture_map)
      );
    };
    getUserPic();
  }, [userId]);
  return <img id="photo" src={photoURL} />;
};

export default UserPhoto;
