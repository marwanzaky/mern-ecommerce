import { useEffect } from "react";

import {
	$createImageNode,
	ImageNode,
} from "@shared/components/ui/lexical/nodes/image-node";

import { $insertNodes, $getRoot } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function LoadDescriptionPlugin({ html }: { html?: string }) {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		if (!html) return;

		editor.update(() => {
			const root = $getRoot();

			if (root.getTextContent().trim().length > 0) return;

			root.clear();

			const parser = new DOMParser();
			const dom = parser.parseFromString(html, "text/html");

			const nodes = $generateNodesFromDOM(editor, dom);
			$insertNodes(nodes);
		});
	}, [editor, html]);

	return null;
}

ImageNode.importDOM = () => ({
	img: () => ({
		conversion: (domNode: HTMLElement) => {
			const img = domNode as HTMLImageElement;
			return {
				node: $createImageNode(img.src, img.alt ?? ""),
			};
		},
		priority: 0,
	}),
});
