//player_number will be unique and is used to identify user
export class Player {
  public player_name: string;
  public player_number: number;
  public is_leader: boolean;
  public player_score: number;
  public player_lives: number;
  public team_selection_position: number;
  public is_in_game: boolean;
  public color_theme: string;

  constructor(
    name: string, 
    player_number: number = 0, 
    is_leader: boolean = false,
    player_score: number = 0,
    player_lives: number = 0,
    team_selection_position: number = 1,
    is_in_game = false,
    color_theme: string = ''
  ) {
    this.player_name = name;
    this.player_number = player_number;
    this.is_leader = is_leader;
    this.player_score = player_score;
    this.player_lives = player_lives;
    this.team_selection_position = team_selection_position;
    this.is_in_game = is_in_game;
    this.color_theme = color_theme;
    this.color_theme = color_theme;
  }
}