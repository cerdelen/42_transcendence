import themeAchievement from "../../images/cat-yellow.jpg";
import threeWinsAchievement from "../../images/cat-white.jpg";
import halfGamesAchievement from "../../images/cat-lying.jpg";

const Achievements = ({achievements} : {achievements: boolean[]}) => {
  const achiev_0 = "Win 2 Games";
  const achiev_1 = "Reach a total amount of 1600 mmr";
  const achiev_2 = "Win a game without letting your enemy score once";

  return (
    <section id="achievements-box">
      <h3>Achievements</h3>
      <div id="achievements">
      {achievements[0] ? <img src={themeAchievement} alt="achievement_0_true" title={achiev_0}/> : <div className="no-achievement" title={achiev_0}> </div>}
      {achievements[1] ? <img src={threeWinsAchievement} alt="achievement_1_true" title={achiev_1}/> : <div className="no-achievement" title={achiev_1}>  </div>}
      {achievements[2] ? <img src={halfGamesAchievement} alt="achievement_2_true" title={achiev_2}/> : <div className="no-achievement" title={achiev_2}>  </div>}
      </div>
    </section>
  );
};

export default Achievements;
