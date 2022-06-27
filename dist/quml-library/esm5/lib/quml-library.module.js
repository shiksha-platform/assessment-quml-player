/**
 * @fileoverview added by tsickle
 * Generated from: lib/quml-library.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QumlLibraryComponent } from './quml-library.component';
import { McqComponent } from './mcq/mcq.component';
import { SaComponent } from './sa/sa.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HeaderComponent } from './header/header.component';
import { McqQuestionComponent } from './mcq-question/mcq-question.component';
import { McqOptionComponent } from './mcq-option/mcq-option.component';
import { QumlPopupComponent } from './quml-popup/quml-popup.component';
import { McqImageOptionComponent } from './mcq-image-option/mcq-image-option.component';
import { ZoomInComponent } from './icon/zoom-in/zoom-in.component';
import { StarComponent } from './icon/star/star.component';
import { PreviousComponent } from './icon/previous/previous.component';
import { NextComponent } from './icon/next/next.component';
import { BookmarkComponent } from './icon/bookmark/bookmark.component';
import { HintComponent } from './icon/hint/hint.component';
import { AnsComponent } from './icon/ans/ans.component';
import { ShareComponent } from './icon/share/share.component';
import { CorrectComponent } from './icon/correct/correct.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { StartpageComponent } from './startpage/startpage.component';
import { TimerComponent } from './icon/timer/timer.component';
import { ContentComponent } from './icon/content/content.component';
import { StartpagestariconComponent } from './icon/startpagestaricon/startpagestaricon.component';
import { PreviousActiveComponent } from './icon/previous-active/previous-active.component';
import { NextActiveComponent } from './icon/next-active/next-active.component';
import { AlertComponent } from './alert/alert.component';
import { CloseComponent } from './icon/close/close.component';
import { McqSolutionsComponent } from './mcq-solutions/mcq-solutions.component';
import { DurationtimerComponent } from './icon/durationtimer/durationtimer.component';
import { AudioComponent } from './icon/audio/audio.component';
import { WrongComponent } from './icon/wrong/wrong.component';
import { MenuComponent } from './icon/menu/menu.component';
import { SunbirdPlayerSdkModule } from '@project-sunbird/sunbird-player-sdk-v9';
import { QumlLibraryService } from './quml-library.service';
import { SafeHtmlPipe } from './pipes/safe-html/safe-html.pipe';
import { MainPlayerComponent } from './main-player/main-player.component';
import { SectionPlayerComponent } from './section-player/section-player.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
var QumlLibraryModule = /** @class */ (function () {
    function QumlLibraryModule() {
    }
    QumlLibraryModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        QumlLibraryComponent,
                        McqComponent,
                        HeaderComponent,
                        SaComponent,
                        McqQuestionComponent,
                        McqOptionComponent,
                        QumlPopupComponent,
                        McqImageOptionComponent,
                        ZoomInComponent,
                        StarComponent,
                        PreviousComponent,
                        NextComponent,
                        PreviousActiveComponent,
                        BookmarkComponent,
                        HintComponent,
                        AnsComponent,
                        ShareComponent,
                        CorrectComponent,
                        ScoreboardComponent,
                        StartpageComponent,
                        TimerComponent,
                        ContentComponent,
                        StartpagestariconComponent,
                        NextActiveComponent,
                        AlertComponent,
                        CloseComponent,
                        McqSolutionsComponent,
                        DurationtimerComponent,
                        AudioComponent,
                        WrongComponent,
                        MenuComponent,
                        SafeHtmlPipe,
                        MainPlayerComponent,
                        SectionPlayerComponent,
                    ],
                    imports: [
                        CommonModule,
                        CarouselModule,
                        SunbirdPlayerSdkModule,
                        TranslateModule.forRoot({
                            defaultLanguage: 'hi',
                            loader: {
                                provide: TranslateLoader,
                                useFactory: HttpLoaderFactory,
                                deps: [HttpClient]
                            }
                        })
                    ],
                    providers: [
                        QumlLibraryService
                    ],
                    exports: [MainPlayerComponent]
                },] }
    ];
    return QumlLibraryModule;
}());
export { QumlLibraryModule };
/**
 * @param {?} http
 * @return {?}
 */
