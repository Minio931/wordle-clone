import {Component, input} from "@angular/core";
import {TileState} from "../../../../enums/tile-state.enum";
import {NgClass} from "@angular/common";

@Component({
    selector: "app-game-grid-item",
    templateUrl: "game-grid-item.component.html",
    styleUrl: "game-grid-item.component.scss",
    imports: [
        NgClass
    ],
    standalone: true
})
export class GameGridItemComponent {
    letter = input<string>("");
    state = input.required<TileState>();
    protected readonly TileState = TileState;
}