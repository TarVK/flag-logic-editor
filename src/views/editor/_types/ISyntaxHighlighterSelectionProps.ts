import {ITextSelection} from "../../../models/textField/_types/ITextSelection";

export type ISyntaxHighlighterSelectionProps = {
    selection: ITextSelection;
    isEnd: boolean;
    getPixelSelection?: (pixelSelection?: {start: number; end?: number}) => void;
};
