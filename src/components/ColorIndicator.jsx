/**
 * ColorIndicator generates a circular color indicator
 *
 * @param {string} props.color - The fill color of the indicator.
 * @param {string} props.height - The height of the indicator (aspect ratio = 1).
 * @param {string} props.margin - The margin around the indicator (https://developer.mozilla.org/en-US/docs/Web/CSS/margin).
 * @returns {JSX.Element} styled \<div> element.
 */
function ColorIndicator({ color, height, margin }) {
	return (
		<div
			style={{
				backgroundColor: color,
				border: '2px solid rgba(255, 255, 255, 0.5)',
				aspectRatio: '1',
				height,
				borderRadius: '50%',
				margin,
				boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
			}}
		/>
	);
}

ColorIndicator.defaultProps = {
	color: 'transparent',
	height: '1.5rem',
	margin: '0',
};

export default ColorIndicator;
