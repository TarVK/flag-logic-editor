import {ITextField} from "../../../models/textField/_types/ITextField";
import {KeyEvent} from "../../keyEventHandler/KeyEvent";
import {KeyPattern} from "../../keyEventHandler/KeyPattern";
import {jumpCursor} from "../actions/jumpCursor";

/**
 * Handles cursor jump input (home/end)
 * @param event The event to test
 * @param textField The text field to perform the event for
 * @param patterns The key patterns to detect, or the base settings to extract them from
 * @param endMatchers Determines the position to jump to
 * @returns Whether the event was caught
 */
export function handleCursorJumpInput(
    event: KeyEvent,
    textField: ITextField,
    patterns: {
        end: KeyPattern;
        home: KeyPattern;
        selectAll: KeyPattern;
        expandSelection: KeyPattern;
    },
    endMatchers?: {
        start?: RegExp;
        end?: RegExp;
    }
): void | boolean {
    if (patterns.end.matches(event)) {
        jumpCursor(
            textField,
            {dx: 1},
            patterns.expandSelection.matchesModifier(event),
            endMatchers
        );
        return true;
    }
    if (patterns.home.matches(event)) {
        jumpCursor(
            textField,
            {dx: -1},
            patterns.expandSelection.matchesModifier(event),
            endMatchers
        );
        return true;
    }
    if (patterns.selectAll.matches(event)) {
        jumpCursor(textField, {dx: -1, dy: -1});
        jumpCursor(textField, {dx: 1, dy: 1}, true);
        return true;
    }
}
