import pong_properties from './make_game_state'
export interface KeyInfo
{
    key: number,
    player_number: number;
    socket_id: string;
    gameActive: boolean;
}
export interface invitesType
{
  creator_id: string;
  invitee_id: string;
};
export interface state_type
{
	participants : string[],
	state : pong_properties,
}
export let roomNames: { roomName: string, gameInstance: any }[] = [];
export let invitationRooms = {};
export let invitationRoomsNames : { roomName: string, gameInstance: any}[] = [];
export let invites : invitesType[] = [];
export const stateArr : state_type[] = [];
export const inviteState = {};
export const clientRooms = {};
// clientrooms { VEzTzc2XuHZJyxpvAAAB: '110' }


// roNomames [
//    {
//      roomName: '110',
//      gameInstance: {
//        id: 110,
//        player_one: 98450,
//        player_two: 0,
//        winner: 0,
//        loser: 0,
//        score_one: 0,
//        score_two: 0,
//        finished: false
//      }
//    }
//  ]
//  invitationroosm {}
//  invitationroosmnames []
//  statearr [
//    <110 empty items>,
//    {
//      participants: [ 'VEzTzc2XuHZJyxpvAAAB' ],
//      state: {
//        player_1_nick: 'kmilchev',
//        player_2_nick: '',
//        keysPressed_p1: [],
//        keysPressed_p2: [],
//        player_1_score: 0,
//        player_2_score: 0,
//        Ball: [Object],
//        Player1: [Object],
//        Player2: [Object]
//      }
//    }
//  ]
//  invitastate {}
//  clientrooms { VEzTzc2XuHZJyxpvAAAB: '110' }