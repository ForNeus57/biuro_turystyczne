import { Routes } from '@angular/router';
import {TripPreviewComponent} from "./trip-preview/trip-preview.component";
import {AddTripComponent} from "./add-trip/add-trip.component";
import {HomeComponent} from "./home/home.component";
import {TrolleyComponent} from "./trolley/trolley.component";
import {HistoryComponent} from "./history/history.component";
import {TripDetailsComponent} from "./trip-details/trip-details.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {AdminComponent} from "./admin/admin.component";
import {ManagerComponent} from "./manager/manager.component";
import {isAdminGuard} from "./guard/is-admin.guard";
import {isManagerGuard} from "./guard/is-manager.guard";
import {isLoggedGuard} from "./guard/is-logged.guard";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  }, {
    path: 'admin',
    component: AdminComponent,
    canActivate: [
      isAdminGuard,
    ]
  },
  {
    path: 'manager',
    component: ManagerComponent,
    canActivate: [
      isManagerGuard,
    ]
  },
  {
    path: 'cart',
    component: TrolleyComponent,
    canActivate: [
      isLoggedGuard,
    ]
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [
      isLoggedGuard,
    ]
  },
  {
    path: 'trip-preview',
    component: TripPreviewComponent,
  },
  {
    path: 'add-trip',
    component: AddTripComponent,
    canActivate: [
      isManagerGuard,
    ]
  },
  {
    path: 'trip/:id',
    component: TripDetailsComponent,
    canActivate: [
      isLoggedGuard,
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    pathMatch: 'full',
  },
];
