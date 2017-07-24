import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MainComponent } from './main/main.component';
import { ShopComponent } from './shop/shop.component';
import { QCComponent } from './qc/qc.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { VaultComponent } from './vault/vault.component';
import { BookComponent } from './book/book.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, data: { title: 'Login' } },
      { path: 'signup', component: SignupComponent, data: { title: 'Signup' } },
      { path: 'main', component: MainComponent, children: [
        { path: '', redirectTo: 'shop/Body Comp', pathMatch: 'full' },
        { path: 'shop/:category', component: ShopComponent, data: {title: 'Shop DexaFit'} },
        { path: 'vault', component: VaultComponent, data: { title: 'My Vault' } },
        { path: 'thankyou', component: QCComponent, data: {title: 'Questionnaire Confirmation'} },
        { path: 'questionnaire/:type', component: QuestionnaireComponent, data: {title: 'Questionnaire'} },
        { path: 'book', component: BookComponent, data: {title: 'Book your appointment'} },
      ] }
    ])
  ],
})
export class AppRoutingModule { }
