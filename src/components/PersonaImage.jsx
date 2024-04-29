import React from 'react';

function PersonaImage({ dna }) {

	return (
		<div>
			<img src={`CHANGEME!!${dna}`} alt="Persona" />
		</div>
	)
}

export default PersonaImage;