import { EventEmitter, Injectable } from '@angular/core';
// import { DiceNames, GameStatus } from './../plinko/plinko-state/config'

@Injectable({
  providedIn: 'root'
})
export class PlinkoService {

  // multiplier;
  // winItem;
  // score;
  // lastWinning;
  // gameStatus;
  
  // gameStatusChanged: EventEmitter<any> = new EventEmitter<any>();
  betPlaced: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  // setGameStatus(status) {
  //   this.gameStatus = status;
  //   if (this.gameStatus === GameStatus.Success) {
  //     this.multiplier = Math.floor(Math.random() * 10);
  //     this.winItem = Math.floor(DiceNames.length * Math.random());
  //     this.score = Math.random();
  //     this.lastWinning = this.score;
  //   }
  //   this.gameStatusChanged.emit(status);
  // }

  placeBet(bet: any): void {
      const { plinkoType } = bet;
      const diceInfo = this.setDiceAndHole(plinkoType);

      this.betPlaced.emit(diceInfo);
 
  }

  setDiceAndHole(plinkoType: string): any {
    let dColor;
    const dNumber = Math.floor(Math.random() * 6);
    const dHole = Math.floor(Math.random() * 11);

    if (plinkoType === 'red') {
      dColor = 2;
    } else if (plinkoType === 'green') {
      dColor = 1;
    } else {
      dColor = 0;
    }

    return { dNumber, dColor, dHole };
  }

}
