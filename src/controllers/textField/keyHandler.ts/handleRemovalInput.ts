import {ITextField} from "../../../models/textField/_types/ITextField";
import {KeyEvent} from "../../keyEventHandler/KeyEvent";
import {KeyPattern} from "../../keyEventHandler/KeyPattern";
import {removeText} from "../actions/removeText";

/**
 * Handles text removal inputs
 * @param event The event to test
 * @param textField The text field to perform the event for
 * @param patterns The key patterns to detect
 * @returns Whether the event was caught
 */
export function handleRemovalInput(
    event: KeyEvent,
    textField: ITextField,
    patterns: {
        backspace: KeyPattern;
        delete: KeyPattern;
    }
): void | boolean {
    if (patterns.backspace.matches(event)) {
        removeText(textField, -1);
        return true;
    }
    if (patterns.delete.matches(event)) {
        removeText(textField, 1);
        return true;
    }
}
