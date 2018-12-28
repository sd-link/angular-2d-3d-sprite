import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PlinkoStateComponent } from './plinko/plinko-state/plinko-state.component';
import { AppRoutingModule } from './app-routing.module';
import { CasinoComponent } from './casino/casino.component';

@NgModule({
  declarations: [
    AppComponent,
    PlinkoStateComponent,
    CasinoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
  ],
  bootstrap: [
    AppComponent,
  ],
})

export class AppModule {}
