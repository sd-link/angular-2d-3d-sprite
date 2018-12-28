import { EventEmitter, Injectable } from '@angular/core';
// import { DiceNames, GameStatus } from './../plinko/plinko-state/config'

@Injectable({
  providedIn: 'root'
})
export class PlinkoService {

 
  betPlaced: EventEmitter<any> = new EventEmitter<any>();
  roundFinished: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

 

  placeBet(bet: any): void {
    const { plinkoType } = bet;
    const diceInfo = this.setDiceAndHole(plinkoType);

    this.betPlaced.emit(diceInfo);
  }

  finishRound(result: any) {
    this.roundFinished.emit(result);
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
