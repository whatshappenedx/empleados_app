
import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideIcons } from '@ng-icons/core';
import {
  heroBars3Solid as heroBars3,
  heroPlusSolid as heroPlus,
  heroPencilSquareSolid as heroPencilSquare,
  heroTrashSolid as heroTrash,
  heroUserSolid as heroUser,
  heroUserGroupSolid as heroUserGroup,
  heroMoonSolid as heroMoon,
  heroSunSolid as heroSun,
  heroChevronLeftSolid as heroChevronLeft,
  heroChevronRightSolid as heroChevronRight,
  heroCheckCircleSolid as heroCheckCircle,
  heroXMarkSolid as heroXMark,
  heroInformationCircleSolid as heroInformationCircle
} from '@ng-icons/heroicons/solid';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideIcons({
      heroBars3,
      heroPlus,
      heroPencilSquare,
      heroTrash,
      heroUser,
      heroUserGroup,
      heroMoon,
      heroSun,
      heroChevronLeft,
      heroChevronRight,
      heroCheckCircle,
      heroXMark,
      heroInformationCircle,
    }),
  ]
}).catch(err => console.error(err));
