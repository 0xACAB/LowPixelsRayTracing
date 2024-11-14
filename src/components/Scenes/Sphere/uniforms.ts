const uniforms = {
	sphere: {
		type: 'struct',
		data: {
			position: {
				type: 'uniform3fv',
				data: [0.0, 0.0, 0.5],
			},
			radius: {
				type: 'uniform1f',
				data: 0.65,
			},
			material: {
				type: 'struct',
				data: {
					Kd: {
						type: 'uniform3fv',
						data: [0.6, 0.6, 0.6],
					},
					Ke: {
						type: 'uniform3fv',
						data: [0.0, 0.0, 0.0],
					},
				}
			}
		}
	},
	iMouse: {
		type: 'uniform2fv',
		data: [-999.0, -999.0],
	},
};
export default uniforms;
