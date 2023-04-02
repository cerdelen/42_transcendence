import { useContext, useEffect, useState } from "react";
import JSCookies from "js-cookie";
import "./Ladder.css";
import { useMyProfile_picture_Context } from "../../contexts/Profile_picture_context";
import defaultPicture from "../../images/default-picture.jpeg";
import { UserContext } from "../../contexts/UserContext";

const Ladder_card = ({
  rank,
  mmr,
  name,
  picture,
  playerId,
}: {
  rank: number;
  mmr: number;
  name: string;
  picture: string;
  playerId: number;
}) => {
  const { userId } = useContext(UserContext);
  return (
    <li
      key={rank}
      className={`ladder-card ${
        playerId.toString() === userId ? "special" : ""
      }`}
    >
      <span>{rank}.</span>
      <img src={picture} alt="" />
      <span>{name}</span>
      <span>{mmr}</span>
    </li>
  );
};

const Ladder = () => {
  const [ladder, set_ladder] = useState<
    { mmr: number; name: string; userId: number }[]
  >([]);

  useEffect(() => {
    const get_ladder = async () => {
      const response = await fetch("http://localhost:3003/user/get_ladder", {
        method: "Get",
        headers: {
          Authorization: `Bearer ${JSCookies.get("accessToken")}`,
        },
      });
      const data: { mmr: number; name: string; userId: number }[] =
        await response.json();
      set_ladder(data);
    };
    get_ladder();
  }, []);

  // const [photo, setPhoto] = useState("");
  const { picture_map, set_picture_map, pushPictureToMap } =
    useMyProfile_picture_Context();

  useEffect(() => {
    const updateMap = async () => {
      ladder.map(
        async (player: { mmr: number; name: string; userId: number }) => {
          if (!picture_map.has(Number(player.userId)))
            await pushPictureToMap(
              Number(player.userId),
              picture_map,
              set_picture_map
            );
        }
      );
    };
    updateMap();
  }, []);

  return (
    <ul className="rankings-ladder">
      {ladder.map(
        (player: { mmr: number; name: string; userId: number }, idx) => (
          <Ladder_card
            key={player.name}
            rank={idx + 1}
            mmr={player.mmr}
            name={player.name}
            playerId={player.userId}
            picture={picture_map.get(player.userId) ?? defaultPicture}
          />
        )
      )}
    </ul>
  );
};

export default Ladder;
