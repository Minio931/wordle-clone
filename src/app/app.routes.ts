import { Routes } from '@angular/router';
import {gameGridRoutes} from "./routes/game-grid.route";

export const routes: Routes = [
    {
        path: "",
        children: gameGridRoutes
    }
];
