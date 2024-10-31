import {Routes} from "@angular/router";

export const gameGridRoutes: Routes = [
    {
        path: "", loadComponent: () => import('../pages/game/game.component').then(v => v.GameComponent)
    }
]