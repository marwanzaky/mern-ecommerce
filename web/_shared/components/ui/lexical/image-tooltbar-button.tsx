import { $createImageNode } from "@shared/components/ui/lexical/nodes/image-node";
import { ButtonIcon } from "@shared/components/ui/button-icon";

import { $insertNodes } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { uploadFile } from "@redux/services/uploads-service";

export function ImageToolbarButton() {
	const [editor] = useLexicalComposerContext();

	const insertImage = async () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.click();

		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;

			try {
				const url = await uploadFile(file);

				editor.update(() => {
					const imageNode = $createImageNode(url, file.name);
					$insertNodes([imageNode]);
				});
			} catch (err) {
				console.error("Image upload failed:", err);
			}
		};
	};

	return (
		<ButtonIcon
			size="sm"
			type="button"
			icon="upload"
			className="absolute top-0.75 right-4"
			onClick={insertImage}
		/>
	);
}
