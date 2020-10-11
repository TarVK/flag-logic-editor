import {IHighlightNode} from "../_types/IHighlightNode";
/**
 * Splits the given list of nodes
 * @param nodes The nodes to be split
 * @param shouldSplit The callback to check whether this node is a split node
 * @param insertEmpty Whether to insert empty nodes such that each line has at least 1 node
 * @param splitNodeMode What to do with the split mode (remove, put before the next sequence, put after the previous sequence), defaults to remove
 * @returns The split node sequences
 */
export function splitHighlightNodes(
    nodes: IHighlightNode[],
    split: (node: IHighlightNode) => boolean,
    insertEmpty: boolean = false,
    splitNodeMode?: "remove" | "before" | "after"
): IHighlightNode[][] {
    let last: IHighlightNode[] = [];
    const out: IHighlightNode[][] = [last];

    nodes.forEach(node => {
        if (split(node)) {
            const n = [];
            if (splitNodeMode == "before") n.push(node);
            else if (splitNodeMode == "after") last.push(node);
            if (insertEmpty && last.length == 0)
                last.push({start: node.start, end: node.start, text: "", tags: []});

            last = n;
            out.push(n);
        } else {
            last.push(node);
        }
    });
    if (insertEmpty && last.length == 0) {
        const secondLastLine = out[out.length - 2];
        const lastItem = secondLastLine && secondLastLine[secondLastLine.length - 1];
        if (lastItem)
            last.push({
                start: lastItem.end + 1,
                end: lastItem.end + 1,
                text: "",
                tags: [],
            });
    }

    return out;
}
