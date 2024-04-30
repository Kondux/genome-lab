import React from 'react';

function PersonaImage({ dna }) {

	return (
		<div>
			<object data={`https://5x1vj0debk.execute-api.us-east-1.amazonaws.com/default/fetch_persona_photo_from_dna?dna=0x${dna}`} type="image/png">
				<p>Couldn't find persona photo</p>
			</object>
		</div>
	)
}

export default PersonaImage;