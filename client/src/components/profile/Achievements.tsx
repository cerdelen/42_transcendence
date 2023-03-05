import themeAchievement from "../../images/changed-theme-achievement.png";
import threeWinsAchievement from "../../images/three-wins-achievement.png";
import halfGamesAchievement from "../../images/won-half-of-your-games-achievement.png";

const Achievements = () => {
  return (
    <section id="achievements-box">
      <h3>Achievements</h3>
      <div id="achievements">
        <img src={themeAchievement} alt="" />
        <img src={halfGamesAchievement} alt="" />
        <img src={threeWinsAchievement} alt="" />
        <img src={threeWinsAchievement} alt="" />
        <img src={threeWinsAchievement} alt="" />
      </div>
    </section>
  );
};

export default Achievements;
