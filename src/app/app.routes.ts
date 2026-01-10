import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Users } from './components/users/users';
import { Profiles } from './components/profiles/profiles';
import { Chat } from './components/chat/chat';
import { Payouts } from './components/payouts/payouts';
import { Reports } from './components/reports/reports';
import { AdminProfile } from './components/admin-profile/admin-profile';
import { Configurations } from './components/configurations/configurations';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [AuthGuard]
    },
    {
        path: 'users',
        component: Users,
        canActivate: [AdminGuard]
    },
    {
        path: 'profiles',
        component: Profiles,
        canActivate: [AdminGuard]
    },
    {
        path: 'chat',
        component: Chat,
        canActivate: [AuthGuard]
    },
    {
        path: 'payouts',
        component: Payouts,
        canActivate: [AdminGuard]
    },
    {
        path: 'reports',
        component: Reports,
        canActivate: [AdminGuard]
    },
    {
        path: 'admin-profile',
        component: AdminProfile,
        canActivate: [AdminGuard]
    },
    {
        path: 'configurations',
        component: Configurations,
        canActivate: [AdminGuard]
    },
    { path: '**', redirectTo: '/login' }
];
