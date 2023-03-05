import { useMyContext } from "../AppContext";
import { useRef, useState } from "react";
import SecondFactorQR from "../second_factor_authentication/SecondFactorQR";
import JSCookies from "js-cookie";
import ProfilePicture from "./ProfilePicture";
import Achievements from "./Achievements";
import StatusAndGamesWon from "./StatusAndGamesWon";
import LevelImageAndUsername from "./LevelImageAndUsername";
import ToggleBox from "./ToggleBox";

const ProfileCard = () => {
  const [base64String, setBase64String] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const { loggedIn, setLoggedIn } = useMyContext();
  // dynamically calculating where the drowdown should start
  const firstElementRef = useRef<HTMLDivElement>(null);
  const secondElementRef = useRef<HTMLDivElement>(null);
  function toggleDropDownMenu() {
    setIsDropdownOpen(!isDropdownOpen);
    if (firstElementRef.current && secondElementRef.current) {
      secondElementRef.current.style.top = `${
        firstElementRef.current.getBoundingClientRect().bottom
      }px`;
    }
  }

  // logging the user out
  function logOut() {
    //remove the cookie
    JSCookies.remove("accessToken");
    //change the state to logged out
    setLoggedIn(false);
    //redirect to the main screen
    window.location.replace("http://localhost:3000");
  }

  return (
    <div id="profile-box" ref={firstElementRef}>
      <span className="basic" onClick={toggleDropDownMenu}>
        Profile
      </span>
      <ProfilePicture />
      <div ref={secondElementRef} id="user-dropdown" style={{ display: isDropdownOpen ? "flex" : "none" }}>
        <LevelImageAndUsername />
        <StatusAndGamesWon />
        <Achievements />
        <ToggleBox setBase64String={setBase64String} />

        {base64String !== "" ? (
          <SecondFactorQR qrString={base64String} />
        ) : (
          <div></div>
        )}

        <button onClick={logOut}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileCard;
