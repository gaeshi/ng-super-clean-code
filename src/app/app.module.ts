import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class AppModule {}
