import React, {useMemo, useCallback, useRef} from "react";
import {ISyntaxHighlighterLineProps} from "./_types/ISyntaxHighlighterLineProps";
import {SyntaxHighlighterNodes} from "./SyntaxHighlighterNodes";
import {SyntaxHighlighterSelection} from "./SyntaxHighlighterSelection";
import {useCursorScroll} from "./useCursorScroll";
import {useHorizontalScroll} from "../../hooks/useHorizontalScroll";
import {LFC} from "../../_types/LFC";

/**
 * A simple component to render syntax highlighted using a passed highlighter
 */
export const SyntaxHighlighterLine: LFC<ISyntaxHighlighterLineProps> = ({
    selection,
    onSelectionChange,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    scrollCursorPadding = 30,
    getPixelSelection,
    nodes,
    ...rest
}) => {
    const selectionOffset = nodes[0]?.start ?? 0;
    const relativeSelection = {
        start: (selection?.start ?? 0) - selectionOffset,
        end: (selection?.end ?? 0) - selectionOffset,
    };

    // Selection listeners
    const dragging = useRef(false);
    const onDragEnd = useRef(() => {
        dragging.current = false;
        document.removeEventListener("mouseup", onDragEnd.current);
    });
    const caughtLineClick = useRef(false);
    const onDragStart = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            dragging.current = true;
            document.addEventListener("mouseup", onDragEnd.current);

            // Select the last index if clicking in the div but not on a character
            if (!caughtLineClick.current) {
                const index = nodes.reduce((cur, node) => Math.max(node.end, cur), 0);
                selectionRef.current = {
                    start:
                        (e.shiftKey ? selectionRef.current?.start : undefined) ?? index,
                    end: index,
                };
                onSelectionChange?.(selectionRef.current);
            }
            caughtLineClick.current = false;
        },
        [nodes]
    );

    const selectionRef = useRef(selection);
    selectionRef.current = selection;
    const mouseDownHandler = useCallback(
        (e: React.MouseEvent<HTMLSpanElement>, i: number) => {
            onMouseDown?.(e, i);
            const index = Math.round(i);
            if (
                selectionRef.current?.start != index ||
                selectionRef.current?.end != index
            ) {
                selectionRef.current = {
                    start:
                        (e.shiftKey ? selectionRef.current?.start : undefined) ?? index,
                    end: index,
                };
                onSelectionChange?.(selectionRef.current);
            }
            caughtLineClick.current = true;
        },
        [onSelectionChange, onMouseDown]
    );
    const mouseMoveHandler = useCallback(
        (e, i: number) => {
            onMouseMove?.(e, i);
            const index = Math.round(i);
            if (dragging.current && selectionRef.current?.end != index) {
                selectionRef.current = {
                    start: selectionRef.current?.start ?? index,
                    end: index,
                };
                onSelectionChange?.(selectionRef.current);
            }
        },
        [onSelectionChange]
    );

    // Scroll manager
    const horizontalScrollRef = useHorizontalScroll();
    const [cursorScrollRef, onPixelSelectionChange] = useCursorScroll(
        scrollCursorPadding,
        getPixelSelection
    );

    // Manage the refs
    const refs = useCallback(
        (el: HTMLDivElement) => {
            [horizontalScrollRef, ...cursorScrollRef].forEach(r => {
                if (r instanceof Function) {
                    r(el);
                } else {
                    r.current = el;
                }
            });
        },
        [horizontalScrollRef, cursorScrollRef]
    );

    // Determine whether or not to render a wrapper component at all
    const nodesEl = (
        <SyntaxHighlighterNodes
            nodes={nodes}
            onMouseDown={(onSelectionChange || onMouseDown) && mouseDownHandler}
            onMouseMove={(onSelectionChange || onMouseMove) && mouseMoveHandler}
            onMouseUp={onMouseUp}
        />
    );
    return (
        <div
            style={{
                userSelect: "none",
                whiteSpace: "pre",
                overflowX: "auto",
                position: "relative",
                width: "100%",
            }}
            ref={refs}
            onMouseDown={onSelectionChange && onDragStart}
            onMouseUp={onSelectionChange && onDragEnd.current}>
            {selection ? (
                <SyntaxHighlighterSelection
                    selection={relativeSelection}
                    isEnd={true}
                    getPixelSelection={onPixelSelectionChange}>
                    {nodesEl}
                </SyntaxHighlighterSelection>
            ) : (
                nodesEl
            )}
        </div>
    );
};
