import catFlowersImg from '../images/cat-flowers.jpg' //currently 100 x 100
import catSternImg from '../images/cat-stern.jpeg'
import catGrassImg from '../images/cat-grass.jpg'
import catYellowImg from '../images/cat-yellow.jpg'
import catLyingImg from '../images/cat-lying.jpg'
import catWhiteImg from '../images/cat-white.jpg'

export class Player {

	name: string;
	photo: string;
	playing: boolean;
	status: JSX.Element;
	availability: boolean;
	gamesWon: number;

	constructor(name: string, photo: string, playing: boolean, availability: boolean) {
		this.name = name;
		this.photo = photo;
		this.playing = playing;
		this.status = playing ? <span>In a game</span> : <button>Challenge</button>;
		this.availability = availability;
		this.gamesWon = 69;
	}
}



export let players: Player[] = [];
players.push(new Player('Cedric', catFlowersImg, true, true));
players.push(new Player('Jakub', catSternImg, false, false));
players.push(new Player('Wolfito', catGrassImg, false, true));
players.push(new Player('Roni', catYellowImg, true, true));
players.push(new Player('Krisi', catLyingImg, true, true));
players.push(new Player('RRRJakuldfjhvjhgdsfjghdfsjghds vgddgvdlsvl sllhgvlgsdfb', catSternImg, false, true));
players.push(new Player('Cedric', catFlowersImg, true, true));
players.push(new Player('Jakub', catSternImg, false, true));
players.push(new Player('Cedric', catFlowersImg, true, true));
players.push(new Player('Kristiyana', catWhiteImg, false, true));
