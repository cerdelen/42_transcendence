import React, { useContext, useEffect, useState } from "react";
import defaultPicture from "../../images/default-picture.jpeg";
import JSCookies from "js-cookie";
import { UserContext } from "../../contexts/UserContext";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";

function hasJpegExtension(filename: string): boolean {
  return filename.endsWith('.jpeg');
}


const ProfilePicture = () => {
  const [useDefaultImage, setUseDefaultImage] = useState<boolean>(false);
  const [showUploadButton, setShowUploadButton] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState(defaultPicture);
	const { picture_map, set_picture_map } = useMyProfile_picture_Context();
  const { userId } = useContext(UserContext);

  useEffect(() => {
      getUserPic();
      getStatus();
  }, [showMenu]);
  
  const handleRadioChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const useDefault = event.target.value === "default";
    if (useDefault) {
      await fetch("http://localhost:3003/pictures/turn_on_picture", {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      })
    } else {
      await fetch("http://localhost:3003/pictures/turn_off_picture", {
        method: "Get",
        headers: {
            "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      })
    }
    setUseDefaultImage(useDefault);
    setShowUploadButton(!useDefault);
  };

  const getStatus = async () => {
    const response = await fetch("http://localhost:3003/pictures/is-image-default", {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSCookies.get("accessToken")}`,
      },
    })

    const data = await response.json();
    setUseDefaultImage(data['status']);
  }

  const getUserPic = async () => 
  {
    // if (picture_map.has(Number(userId)))
    // {
    //   setProfilePicture(picture_map.get(Number(userId))?? '');
    //   return ;
    // }
    const response = await fetch("http://localhost:3003/pictures/me", {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSCookies.get("accessToken")}`,
      },
    }) 
    const path = await response.blob();
    const url = URL.createObjectURL(path);
    setProfilePicture(url);
    // const new_map : Map<number, string> = new Map(); 
		// 	picture_map.forEach((value, key) => {
		// 		new_map.set(key, value);
		// 	});
		// 	new_map.set(Number(userId), url);
			// set_picture_map(new_map);
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!hasJpegExtension(file.name)){
        alert('Required format is JPEG');
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:3003/pictures/upload", {
        method: "POST",
        headers: {
        //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
        body: formData,
      });
      if (response.ok) {
        setShowMenu(false);
        alert('You uploaded your photo successfully');
    } else {
        alert('SOmething went wrong');
      }
    }
  };

  const handleOnClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div>
      <img id="profile-picture"
        onClick={handleOnClick}
        src={useDefaultImage ? defaultPicture : profilePicture}
        alt="Profile"
      />
      {showMenu && (
        <div className="image-options">
          <h2>Photo options</h2>
          <label>
            <input
              type="radio"
              name="image-choice"
              value="default"
              checked={useDefaultImage}
              onChange={handleRadioChange}
            />
            Use Default
          </label>
          <label>
            <input
              type="radio"
              name="image-choice"
              value="awesome"
              checked={!useDefaultImage}
              onChange={handleRadioChange}
            />
            Be Awesome
          </label>
          {showUploadButton && (
            <label id="special">
              Upload a photo
              <input
                type="file"
                accept="image/jpeg"
                max-size={300 * 1024}
                onChange={handleImageUpload}
              />
            </label>
          )}
          <button onClick={handleOnClick}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
