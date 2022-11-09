import { useCallback } from 'react';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';

const ParticleBackground = () => {
	const particlesInit = useCallback(async (engine) => {
		// you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
		// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
		// starting from v2 you can add only the features you need reducing the bundle size
		await loadFull(engine);
	}, []);

	const particlesLoaded = useCallback(async (container) => {}, []);

	return (
		<Particles
			style={{
				opacity: 0.9,
			}}
			id='tsparticles'
			url='/particle.json'
			init={particlesInit}
			loaded={particlesLoaded}
		/>
	);
};

export default ParticleBackground;
