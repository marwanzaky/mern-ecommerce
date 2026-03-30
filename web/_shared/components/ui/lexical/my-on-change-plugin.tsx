import { useEffect } from "react";

import { $getRoot } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function MyOnChangePlugin({
	onChange,
}: {
	onChange: (html: string, isEmpty: boolean) => void;
}) {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				const root = $getRoot();

				function serializeNode(node: any): string {
					const type = node.getType ? node.getType() : null;

					if (type === "paragraph") {
						const children = node.getChildren();
						const inner = children.map(serializeNode).join("");
						return `<p>${inner || "<br/>"}</p>`;
					}

					if (type === "image") {
						const json = node.exportJSON();
						return `<img src="${json.src}" alt="${json.alt ?? ""}" />`;
					}

					if (type === "linebreak") {
						return `<br/>`;
					}

					if (node.getChildren) {
						const children = node.getChildren();
						return children.map(serializeNode).join("");
					}

					return node.getTextContent ? node.getTextContent() : "";
				}

				const html = root.getChildren().map(serializeNode).join("");

				const isEmpty = root.getTextContent().trim().length === 0;

				onChange(html, isEmpty);
			});
		});
	}, [editor, onChange]);

	return null;
}
