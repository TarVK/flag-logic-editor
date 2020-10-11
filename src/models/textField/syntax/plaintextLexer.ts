import {createHighlightTokens} from "./utils/createHighlightTokens";
import {highlightTags} from "./utils/highlightTags";
import {HighlightLexer} from "./HighlightLexer";

export const {tokenList} = createHighlightTokens({
    newLine: {pattern: /\r?\n/, tags: ["new-line"]},
    text: {pattern: /.+/, tags: [highlightTags.text]},
});

export const plaintextLexer = new HighlightLexer(tokenList);
