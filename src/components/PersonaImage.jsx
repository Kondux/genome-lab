import React from 'react';

function PersonaImage({ dna }) {

	return (
		<div>
			<object data={`https://${process.env.REACT_APP_PERSONA_URL}${dna}`} type="image/png">
				<p>Couldn't find persona photo</p>
			</object>
		</div>
	)
}

export default PersonaImage;