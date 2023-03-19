import { useContext, useEffect, useState } from "react";
import themeAchievement from "../../images/changed-theme-achievement.png";
import threeWinsAchievement from "../../images/three-wins-achievement.png";
import halfGamesAchievement from "../../images/won-half-of-your-games-achievement.png";
import { UserContext } from "../../contexts/UserContext";
import JSCookies from "js-cookie";

interface Props {
  userId: string;
}

const UserStats = ({ userId }: Props) => {
  console.log("UserStats");
  const [winRatio, setWinRatio] = useState(0.0);
  const [wins, setWins] = useState(0);
  const [loses, setLoses] = useState(0);
  const [achievementOne, setAchievementOne] = useState(false);
  const [achievementTwo, setAchievementTwo] = useState(false);
  const [achievementThree, setAchievementThree] = useState(false);


  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch(`http://localhost:3003/user/user_stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const stats = await response.json();
      setWins(stats["wins"]);
      setLoses(stats["loses"]);
      setWinRatio(stats["wins"] / (stats["loses"] + stats["wins"]));
      setAchievementOne(stats["achievement_0"]);
      setAchievementTwo(stats["achievement_1"]);
      setAchievementThree(stats["achievement_2"]);
      console.log(stats);
    };

    fetchStats();
  }, [userId]);

  return (
    <div id="user-statistics">
      <div>{`Wins: ${wins}`}</div>
      <div>{`Loses: ${loses}`}</div>
      <div>{`Ratio: ${winRatio * 100}%`}</div>
      <div>
        {achievementOne ? <img src={themeAchievement} alt="" /> : <div className="no-achievement">  </div>}
        {achievementTwo ? <img src={threeWinsAchievement} alt="" /> : <div className="no-achievement">  </div>}
        {achievementThree ? <img src={halfGamesAchievement} alt="" /> : <div className="no-achievement">  </div>}
      </div>
    </div>
  );
};

export default UserStats;
