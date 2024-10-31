import {Component} from "@angular/core";
import {GameGridComponent} from "../../components/game-grid/game-grid.component";
import {KeyboardComponent} from "../../components/keyboard/keyboard.component";

@Component({
    selector: "app-game",
    standalone: true,
    templateUrl: "game.component.html",
    styleUrl: "game.component.scss",
    imports: [
        GameGridComponent,
        KeyboardComponent
    ]
})
export class GameComponent {

}