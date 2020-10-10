import {IHighlighter} from "../../../models/textField/syntax/_types/IHighlighter";
import {IHighlightError} from "../../../models/textField/syntax/_types/IHighlightError";
import {ITextSelection} from "../../../models/textField/_types/ITextSelection";

export type ISyntaxHighlighterProps = {
    /** The textual value to highlight */
    value: string;
    /** The highlighter to perform the highlight with */
    highlighter: IHighlighter;
    /** Whether or not to highlight errors */
    highlightErrors?: boolean;
    /** A callback for any (syntax) errors that may have occurred */
    setErrors?: (errors: IHighlightError[]) => void;

    /** The currently selected text */
    selection?: ITextSelection;
    /** A listener for mouse input selection changes */
    onSelectionChange?: (selection: ITextSelection) => void;
};
