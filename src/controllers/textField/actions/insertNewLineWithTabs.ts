import {TextField} from "../../../models/textField/TextField";
import {ITextField} from "../../../models/textField/_types/ITextField";
import {ITextSelection} from "../../../models/textField/_types/ITextSelection";
import {insertText} from "./insertText";

/**
 * Inserts a new line and matches the tabs
 * @param textField The text field to insert the text into
 * @param tabRegex The regex to recognize the tab pattern
 * @param caret The caret to insert the text at
 */
export function insertNewLineWithTabs(
    textField: ITextField,
    tabRegex: RegExp,
    caret: ITextSelection = textField.getSelection()
): void {
    const text = textField.get();
    const lines = text.substring(0, caret.start).split(/\r?\n/);
    const lastLine = lines[lines.length - 1] || "";
    const match = lastLine.match(tabRegex);
    const startText = match?.[0] || "";
    insertText(textField, `\n${startText}`, caret);
}
