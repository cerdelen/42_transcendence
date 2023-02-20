import catFlowersImg from '../images/cat-flowers.jpg' //currently 100 x 100
import catSternImg from '../images/cat-stern.jpeg'
import catGrassImg from '../images/cat-grass.jpg'
import catYellowImg from '../images/cat-yellow.jpg'
import catLyingImg from '../images/cat-lying.jpg'
import catWhiteImg from '../images/cat-white.jpg'

class Player {

	name: string;
	photo: string;
	playing: boolean;
	status: JSX.Element;

	constructor(name: string, photo: string, playing: boolean) {
		this.name = name;
		this.photo = photo;
		this.playing = playing;
		this.status = playing ? <span>In a game</span> : <button>Challenge</button>;
	}
}



export let players: Player[] = [];
players.push(new Player('Cedric', catFlowersImg, true));
players.push(new Player('Jakub', catSternImg, false));
players.push(new Player('Wolfito', catGrassImg, false));
players.push(new Player('Roni', catYellowImg, true));
players.push(new Player('Krisi', catLyingImg, true));
players.push(new Player('Jakuldfjhvjhgdsfjghdfsjghds vgddgvdlsvl sllhgvlgsdfb', catSternImg, false));
players.push(new Player('Cedric', catFlowersImg, true));
players.push(new Player('Jakub', catSternImg, false));
players.push(new Player('Cedric', catFlowersImg, true));
players.push(new Player('Kristiyana', catWhiteImg, false));
