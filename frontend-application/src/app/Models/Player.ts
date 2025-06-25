//player_number will be unique and is used to identify user
export class Player {
  public player_name: string;
  public player_number: number;
  public is_leader: boolean;
  public player_score: number;
  public player_lives: number;

  constructor(
    name: string, 
    player_number: number = 0, 
    is_leader: boolean = false,
    player_score: number = 0,
    player_lives: number = 0
  ) {
    this.player_name = name;
    this.player_number = player_number;
    this.is_leader = is_leader;
    this.player_score = player_score;
    this.player_lives = player_lives;
  }
}
