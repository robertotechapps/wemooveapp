import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioGuard } from './guards/usuario.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash-screen',
    pathMatch: 'full'
  },
  {
    path: 'walkthrough',
    loadChildren: () => import('./walkthrough/walkthrough.module').then(m => m.WalkthroughPageModule),
    // canLoad: [UsuarioGuard]
  },
  {
    path: 'getting-started',
    loadChildren: () => import('./getting-started/getting-started.module').then(m => m.GettingStartedPageModule)
  },
  {
    path: 'activity-in-progress',
    loadChildren: () => import('./activities/activity-in-progress/activity-in-progress.module').then(m=> m.ActivityInProgressPageModule),
    // canLoad: [UsuarioGuard]
  },
  {
    path: 'auth',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'auth/signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'auth/verifyEmail',
    loadChildren: () => import('./signup/verify-email/verify-email.module').then(m => m.VerifyEmailPageModule)
  },
  {
    path: 'auth/verifyCode',
    loadChildren: () => import('./forgot-password/verify-code/verify-code.module').then(m => m.VerifyCodePageModule)
  },
  {
    path: 'auth/verifyInvitation',
    loadChildren: () => import('./login/verify-invitation/verify-invitation.module').then(m => m.VerifyInvitationPageModule)
  },
  {
    path: 'auth/forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'challenges',
    loadChildren: () => import('./challenges/challenges-list/challenges-list.module').then(m => m.ChallengesListPageModule),
    // canLoad: [UsuarioGuard]
  },
  {
    path: 'challenges-user',
    loadChildren: () => import('./challenges/challenges-list-user/challenges-list-user.module').then(m => m.ChallengesListUserPageModule),
    // canLoad: [UsuarioGuard]
  },
  {
    path: 'activities',
    loadChildren: () => import('./activities/select-activity/select-activity.module').then(m => m.SelectActivityPageModule),
    // canLoad: [UsuarioGuard]
  },
  {
    path: 'my-activities',
    loadChildren: () => import('./activities/my-activities/my-activities.module').then( m => m.MyActivitiesPageModule)
  },
  {
    path: 'achievements',
    loadChildren: () => import('./user/achievements/achievements.module').then( m => m.AchievementsPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./user/wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'worder',
    loadChildren: () => import('./user/worder/worder.module').then( m => m.WOrderPageModule)
  },
  {
    path: 'achievements-detail',
    loadChildren: () => import('./user/achievements-detail/achievements-detail.module').then( m => m.AchievementsDetailPageModule)
  },
  {
    path: 'activity-detail',
    loadChildren: () => import('./activities/activity-detail/activity-detail.module').then( m => m.ActivityDetailPageModule)
  },
  {
    path: 'config',
    loadChildren: () => import('./config/config.module').then( m => m.ConfigPageModule),
    // canLoad: [UsuarioGuard]
  },
  {
    path: 'activity-config',
    loadChildren: () => import('./activity-config/activity-config.module').then( m => m.ActivityConfigPageModule)
  },
  {
    path: 'challenge-detail',
    loadChildren: () => import('./challenges/challenge-detail/challenge-detail.module').then( m => m.ChallengeDetailPageModule)
  },
  {
    path: 'activity-list',
    loadChildren: () => import('./activities/activity-list/activity-list.module').then( m => m.ActivityListPageModule)
  },
  {
    path: 'challenge-detail-user',
    loadChildren: () => import('./challenges/challenge-detail-user/challenge-detail-user.module').then( m => m.ChallengeDetailUserPageModule)
  },
  {
    path: 'page-not-found',
    loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
  },
  {
    path: 'update-cel-number',
    loadChildren: () => import('./user/update-cel-number/update-cel-number.module').then( m => m.UpdateCelNumberPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./user/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule),
    // canLoad: [UsuarioGuard]
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./user/user-profile/user-profile.module').then( m => m.UserProfilePageModule),
    // canLoad: [UsuarioGuard]
  },
  {
    path: 'splash-screen',
    loadChildren: () => import('./splash-screen/splash-screen.module').then( m => m.SplashScreenPageModule)
  },
  {
    path: '**',
    redirectTo: 'page-not-found'
  },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // This value is required for server-side rendering to work.
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
