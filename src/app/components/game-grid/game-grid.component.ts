import {Component, computed, HostListener, inject, TemplateRef, viewChild} from "@angular/core";
import {GameGridItemComponent} from "./_components/game-grid-item/game-grid-item.component";
import {GameGridItemType} from "../../types/game-grid-item.type";
import {GameGridService} from "./game-grid.service";
import {NgTemplateOutlet} from "@angular/common";
import {animate, style, transition, trigger} from "@angular/animations";
import {GameStateEnum} from "../../enums/game-state.enum";

@Component({
    selector: "app-game-grid",
    templateUrl: "game-grid.component.html",
    styleUrl: "game-grid.component.scss",
    standalone: true,
    imports: [
        GameGridItemComponent,
        NgTemplateOutlet
    ],
    animations: [
        trigger('dialog', [
            transition(':enter', [
              style({
                  opacity: 1,

              }),
                animate(500)
            ]),
            transition(':leave', [
                style({
                    opacity: 0,
                }),
                animate(500)
            ])
        ])
    ]
})
export class GameGridComponent {

    gameGridService = inject(GameGridService);
    dialog = viewChild('dialog', {read: TemplateRef})

    endgameDialogText = computed(() => {
        return this.gameState === GameStateEnum.WIN
            ? "You Won, Congratulation"
            :  this.gameState === GameStateEnum.LOST ? "You Lost, Try Again"
            : "";
    })

    get gameGrid(): GameGridItemType[][] {
        return this.gameGridService.gameGrid();
    }

    get hasError(): boolean {
        return this.gameGridService.hasError();
    }

    get errorMessage(): string {
        return this.gameGridService.errorMessage();
    }

    get gameState(): GameStateEnum {
        return this.gameGridService.gameState();
    }

    constructor() {
        this.gameGridService.generateWord();
        this.gameGridService.generateGameGrid();
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDownHandler(event: KeyboardEvent) {
        if(this.gameGridService.isLetter(event.key)) {
            this.gameGridService.insertLetter(event.key);
        } else {
            this.gameGridService.gameControlHandler(event.key);
        }

    }

    resetGameHandler() {
        this.gameGridService.resetGame();
    }

    protected readonly GameStateEnum = GameStateEnum;
}