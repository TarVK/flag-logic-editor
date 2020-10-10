import {copyText} from "../actions/copyText";
import {KeyEvent} from "../../keyEventHandler/KeyEvent";
import {ITextField} from "../../../models/textField/_types/ITextField";
import {KeyPattern} from "../../keyEventHandler/KeyPattern";
import {insertText} from "../actions/insertText";
import {pasteText} from "../actions/pasteText";

/**
 * Handles copying and pasting of text
 * @param event The event to test
 * @param textField The text field to perform the event for
 * @param patterns The key patterns to detect
 * @returns Whether the event was caught
 */
export function handleCopyPasteInput(
    event: KeyEvent,
    textField: ITextField,
    patterns: {
        copy: KeyPattern;
        paste: KeyPattern;
        cut: KeyPattern;
    }
): void | boolean {
    if (patterns.copy.matches(event)) {
        copyText(textField);
        return true;
    }
    if (patterns.cut.matches(event)) {
        copyText(textField);
        insertText(textField, "");
        return true;
    }
    if (patterns.paste.matches(event)) {
        pasteText(textField);
        return true;
    }
}
