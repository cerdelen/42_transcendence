
import { useContext, useEffect, useRef, useState } from "react";
import SecondFactorQR from "../second_factor_authentication/SecondFactorQR";
import JSCookies from "js-cookie";
import ProfilePicture from "./ProfilePicture";
import Achievements from "./Achievements";
import StatusAndGamesWon from "./StatusAndGamesWon";
import LevelImageAndUsername from "./LevelImageAndUsername";
import ToggleBox from "./ToggleBox";
import { UserContext } from "../../contexts/UserContext";

const ProfileCard = () => {
  const [base64String, setBase64String] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // dynamically calculating where the dropdown should start
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
    // setLoggedIn(false);
    //redirect to the main screen
    window.location.replace("http://localhost:3000");
  }
  const { userId } = useContext(UserContext);
  // console.log(userId);
  const [name, setName] = useState("");
  const [statusTFA, setStatusTFA] = useState(false);

  useEffect(() => {
    const getData = async () => {

      // console.log("one more time");
      const response = await fetch("http://localhost:3003/user/user_data", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      setName(data["name"]);
      setStatusTFA(data["two_FA_enabled"]);
    };
    if (userId)
      getData();
  }, [userId]);

  return (
    <div id="profile-box" ref={firstElementRef}>
      <span className="basic" onClick={toggleDropDownMenu}>
        Profile
      </span>
      <ProfilePicture />
      <div ref={secondElementRef} id="user-dropdown" style={{ display: isDropdownOpen ? "flex" : "none" }}>
        <LevelImageAndUsername userName={name} setIsDropdownOpen={setIsDropdownOpen} />
        <StatusAndGamesWon />
        <Achievements />
        <ToggleBox setBase64String={setBase64String} status2FA={statusTFA}/>

        {base64String !== "" ? (
          <SecondFactorQR qrString={base64String} />
        ) : (
          <div></div>
        )}
        <button className="purple-button" onClick={logOut}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileCard;
