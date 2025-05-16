import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DrugRequestsComponent } from './drug-requests/drug-requests.component';
import { authGuard } from '../core/guards/auth.guard';
import { MultiStepFormComponent } from "./multi-step-form/multi-step-form.component";
import { UserManagementComponent } from './user-management/user-management.component';
import { DrugSupplyComponent } from './drug-supply/drug-supply.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'drug-requests', component: DrugRequestsComponent },
      { path: 'drug-requests-form', component: MultiStepFormComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'drug-supply', component: DrugSupplyComponent }
    ]
  }
];