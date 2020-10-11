import {ITextField} from "../../../models/textfield/_types/ITextField";
import {get1dIndex, get2dIndex, getTextLines} from "../utils/rangeConversion";

/**
 * Jumps the cursor to the top, bottom, start of line or end of line
 * @param textField The text field ot move the cursor for
 * @param direction The movement direction
 * @param expandSelection Whether to alter the current text selection
 * @param endMatchers Determines the position to jump to
 */
export function jumpCursor(
    textField: ITextField,
    direction: {dx?: number; dy?: number},
    expandSelection?: boolean,
    endMatchers?: {
        start?: RegExp;
        end?: RegExp;
    }
): void {
    const selection = textField.getSelection();
    const text = textField.get();

    // Get a point representation of the index
    const lines = getTextLines(text, false);
    let endPoint = get2dIndex(text, selection.end);

    // Move the end point
    if (direction.dy) {
        if (direction.dy > 0) endPoint.row = lines.length - 1;
        else endPoint.row = 0;
    }
    if (direction.dx) {
        const line = lines[endPoint.row];
        if (direction.dx > 0) {
            let c = line.length;
            if (endMatchers?.end) {
                const m = line.match(endMatchers.end);
                if (m && m.index !== undefined && endPoint.column != m.index) c = m.index;
            }
            endPoint.column = c;
        } else {
            let c = 0;
            if (endMatchers?.start) {
                const m = line.match(endMatchers.start);
                if (
                    m &&
                    m.index !== undefined &&
                    endPoint.column != m.index + m[0].length
                )
                    c = m.index + m[0].length;
            }
            endPoint.column = c;
        }
    }

    // Convert back to 1d index representation
    const endIndex = get1dIndex(text, endPoint);

    // Update the selection
    textField.setSelection({
        start: expandSelection ? selection.start : endIndex,
        end: endIndex,
    });
}
