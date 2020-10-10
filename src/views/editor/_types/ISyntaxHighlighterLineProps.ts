import {IHighlightNode} from "../../../models/textField/syntax/_types/IHighlightNode";
import {ITextSelection} from "../../../models/textField/_types/ITextSelection";
import {ISyntaxHighlighterNodesListenerProps} from "./ISyntaxHighlighterNodesProps";

export type ISyntaxHighlighterLineProps = {
    /** The nodes to highlight with */
    nodes: IHighlightNode[];
    /** The currently selected text */
    selection?: ITextSelection;
    /** A listener for mouse input selection changes */
    onSelectionChange?: (selection: ITextSelection) => void;

    /** Starts scrolling if the cursor goes outside of the box minus this padding */
    scrollCursorPadding?: number;
    /** Gets the pixel locations for the selection */
    getPixelSelection?: (pixelSelection?: {start: number; end?: number}) => void;
} & ISyntaxHighlighterNodesListenerProps;
