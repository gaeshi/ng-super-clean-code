import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersActionsPanelComponent } from './users-container/users-actions-panel/users-actions-panel.component';
import { UsersContainerComponent } from './users-container/users-container.component';
import { UsersListComponent } from './users-container/users-list/users-list.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    UsersContainerComponent,
    UsersListComponent,
    UsersActionsPanelComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    MatDividerModule,
    MatListModule,
  ],
  providers: [],
})
export class AppModule {}
