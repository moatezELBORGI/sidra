import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DrugRequestsComponent } from './drug-requests/drug-requests.component';
import { authGuard } from '../core/guards/auth.guard';
import {MultiStepFormComponent} from "./multi-step-form/multi-step-form.component";

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'drug-requests', component: DrugRequestsComponent },
      { path: 'drug-requests-form', component: MultiStepFormComponent }

    ]
  }
];
