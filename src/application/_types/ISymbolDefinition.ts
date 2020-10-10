/**
 * The data format for new symbol definitions in the editor
 */
export type ISymbolDefinition = {
    pattern: string | RegExp;
    name: string;
    text?: string;
    tags?: string[];
    css?: import("@deity/falcon-ui/dist/theme").InlineCss<unknown>;
};
