import {KeyPattern} from "../controllers/keyEventHandler/KeyPattern";
import {IKeyEventListener} from "../controllers/keyEventHandler/_types/IKeyEventListener";
import {insertNewLineWithTabs} from "../controllers/textField/actions/insertNewLineWithTabs";
import {handleCharacterInput} from "../controllers/textField/keyHandler.ts/handleCharacterInput";
import {handleCopyPasteInput} from "../controllers/textField/keyHandler.ts/handleCopyPasteInput";
import {handleCursorJumpInput} from "../controllers/textField/keyHandler.ts/handleCursorJumpInput";
import {handleHorizontalCursorInput} from "../controllers/textField/keyHandler.ts/handleHorizontalCursorInput";
import {handleRemovalInput} from "../controllers/textField/keyHandler.ts/handleRemovalInput";
import {handleVerticalCursorInput} from "../controllers/textField/keyHandler.ts/handleVerticalCursorInput";
import {ITextField} from "../models/textField/_types/ITextField";

function createStandardPattern(pattern: string): KeyPattern {
    return new KeyPattern([
        {pattern: pattern, allowExtra: ["shift"], type: "down or repeat"},
    ]);
}

/**
 * Creates the editor key handler for a text field
 * @param textField The text field to create the handler for
 * @param keys The keys to be used for navigation/editing
 * @returns The key handler
 */
export function createKeyHandler(
    textField: ITextField,
    {
        enter = createStandardPattern("enter"),
        del = createStandardPattern("delete"),
        backspace = createStandardPattern("backspace"),
        copy = new KeyPattern("ctrl+c"),
        paste = createStandardPattern("ctrl+v"),
        cut = new KeyPattern("ctrl+x"),
        home = createStandardPattern("home"),
        end = createStandardPattern("end"),
        selectAll = createStandardPattern("ctrl+a"),
        up = createStandardPattern("up"),
        down = createStandardPattern("down"),
        left = createStandardPattern("left"),
        right = createStandardPattern("right"),
        select = createStandardPattern("shift"),
    }: {
        enter?: KeyPattern;
        del?: KeyPattern;
        backspace?: KeyPattern;
        copy?: KeyPattern;
        paste?: KeyPattern;
        cut?: KeyPattern;
        home?: KeyPattern;
        end?: KeyPattern;
        selectAll?: KeyPattern;
        up?: KeyPattern;
        down?: KeyPattern;
        left?: KeyPattern;
        right?: KeyPattern;
        select?: KeyPattern;
    } = {}
): IKeyEventListener {
    return key => {
        if (handleCharacterInput(key, textField)) return true;
        if (enter.matches(key)) {
            insertNewLineWithTabs(textField, /^(\s|\||=(?!\s*\{))*/);
            return true;
        }
        if (handleRemovalInput(key, textField, {backspace, delete: del})) return true;
        if (handleCopyPasteInput(key, textField, {copy, paste, cut})) return true;
        if (
            handleCursorJumpInput(
                key,
                textField,
                {
                    end,
                    home,
                    selectAll,
                    expandSelection: select,
                },
                {start: /^(\s|\||=(?!\s*\{))*/m, end: /TAG$/m}
            )
        )
            return true;
        if (
            handleHorizontalCursorInput(key, textField, {
                left,
                right,
                expandSelection: select,
            })
        )
            return true;
        if (
            handleVerticalCursorInput(key, textField, {up, down, expandSelection: select})
        )
            return true;
    };
}
