import {Injectable, signal} from "@angular/core";
import {KEYS} from "../../config/keys.config";
import {Key} from "../../types/key.type";
import {WordObject} from "../../types/word-object.type";


@Injectable({providedIn: "root"})
export class KeyboardService {
    keys = signal<Key[][]>([])

    toggleKeys(word: WordObject) {
        const newKeys = this.keys().map((row: Key[]) => {
            return row.map((keyItem: Key) => {
                 return {
                     label: keyItem.label,
                     isPressed: keyItem.isPressed ? keyItem.isPressed : Object.keys(word).some((letter) => keyItem.label == letter)
                 }
            })
        })

        this.keys.set(newKeys);
    }

    hydrateKeys() {
        const keysObject:Key[][] = [];

        KEYS.forEach((row: string[], index: number) => {
            keysObject[index] = [];
            row.forEach((key: string, index2:number) => {
                keysObject[index][index2] = {
                    label: key,
                    isPressed: false
                }
            })
        })

        this.keys.set(keysObject);
    }
}