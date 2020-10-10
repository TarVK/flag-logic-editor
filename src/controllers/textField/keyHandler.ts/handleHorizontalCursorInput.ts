import {ITextField} from "../../../models/textField/_types/ITextField";
import {KeyEvent} from "../../keyEventHandler/KeyEvent";
import {KeyPattern} from "../../keyEventHandler/KeyPattern";
import {moveCursorHorizontal} from "../actions/moveCursorHorizontal";

/**
 * Handles horizontal cursor input
 * @param event The event to test
 * @param textField The text field to perform the event for
 * @param patterns The key patterns to detect, or the base settings to extract them from
 * @returns Whether the event was caught
 */
export function handleHorizontalCursorInput(
    event: KeyEvent,
    textField: ITextField,
    patterns: {
        left: KeyPattern;
        right: KeyPattern;
        expandSelection: KeyPattern;
    }
): void | boolean {
    if (patterns.left.matches(event)) {
        moveCursorHorizontal(
            textField,
            -1,
            patterns.expandSelection.matchesModifier(event)
        );
        return true;
    }
    if (patterns.right.matches(event)) {
        moveCursorHorizontal(
            textField,
            1,
            patterns.expandSelection.matchesModifier(event)
        );
        return true;
    }
}
