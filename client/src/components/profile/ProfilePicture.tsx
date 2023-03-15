import React, { useContext, useEffect, useState } from "react";
import defaultPicture from "../../images/default-picture.jpeg";
import JSCookies from "js-cookie";



const ProfilePicture = () => {
  const [useDefaultImage, setUseDefaultImage] = useState<boolean>(false);
  const [showUploadButton, setShowUploadButton] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState(defaultPicture);

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

  const getUserPic = async () => {
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
  }
    
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
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
      <img
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
