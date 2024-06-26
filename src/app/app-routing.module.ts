import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './auth.guard';
import { MainPageComponent } from './mainPage/main-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CancelPageComponent } from './stripe-answer/cancel-page/cancel-page.component';
import { SuccessPageComponent } from './stripe-answer/success-page/success-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin-main/admin-main.module').then((m) => m.AdminMainModule),
    canActivate: [AdminGuard],
  },
  { path: 'cart', loadChildren: () => import('./cart/cart.module').then((m) => m.CartModule) },
  {
    path: 'product/:id',
    loadChildren: () => import('./ProductPage/product.module').then((m) => m.ProductModule),
  },
  { path: 'payment-cancel', component: CancelPageComponent },
  { path: 'payment-success', component: SuccessPageComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
