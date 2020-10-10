import {ITextField} from "../../../models/textField/_types/ITextField";
import {KeyEvent} from "../../keyEventHandler/KeyEvent";
import {KeyPattern} from "../../keyEventHandler/KeyPattern";
import {insertText} from "../actions/insertText";

/**
 * Handles new line inputs
 * @param event The event to test
 * @param textField The text field to perform the event for
 * @param pattern The key pattern to detect
 * @returns Whether the event was caught
 */
export function handleNewlineInput(
    event: KeyEvent,
    textField: ITextField,
    pattern: KeyPattern
): void | boolean {
    if (pattern.matches(event)) {
        insertText(textField, "\n");
        return true;
    }
}
