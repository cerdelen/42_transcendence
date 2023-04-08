import { useEffect, useState } from "react";
import themeAchievement from "../../images/cat-yellow.jpg";
import threeWinsAchievement from "../../images/cat-white.jpg";
import halfGamesAchievement from "../../images/cat-lying.jpg";

import JSCookies from "js-cookie";
import ipAddress from "../../constants";

interface Props {
  userId: string;
}

const UserStats = ({ userId }: Props) => {
  const [winRatio, setWinRatio] = useState(0.0);
  const [wins, setWins] = useState(0);
  const [mmr, setMmr] = useState(0);
  const [loses, setLoses] = useState(0);
  const [achievementOne, setAchievementOne] = useState(false);
  const [achievementTwo, setAchievementTwo] = useState(false);
  const [achievementThree, setAchievementThree] = useState(false);


  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch(`http://${ipAddress}:3003/user/user_stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const stats = await response.json();

      const zeroDevision = (stats["loses"] + stats["wins"]) === 0;
      setMmr(stats["mmr"]);
      setWins(stats["wins"]);
      setLoses(stats["loses"]);
      setWinRatio(zeroDevision ? 0 : stats["wins"] / (stats["loses"] + stats["wins"]));
      setAchievementOne(stats["achievement_0"]);
      setAchievementTwo(stats["achievement_1"]);
      setAchievementThree(stats["achievement_2"]);
    };

    fetchStats();
  }, [userId]);

  const achiev_0 = "Win 2 Games";
  const achiev_1 = "Reach a total amount of 1600 mmr";
  const achiev_2 = "Win a game without letting your enemy score once";

  return (
    
    <div id="user-statistics">
      <div id="stats-words">
        <span>{`Wins: ${wins}`}</span>
        <span>{`Loses: ${loses}`}</span>
        <span>{`Rank: ${mmr}`}</span>
        <span>{`Wins Ratio: ${(winRatio * 100).toFixed(2)}%`}</span>

      </div>
      <div id="stats-achievements">
        {achievementOne ? <img src={themeAchievement} alt="achievement_0_true" title={achiev_0}/> : <div className="no-achievement" title={achiev_0}> </div>}
        {achievementTwo ? <img src={threeWinsAchievement} alt="achievement_1_true" title={achiev_1}/> : <div className="no-achievement" title={achiev_1}>  </div>}
        {achievementThree ? <img src={halfGamesAchievement} alt="achievement_2_true" title={achiev_2}/> : <div className="no-achievement" title={achiev_2}>  </div>}
      </div>
    </div>
  );
};

export default UserStats;
