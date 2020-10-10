import {ITextField} from "../../../models/textField/_types/ITextField";
import {KeyEvent} from "../../keyEventHandler/KeyEvent";
import {KeyPattern} from "../../keyEventHandler/KeyPattern";
import {moveCursorVertical} from "../actions/moveCursorVertical";

/**
 * Handles vertical cursor input
 * @param event The event to test
 * @param textField The text field to perform the event for
 * @param patterns The key patterns to detect
 * @returns Whether the event was caught
 */
export function handleVerticalCursorInput(
    event: KeyEvent,
    textField: ITextField,
    patterns: {
        up: KeyPattern;
        down: KeyPattern;
        expandSelection: KeyPattern;
    }
): void | boolean {
    if (patterns.up.matches(event)) {
        moveCursorVertical(
            textField,
            -1,
            patterns.expandSelection.matchesModifier(event)
        );
        return true;
    }
    if (patterns.down.matches(event)) {
        moveCursorVertical(textField, 1, patterns.expandSelection.matchesModifier(event));
        return true;
    }
}
