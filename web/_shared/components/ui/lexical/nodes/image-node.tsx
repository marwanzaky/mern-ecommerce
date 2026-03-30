import { DecoratorNode, NodeKey } from "lexical";
import { JSX } from "react";

type SerializedImageNode = {
	type: string;
	version: number;
	src: string;
	alt?: string;
};

export class ImageNode extends DecoratorNode<JSX.Element> {
	__src: string;
	__alt: string;

	static getType() {
		return "image";
	}

	static clone(node: ImageNode) {
		return new ImageNode(node.__src, node.__alt, node.__key);
	}

	constructor(src: string = "", alt: string = "", key?: NodeKey) {
		super(key);
		this.__src = src;
		this.__alt = alt;
	}

	static importJSON(serializedNode: SerializedImageNode) {
		const { src, alt } = serializedNode;
		return new ImageNode(src, alt);
	}

	exportJSON(): SerializedImageNode {
		return {
			type: "image",
			version: 1,
			src: this.__src,
			alt: this.__alt,
		};
	}

	createDOM() {
		return document.createElement("div");
	}

	updateDOM() {
		return false;
	}

	decorate() {
		return <img src={this.__src} alt={this.__alt} className="rounded-lg" />;
	}
}

export function $createImageNode(src: string, alt?: string) {
	return new ImageNode(src, alt);
}
