import {inject, Injectable, signal} from "@angular/core";
import {GameGridItemType} from "../../types/game-grid-item.type";
import {TileState} from "../../enums/tile-state.enum";
import {RegexConfig} from "../../config/regex.config";
import {KeyControl} from "../../enums/key-control.enum";
import {WORDS} from "../../config/words.config";
import {WordObject} from "../../types/word-object.type";
import {GameStateEnum} from "../../enums/game-state.enum";
import {KeyboardService} from "../keyboard/keyboard.service";

const INITIAL_GAME_STATE = GameStateEnum.IN_PROGRESS;

@Injectable({providedIn: "root"})
export class GameGridService {
    readonly NUMBER_OF_TRIES = 5;

    readonly WORD_LENGTH_NUMBER = 5;

    gameGrid = signal<GameGridItemType[][]>([]);

    numberOfTries = signal<number>(0);

    currentPosition = signal<number>(0);

    gameState = signal<GameStateEnum>(INITIAL_GAME_STATE);

    gameWord = signal<string>("");

    correctLettersInWord = signal<number>(0);

    hasError = signal<boolean>(false)

    errorMessage = signal<string>("");

    keyboardService = inject(KeyboardService);

    private deleteLetter() {
        const gameGrid = this.gameGrid();
        gameGrid[this.numberOfTries()][this.currentPosition() - 1] = {
            content: "",
            state: TileState.NEUTRAL
        }
        this.currentPosition.set(this.currentPosition() - 1 >= 0 ? this.currentPosition() - 1 : this.currentPosition());
        this.handleTileHighlight();
    }

    private wordToObject(word: string):WordObject {
        const object: WordObject = {}
        word.split('').forEach((letter: string, index: number) => {
            object[letter.toUpperCase()] = {
                position: index
            }
        })

        return object;
    }

    private displayDialog() {
        this.hasError.set(true);
        setTimeout(() => {
            this.hasError.set(false)
        }, 1500)
    }

    private getTypedWord() {
        return this.gameGrid()[this.numberOfTries()].map(item => item.content).join("");
    }

    private transformTypedWordToObject() {
        return this.wordToObject(this.getTypedWord());
    }

    private getCurrentWordsObject() {
        const gameWordObject: WordObject = this.wordToObject(this.gameWord());
        const typedWordObject: WordObject = this.transformTypedWordToObject();

        return {
            gameWordObject,
            typedWordObject
        }
    }

    private isWordTooShort() {
        const word = this.getTypedWord();
        return word.length < this.WORD_LENGTH_NUMBER;
    }

    private handleGameState() {
        const gameState = this.correctLettersInWord() === 5 ? GameStateEnum.WIN
                : this.numberOfTries() === this.NUMBER_OF_TRIES - 1 ? GameStateEnum.LOST
                : GameStateEnum.IN_PROGRESS;
        this.gameState.set(gameState);
    }

    private validateWord() {
        const gameGrid = this.gameGrid();
        const {typedWordObject, gameWordObject} = this.getCurrentWordsObject();
        if(this.isWordTooShort()) {
            this.displayDialog();
            this.errorMessage.set("Word too short");
            return;
        }
        this.correctLettersInWord.set(0);
        this.resetTilesState();
        

        Object.keys(typedWordObject).forEach((item: string) => {
            if(!!gameWordObject[item]) {
                const hasCorrectPlacement = typedWordObject[item].position === gameWordObject[item].position
                if (hasCorrectPlacement) {
                    this.correctLettersInWord.set(this.correctLettersInWord() + 1);
                }

                gameGrid[this.numberOfTries()][typedWordObject[item].position] = {
                    content: item,
                    state: hasCorrectPlacement ? TileState.CORRECT : TileState.WRONG
                }
            }
        })


        this.gameGrid.set(gameGrid);
        this.handleGameState();
        if (this.gameState() !== GameStateEnum.IN_PROGRESS) {
            return;
        }
        this.numberOfTries.set(this.numberOfTries() + 1)
        this.currentPosition.set(0);
        this.keyboardService.toggleKeys(typedWordObject);
        this.handleTileHighlight();
    }

    public isLetter(key: string): boolean {
        return RegexConfig.onlyLetters.test(key);
    }

    public generateWord() {
        this.gameWord.set(WORDS[Math.floor(Math.random() * WORDS.length )]);
    }

    public generateGameGrid() {
        const gridArray: GameGridItemType[][] = [];
        for(let i = 0; i < this.NUMBER_OF_TRIES; i++) {
            gridArray[i] = [];
            for (let j = 0; j < this.WORD_LENGTH_NUMBER; j++) {
                gridArray[i][j] = {
                    content: "",
                    state: TileState.NEUTRAL
                }
            }
        }

        this.gameGrid.set(gridArray);
        this.handleTileHighlight();
    }

    public gameControlHandler(key: string) {
        switch (key) {
            case KeyControl.BACKSPACE || KeyControl.DELETE:
                    this.deleteLetter();
                break;
            case KeyControl.ENTER:
                    this.validateWord();
                break;
        }
    }

    private modifyGameGridItem(indexRow: number, indexColumn:number, content: string, state: TileState) {
        const gameGrid = this.gameGrid();
        gameGrid[indexRow][indexColumn] = {
            content,
            state
        }
        this.gameGrid.set(gameGrid);
    }

    private getSpecifiedGameGrid(indexRow: number, indexColumn: number) {
        return this.gameGrid()[indexRow][indexColumn] ?? null;
    }

    private resetTilesState() {
        const gameGrid = this.gameGrid();

        gameGrid[this.numberOfTries()]?.forEach((item: GameGridItemType, index: number) => {
            const gridItem = this.getSpecifiedGameGrid(this.numberOfTries(), index);
            if (gridItem) {
                this.modifyGameGridItem(this.numberOfTries(), index, gridItem.content, TileState.NEUTRAL);
            }
        })
    }

    public handleTileHighlight() {
        const gameGrid = this.gameGrid();
        const highlightPosition = (this.currentPosition() - 1 >= 0 ? this.currentPosition() - 1: this.currentPosition());

        this.resetTilesState();
        const gameGridItem = this.getSpecifiedGameGrid(this.numberOfTries(), highlightPosition);
        if (gameGridItem) {
            this.modifyGameGridItem(this.numberOfTries(), highlightPosition, gameGridItem.content, TileState.HIGHLIGHT);
        }
    }

    public insertLetter(letter: string) {
        if(!this.isLetter(letter)) {
            return;
        }

        if(this.currentPosition() + 1 > this.WORD_LENGTH_NUMBER) {
            return;
        }

        const letterUppercase = letter.toUpperCase();
        const gameGrid = this.gameGrid();
        gameGrid[this.numberOfTries()][this.currentPosition()] = {
            content: letterUppercase,
            state: TileState.NEUTRAL
        }
        this.gameGrid.set(gameGrid)
        this.currentPosition.set(this.currentPosition() + 1);
        this.handleTileHighlight();
    }

    public resetGame() {
        this.gameState.set(INITIAL_GAME_STATE);
        this.numberOfTries.set(0);
        this.currentPosition.set(0);
        this.gameWord.set("");
        this.correctLettersInWord.set(0);
        this.generateWord();
        this.generateGameGrid();
    }

}