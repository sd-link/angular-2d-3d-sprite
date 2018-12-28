export enum CanvasDimension {
  width = 300,
  height = 250,
  cameraRadiusMin = 3,
  cameraRadiusMax = 5,
 
}

export const HoleNumberList = [
  { 
    alpha: Math.PI,
    beta: 0
  },
  { 
    alpha: Math.PI,
    beta: 0
  },
  { 
    alpha: Math.PI,
    beta: 0
  },
  { 
    alpha: Math.PI,
    beta: 0
  },
  { 
    alpha: Math.PI,
    beta: 0
  },
  { 
    alpha: Math.PI,
    beta: 0
  }
]

export const FallingDices = 4;

export enum TextStyle {
  fontFamily = 'EnzoOT-Bold',
  fontSizeLarge = 70,
  fontSizeMedium = 40,
  fontSizeSmall = 30
}

export enum AnimationTiming {
  TextIn = 400,
  TextOut = 400,
  TextDelay = 800,
  TextCounting = 2000,
  DiceFallingInterval = 500,
  DiceFallingDuration = 2000
}

export enum GameStatus {
  Success = 'SUCCESS',
  Fail = 'FAIL',
  Play = 'PLAY'
}

export enum GameText {
  Play = 'PLAY!',
  TryAgain = 'Try again!',
  BTC = 'BTC',
  LastWinning = 'Last winning'
}

 

 