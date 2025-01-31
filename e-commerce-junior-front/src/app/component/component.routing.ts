import { Routes } from '@angular/router';
import { VideoComponent } from './video/video.component';
import { ValidacionComponent } from './validacion/validacion.component';
import { audioComponent } from './audio/audio.component';
import { AuthGuard } from '../helpers/auth.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { ChatbotComponent } from './chatbot/chatbot.component';


export const ComponentsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'presentation',
				component: VideoComponent,
				canActivate: [AuthGuard],
				data: { roles: ['seller', 'shooper'] }
			},
      {
				path: 'validacion',
				component: ValidacionComponent,
				canActivate: [AuthGuard],
				data: { roles: ['seller', 'shooper'] }
			},

      {
				path: 'audio',
				component: audioComponent,
				canActivate: [AuthGuard],
				data: { roles: ['seller', 'shooper'] }
			},
			{
				path: 'forbidden',
				component: ForbiddenComponent
			},
			{
				path: 'chatbot',
				component: ChatbotComponent
			}
		]
	},
];
