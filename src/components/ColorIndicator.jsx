/**
 * ColorIndicator generates a circular color indicator
 *
 * @param {string} props.color - The fill color of the indicator.
 * @param {string} props.height - The height of the indicator (aspect ratio = 1).
 * @param {string} props.margin - The margin around the indicator (https://developer.mozilla.org/en-US/docs/Web/CSS/margin).
 * @returns {JSX.Element} styled \<div> element.
 */
function ColorIndicator(props) {
	return (
		<div
			style={{
				backgroundColor: props.color,
				border: '2px white solid',
				aspectRatio: '1',
				height: props.height,
				borderRadius: '50%',
				margin: props.margin,
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
