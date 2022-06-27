import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { QuestionCursorImplementationService } from "./question-cursor-implementation.service";
import { InteractionService } from "./interaction.service";
import {
  QumlLibraryModule,
  QuestionCursor,
} from "@project-sunbird/sunbird-quml-player-v9";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [{ path: "finish/:id", children: [] }];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    QumlLibraryModule,
    CarouselModule.forRoot(),
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    { provide: QuestionCursor, useClass: QuestionCursorImplementationService },
    InteractionService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
