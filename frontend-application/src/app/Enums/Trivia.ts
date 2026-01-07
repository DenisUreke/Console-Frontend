export enum TriviaPhase {
  IDLE = 'IDLE',
  CHOOSE_MOVE = 'CHOOSE_MOVE',
  QUESTION = 'QUESTION'
}

/********************
 * TileType Enum / Models*
 ********************/

export enum TileTypeEnum {
  NORMAL = "NORMAL",
  WEDGE = "WEDGE",
  ROLL_AGAIN = "ROLL_AGAIN",
}

export enum TPWedgeCategoryEnum {
  HISTORY = "HISTORY",
  GEOGRAPHY = "GEOGRAPHY",
  SCIENCE = "SCIENCE",
  ARTS = "ARTS",
  ENTERTAINMENT = "ENTERTAINMENT",
  SPORTS_AND_LEISURE = "SPORTS_AND_LEISURE",
}

export interface PossibleMove {
  index: number;
  tile_type: TileTypeEnum;
  category: TPWedgeCategoryEnum | null; // null for roll_again tiles
}

export interface PossibleMovesData {
  dice_value: number;
  moves: PossibleMove[];
}
