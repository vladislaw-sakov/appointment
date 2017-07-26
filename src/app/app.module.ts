import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from "ng2-file-upload";
import { DomSanitizer} from '@angular/platform-browser';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MainComponent } from './main/main.component';
import { ShopComponent } from './shop/shop.component';
import { QCComponent } from './qc/qc.component';
import { VaultComponent } from './vault/vault.component';
import { BookComponent } from './book/book.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { CalendarComponent } from './calendar/calendar.component';

import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, XLargeDirective } from './app.component';
import { FacebookModule } from './facebook';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
} 

@NgModule({
  declarations: [ 
    AppComponent, 
    XLargeDirective,

    LoginComponent,
    SignupComponent,
    MainComponent,
    ShopComponent,
    QCComponent,
    VaultComponent,
    BookComponent,
    CalendarComponent,
    QuestionnaireComponent,
    SafePipe
  ],
  imports: [
    FacebookModule.forRoot(),
    SharedModule,
    AppRoutingModule,
    FileUploadModule
  ]
})
export class AppModule {
}

export { AppComponent } from './app.component';
