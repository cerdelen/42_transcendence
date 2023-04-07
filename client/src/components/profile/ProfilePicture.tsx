import React, { useEffect, useState } from "react";
import defaultPicture from "../../images/default-picture.jpeg";
import JSCookies from "js-cookie";
import { useMyContext } from "../../contexts/InfoCardContext";
import ipAddress from '../../constants';

function hasJpegExtension(filename: string): boolean {
  return filename.endsWith('.jpeg');
}


const ProfilePicture = () => {
  const {showMenu, setShowMenu} = useMyContext();
  const [profilePicture, setProfilePicture] = useState(defaultPicture);

  useEffect(() => {
      getUserPic();
  }, [showMenu]);
  
  const getUserPic = async () => 
  {
    const response = await fetch(`http://${ipAddress}:3003/pictures/me`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSCookies.get("accessToken")}`,
      },
    }) 
    const path = await response.blob();
    const url = URL.createObjectURL(path);
    setProfilePicture(url);
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
      const response = await fetch(`http://${ipAddress}:3003/pictures/upload`, {
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
        src={profilePicture}
        alt="Profile"
      />
      {showMenu && (
        <div className="image-options">
          <h2>Photo options</h2>
            <label id="special">
              Upload photo
              <input
                type="file"
                accept="image/jpeg"
                max-size={300 * 1024}
                onChange={handleImageUpload}
              />
            </label>

          <button onClick={handleOnClick}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
