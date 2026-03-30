"use client";

import { useEffect, useRef, useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@shadcn/components/ui/dialog";

import clsx from "clsx";
import { chatService } from "@redux/services/chat-service";
import { Input } from "@shadcn/components/ui/input";

type ChatbotMessage = {
	type: "ai" | "user";
	text: string;
	date: string;
};

function Message({
	type,
	children,
	date,
}: {
	type: "ai" | "user";
	children: React.ReactNode;
	date: string;
}) {
	return (
		<div
			className={clsx("flex", type === "ai" ? "justify-start" : "justify-end")}
		>
			<div
				className={clsx(
					"flex flex-col gap-1 max-w-[16rem]",
					type === "ai" ? "items-start" : "items-end",
				)}
			>
				<div
					className={clsx(
						"p-2 rounded-md shadow-sm",
						type === "ai" ? "border" : "bg-primary text-white",
					)}
				>
					{children}
				</div>
				<div className="text-gray-500 text-xs leading-none">{date}</div>
			</div>
		</div>
	);
}

export default function Chatbot() {
	const ref = useRef<HTMLDivElement>(null);

	const [visible, setVisible] = useState(true);

	const [inputValue, setInputValue] = useState("");
	const [messages, setMessages] = useState<ChatbotMessage[]>([
		{
			type: "ai",
			text: "How can I assist you today?",
			date: "13:34 PM",
		},
		{
			type: "user",
			text: "I'm looking for running shoes under $100.",
			date: "13:35 PM",
		},
		{
			type: "ai",
			text: "Our products range from $10 to $100. Is there a specific item you're interested in?",
			date: "13:35 PM",
		},
	]);

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}
	}, [messages]);

	return (
		<Dialog modal={false} open={visible}>
			<DialogContent className="max-w-sm left-auto top-auto translate-x-0 translate-y-0 bottom-4 right-4">
				<DialogHeader>
					<DialogTitle>AI Assistance</DialogTitle>
					<DialogDescription>
						Get instant help with your shopping, orders, and questions—24/7 AI
						support.
					</DialogDescription>
				</DialogHeader>

				<div
					className="flex flex-col gap-4 h-96 overflow-auto scrollbar-hide"
					ref={ref}
				>
					{messages.map((item, i) => (
						<Message
							key={"chatbox-message-" + i}
							type={item.type}
							date={item.date}
						>
							{item.text}
						</Message>
					))}
				</div>

				<DialogFooter className="sm:justify-start">
					<Input
						className="w-full"
						placeholder="Enter your message"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={async (e) => {
							if (e.key === "Enter" && inputValue) {
								chatService
									.chat({
										message: inputValue,
										previousChat: messages.map((item) => {
											if (item.type === "ai") {
												return `Chat Bot: ${item.text}`;
											} else if (item.type === "user") {
												return `User: ${item.text}`;
											}
											return "";
										}),
									})
									.then((answer) => {
										setMessages((value) => [
											...value,
											{
												type: "ai",
												text: answer,
												date: new Date().toLocaleTimeString([], {
													hour: "numeric",
													minute: "2-digit",
													hour12: true,
												}),
											},
										]);
									});

								setMessages((value) => [
									...value,
									{
										type: "user",
										text: inputValue,
										date: new Date().toLocaleTimeString([], {
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
										}),
									},
								]);

								setInputValue("");
							}
						}}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
