import React, { useState } from "react";
import defaultPicture from "../../images/default-picture.jpeg";
import profilePicture from "../../images/expert-level.jpeg";
import JSCookies from "js-cookie";

const ProfilePicture = () => {
  const [useDefaultImage, setUseDefaultImage] = useState<boolean>(true);
  const [showUploadButton, setShowUploadButton] = useState<boolean>(false);
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const useDefault = event.target.value === "default";
    setUseDefaultImage(useDefault);
    setShowUploadButton(!useDefault);
  };

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
        console.log("here");
        setShowButtons(false);
        alert('You uploaded your photo successfully');
    } else {
        console.log(`Error log\n`);
        alert('SOmething went wrong');
      }
    }
  };

  const handleOnClick = () => {
    setShowButtons(!showButtons);
  };

  return (
    <div>
      <img
        onClick={handleOnClick}
        src={useDefaultImage ? defaultPicture : profilePicture}
        alt="Profile"
      />
      {showButtons && (
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
