import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlinkoStateComponent } from './plinko/plinko-state/plinko-state.component';
import { CasinoComponent } from './casino/casino.component'

const routes: Routes = [
  { path: 'game/plinko', component: PlinkoStateComponent },
  { path: 'game/casino', component: CasinoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
