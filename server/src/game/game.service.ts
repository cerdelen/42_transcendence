import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GameService {

  constructor(
		private readonly prisma: PrismaService,
	) {}


  async get_many_games(game_ids: number[])
  {
    let games = [];
    for (var val of game_ids)
    {
      let game;
      if(!Number.isNaN(val))
        game = await this.get_one_game(val);
      if(game)
      {
        games.push(game);
      }
    }
    return (games);
  }

  async get_one_game(game_id: number)
  {
    return (this.prisma.game.findUnique({where: {id: game_id}}));
  }

  create(createGameDto: CreateGameDto) {
    return 'This action adds a new game';
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
