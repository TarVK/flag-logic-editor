import {ITextSelection} from "../../../models/textfield/_types/ITextSelection";
import {ITextField} from "../../../models/textfield/_types/ITextField";
/**
 * Copies the selected text
 * @param textField The text field ot move the cursor for
 * @param caret The caret to copy the text from
 */
export async function copyText(
    textField: ITextField,
    caret: ITextSelection = textField.getSelection()
): Promise<void> {
    const text = textField.get();
    const start = Math.min(caret.start, caret.end);
    const end = Math.max(caret.start, caret.end);
    const selectedText = text.slice(start, end);
    await navigator.clipboard.writeText(selectedText);
}
