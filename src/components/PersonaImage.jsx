import React from 'react';

function PersonaImage({ dna }) {

	return (
		<div>
			<object data={`PUT IN THA URL!!!!${dna}`} type="image/png">
				<p>Couldn't find persona photo</p>
			</object>
		</div>
	)
}

export default PersonaImage;