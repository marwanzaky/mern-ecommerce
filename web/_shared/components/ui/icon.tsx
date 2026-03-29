import Image from "next/image";

type IconProps = {
	src: string;
	className?: string;
	size?: number;
	onClick?: React.MouseEventHandler<HTMLImageElement>;
};

export default function Icon({
	src,
	className,
	onClick,
	size = 24,
}: IconProps) {
	return (
		<Image
			className={className}
			src={`/svgs/${src}`}
			width={size}
			height={size}
			onClick={onClick}
			alt={""}
		/>
	);
}
