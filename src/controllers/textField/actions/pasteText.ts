import {ITextField} from "../../../models/textfield/_types/ITextField";
import {ITextSelection} from "../../../models/textfield/_types/ITextSelection";
import {insertText} from "./insertText";

/**
 * Pastes the selected text
 * @param textField The text field ot move the cursor for
 * @param caret The caret to insert the text at
 */
export async function pasteText(
    textField: ITextField,
    caret: ITextSelection = textField.getSelection()
): Promise<void> {
    const text = await navigator.clipboard.readText();
    insertText(textField, text, caret);
}
