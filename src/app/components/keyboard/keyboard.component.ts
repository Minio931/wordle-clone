import {Component, HostListener, inject, signal} from "@angular/core";
import {KEYS} from "../../config/keys.config";
import {KeyComponent} from "./_components/key/key.component";
import {KeyboardService} from "./keyboard.service";
import {GameGridService} from "../game-grid/game-grid.service";
import {Key} from "../../types/key.type";

@Component({
    selector: "app-keyboard",
    standalone: true,
    templateUrl: "keyboard.component.html",
    imports: [
        KeyComponent
    ],
    styleUrl: "keyboard.component.scss"
})
export class KeyboardComponent {
    keyboardService = inject(KeyboardService);
    gameGridService = inject(GameGridService);


    get keys(): Key[][] {
        return this.keyboardService.keys();
    }

    constructor() {
        this.keyboardService.hydrateKeys();
    }

}