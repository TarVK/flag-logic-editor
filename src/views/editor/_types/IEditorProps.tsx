import {IKeyEventListener} from "../../../controllers/keyEventHandler/_types/IKeyEventListener";
import {IHighlighter} from "../../../models/textField/syntax/_types/IHighlighter";
import {IHighlightError} from "../../../models/textField/syntax/_types/IHighlightError";
import {ITextField} from "../../../models/textField/_types/ITextField";

export type IEditorProps = {
    /** The keyboard interaction handler */
    keyboardHandler: IKeyEventListener;
    /** The text field to highlight from */
    textField: ITextField;
    /** The highlighter to perform the highlight with */
    highlighter: IHighlighter;
    /** A callback for any (syntax) errors that may have occurred */
    setErrors?: (errors: IHighlightError[]) => void;
    /** Whether to highlight errors, or the duration to not highlight errors for after typing*/
    highlightErrors?: number | boolean;
};
