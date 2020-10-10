import {IHighlightNode} from "../_types/IHighlightNode";
/**
 * Splits the given list of nodes
 * @param nodes The nodes to be split
 * @param shouldSplit The callback to check whether this node is a split node
 * @param splitNodeMode What to do with the split mode (remove, put before the next sequence, put after the previous sequence), defaults to remove
 * @returns The split node sequences
 */
export function splitHighlightNodes(
    nodes: IHighlightNode[],
    split: (node: IHighlightNode) => boolean,
    splitNodeMode?: "remove" | "before" | "after"
): IHighlightNode[][] {
    let last: IHighlightNode[] = [];
    const out: IHighlightNode[][] = [last];

    nodes.forEach(node => {
        if (split(node)) {
            const n = [];
            if (splitNodeMode == "before") n.push(node);
            else if (splitNodeMode == "after") return last.push(node);

            last = n;
            out.push(n);
        } else {
            last.push(node);
        }
    });

    return out;
}