export function HttpLoaderFactory(http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVtbC1saWJyYXJ5Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwcm9qZWN0LXN1bmJpcmQvc3VuYmlyZC1xdW1sLXBsYXllci12OS8iLCJzb3VyY2VzIjpbImxpYi9xdW1sLWxpYnJhcnkubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDOUQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM5QyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLCtDQUErQyxDQUFDO0FBQ3RGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUNqRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDekQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDckUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ3JFLE9BQU8sRUFBQyxhQUFhLEVBQUMs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QUFDLFVBQVUsQ0FBQzs2QkFDckI7eUJBQ0osQ0FBQztxQkFDTDtvQkFDRCxTQUFTLEVBQUU7d0JBQ1Asa0JBQWtCO3FCQUNyQjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztpQkFDakM7O0lBRUQsd0JBQUM7Q0FBQSxBQXhERCxJQXdEQztTQURZLGlCQUFpQjs7Ozs7QUFHOUIsTUFBTSxVQUFVLGlCQUFpQixDQUFDLElBQWdCO0lBQzlDLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDcEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1F1bWxMaWJyYXJ5Q29tcG9uZW50fSBmcm9tICcuL3F1bWwtbGlicmFyeS5jb21wb25lbnQnO1xuaW1wb3J0IHtNY3FDb21wb25lbnR9IGZyb20gJy4vbWNxL21jcS5jb21wb25lbnQnO1xuaW1wb3J0IHtTYUNvbXBvbmVudH0gZnJvbSAnLi9zYS9zYS5jb21wb25lbnQnO1xuaW1wb3J0IHtDYXJvdXNlbE1vZHVsZX0gZnJvbSAnbmd4LWJvb3RzdHJhcC9jYXJvdXNlbCc7XG5pbXBvcnQge0hlYWRlckNvbXBvbmVudH0gZnJvbSAnLi9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQge01jcVF1ZXN0aW9uQ29tcG9uZW50fSBmcm9tICcuL21jcS1xdWVzdGlvbi9tY3EtcXVlc3Rpb24uY29tcG9uZW50JztcbmltcG9ydCB7TWNxT3B0aW9uQ29tcG9uZW50fSBmcm9tICcuL21jcS1vcHRpb24vbWNxLW9wdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHtRdW1sUG9wdXBDb21wb25lbnR9IGZyb20gJy4vcXVtbC1wb3B1cC9xdW1sLXBvcHVwLmNvbXBvbmVudCc7XG5pbXBvcnQge01jcUltYWdlT3B0aW9uQ29tcG9uZW50fSBmcm9tICcuL21jcS1pbWFnZS1vcHRpb24vbWNxLWltYWdlLW9wdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHtab29tSW5Db21wb25lbnR9IGZyb20gJy4vaWNvbi96b29tLWluL3pvb20taW4uY29tcG9uZW50JztcbmltcG9ydCB7U3RhckNvbXBvbmVudH0gZnJvbSAnLi9pY29uL3N0YXIvc3Rhci5jb21wb25lbnQnO1xuaW1wb3J0IHtQcmV2aW91c0NvbXBvbmVudH0gZnJvbSAnLi9pY29uL3ByZXZpb3VzL3ByZXZpb3VzLmNvbXBvbmVudCc7XG5pbXBvcnQge05leHRDb21wb25lbnR9IGZyb20gJy4vaWNvbi9uZXh0L25leHQuY29tcG9uZW50JztcbmltcG9ydCB7Qm9va21hcmtDb21wb25lbnR9IGZyb20gJy4vaWNvbi9ib29rbWFyay9ib29rbWFyay5jb21wb25lbnQnO1xuaW1wb3J0IHtIaW50Q29tcG9uZW50fSBmcm9tICcuL2ljb24vaGludC9oaW50LmNvbXBvbmVudCc7XG5pbXBvcnQge0Fuc0NvbXBvbmVudH0gZnJvbSAnLi9pY29uL2Fucy9hbnMuY29tcG9uZW50JztcbmltcG9ydCB7U2hhcmVDb21wb25lbnR9IGZyb20gJy4vaWNvbi9zaGFyZS9zaGFyZS5jb21wb25lbnQnO1xuaW1wb3J0IHtDb3JyZWN0Q29tcG9uZW50fSBmcm9tICcuL2ljb24vY29ycmVjdC9jb3JyZWN0LmNvbXBvbmVudCc7XG5pbXBvcnQge1Njb3JlYm9hcmRDb21wb25lbnR9IGZyb20gJy4vc2NvcmVib2FyZC9zY29yZWJvYXJkLmNvbXBvbmVudCc7XG5pbXBvcnQge1N0YXJ0cGFnZUNvbXBvbmVudH0gZnJvbSAnLi9zdGFydHBhZ2Uvc3RhcnRwYWdlLmNvbXBvbmVudCc7XG5pbXBvcnQge1RpbWVyQ29tcG9uZW50fSBmcm9tICcuL2ljb24vdGltZXIvdGltZXIuY29tcG9uZW50JztcbmltcG9ydCB7Q29udGVudENvbXBvbmVudH0gZnJvbSAnLi9pY29uL2NvbnRlbnQvY29udGVudC5jb21wb25lbnQnO1xuaW1wb3J0IHtTdGFydHBhZ2VzdGFyaWNvbkNvbXBvbmVudH0gZnJvbSAnLi9pY29uL3N0YXJ0cGFnZXN0YXJpY29uL3N0YXJ0cGFnZXN0YXJpY29uLmNvbXBvbmVudCc7XG5pbXBvcnQge1ByZXZpb3VzQWN0aXZlQ29tcG9uZW50fSBmcm9tICcuL2ljb24vcHJldmlvdXMtYWN0aXZlL3ByZXZpb3VzLWFjdGl2ZS5jb21wb25lbnQnO1xuaW1wb3J0IHtOZXh0QWN0aXZlQ29tcG9uZW50fSBmcm9tICcuL2ljb24vbmV4dC1hY3RpdmUvbmV4dC1hY3RpdmUuY29tcG9uZW50JztcbmltcG9ydCB7QWxlcnRDb21wb25lbnR9IGZyb20gJy4vYWxlcnQvYWxlcnQuY29tcG9uZW50JztcbmltcG9ydCB7Q2xvc2VDb21wb25lbnR9IGZyb20gJy4vaWNvbi9jbG9zZS9jbG9zZS5jb21wb25lbnQnO1xuaW1wb3J0IHtNY3FTb2x1dGlvbnNDb21wb25lbnR9IGZyb20gJy4vbWNxLXNvbHV0aW9ucy9tY3Etc29sdXRpb25zLmNvbXBvbmVudCc7XG5pbXBvcnQge0R1cmF0aW9udGltZXJDb21wb25lbnR9IGZyb20gJy4vaWNvbi9kdXJhdGlvbnRpbWVyL2R1cmF0aW9udGltZXIuY29tcG9uZW50JztcbmltcG9ydCB7QXVkaW9Db21wb25lbnR9IGZyb20gJy4vaWNvbi9hdWRpby9hdWRpby5jb21wb25lbnQnO1xuaW1wb3J0IHtXcm9uZ0NvbXBvbmVudH0gZnJvbSAnLi9pY29uL3dyb25nL3dyb25nLmNvbXBvbmVudCc7XG5pbXBvcnQge01lbnVDb21wb25lbnR9IGZyb20gJy4vaWNvbi9tZW51L21lbnUuY29tcG9uZW50JztcbmltcG9ydCB7U3VuYmlyZFBsYXllclNka01vZHVsZX0gZnJvbSAnQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXBsYXllci1zZGstdjknO1xuaW1wb3J0IHtRdW1sTGlicmFyeVNlcnZpY2V9IGZyb20gJy4vcXVtbC1saWJyYXJ5LnNlcnZpY2UnO1xuaW1wb3J0IHtTYWZlSHRtbFBpcGV9IGZyb20gJy4vcGlwZXMvc2FmZS1odG1sL3NhZmUtaHRtbC5waXBlJztcbmltcG9ydCB7TWFpblBsYXllckNvbXBvbmVudH0gZnJvbSAnLi9tYWluLXBsYXllci9tYWluLXBsYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHtTZWN0aW9uUGxheWVyQ29tcG9uZW50fSBmcm9tICcuL3NlY3Rpb24tcGxheWVyL3NlY3Rpb24tcGxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQge1RyYW5zbGF0ZUxvYWRlciwgVHJhbnNsYXRlTW9kdWxlfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcbmltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHtUcmFuc2xhdGVIdHRwTG9hZGVyfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9odHRwLWxvYWRlcic7XG5cblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgUXVtbExpYnJhcnlDb21wb25lbnQsXG4gICAgICAgIE1jcUNvbXBvbmVudCxcbiAgICAgICAgSGVhZGVyQ29tcG9uZW50LFxuICAgICAgICBTYUNvbXBvbmVudCxcbiAgICAgICAgTWNxUXVlc3Rpb25Db21wb25lbnQsXG4gICAgICAgIE1jcU9wdGlvbkNvbXBvbmVudCxcbiAgICAgICAgUXVtbFBvcHVwQ29tcG9uZW50LFxuICAgICAgICBNY3FJbWFnZU9wdGlvbkNvbXBvbmVudCxcbiAgICAgICAgWm9vbUluQ29tcG9uZW50LFxuICAgICAgICBTdGFyQ29tcG9uZW50LFxuICAgICAgICBQcmV2aW91c0NvbXBvbmVudCxcbiAgICAgICAgTmV4dENvbXBvbmVudCxcbiAgICAgICAgUHJldmlvdXNBY3RpdmVDb21wb25lbnQsXG4gICAgICAgIEJvb2ttYXJrQ29tcG9uZW50LFxuICAgICAgICBIaW50Q29tcG9uZW50LFxuICAgICAgICBBbnNDb21wb25lbnQsXG4gICAgICAgIFNoYXJlQ29tcG9uZW50LFxuICAgICAgICBDb3JyZWN0Q29tcG9uZW50LFxuICAgICAgICBTY29yZWJvYXJkQ29tcG9uZW50LFxuICAgICAgICBTdGFydHBhZ2VDb21wb25lbnQsXG4gICAgICAgIFRpbWVyQ29tcG9uZW50LFxuICAgICAgICBDb250ZW50Q29tcG9uZW50LFxuICAgICAgICBTdGFydHBhZ2VzdGFyaWNvbkNvbXBvbmVudCxcbiAgICAgICAgTmV4dEFjdGl2ZUNvbXBvbmVudCxcbiAgICAgICAgQWxlcnRDb21wb25lbnQsXG4gICAgICAgIENsb3NlQ29tcG9uZW50LFxuICAgICAgICBNY3FTb2x1dGlvbnNDb21wb25lbnQsXG4gICAgICAgIER1cmF0aW9udGltZXJDb21wb25lbnQsXG4gICAgICAgIEF1ZGlvQ29tcG9uZW50LFxuICAgICAgICBXcm9uZ0NvbXBvbmVudCxcbiAgICAgICAgTWVudUNvbXBvbmVudCxcbiAgICAgICAgU2FmZUh0bWxQaXBlLFxuICAgICAgICBNYWluUGxheWVyQ29tcG9uZW50LFxuICAgICAgICBTZWN0aW9uUGxheWVyQ29tcG9uZW50LFxuICAgIF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIENhcm91c2VsTW9kdWxlLFxuICAgICAgICBTdW5iaXJkUGxheWVyU2RrTW9kdWxlLFxuICAgICAgICBUcmFuc2xhdGVNb2R1bGUuZm9yUm9vdCh7XG4gICAgICAgICAgICBkZWZhdWx0TGFuZ3VhZ2U6ICdoaScsXG4gICAgICAgICAgICBsb2FkZXI6IHtcbiAgICAgICAgICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXG4gICAgICAgICAgICAgICAgdXNlRmFjdG9yeTogSHR0cExvYWRlckZhY3RvcnksXG4gICAgICAgICAgICAgICAgZGVwczogW0h0dHBDbGllbnRdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgUXVtbExpYnJhcnlTZXJ2aWNlXG4gICAgXSxcbiAgICBleHBvcnRzOiBbTWFpblBsYXllckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgUXVtbExpYnJhcnlNb2R1bGUge1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSHR0cExvYWRlckZhY3RvcnkoaHR0cDogSHR0cENsaWVudCkge1xuICAgIHJldHVybiBuZXcgVHJhbnNsYXRlSHR0cExvYWRlcihodHRwLCAnLi9hc3NldHMvaTE4bi8nLCAnLmpzb24nKTtcbn1cbiJdfQ==