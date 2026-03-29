import { $createImageNode } from "@shared/components/ui/lexical/nodes/imageNode";
import { ButtonIcon } from "@shared/components/ui/buttonIcon";

import { $insertNodes } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { uploadFile } from "@redux/services/uploadsService";

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
			type="button"
			icon="upload"
			className="absolute top-[25px] right-4"
			onClick={insertImage}
		/>
	);
}
