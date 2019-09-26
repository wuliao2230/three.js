export default /* glsl */`
#ifdef USE_UV
	
	#ifdef EGRET  
		#if defined FLIP_V
			vUv = ( uvTransform * vec3( uv.x, 1.0 - uv.y, 1.0 ) ).xy;
		#else
			vUv = ( uvTransform * vec3( uv, 1.0 ) ).xy;
		#endif

	#else
		vUv = ( uvTransform * vec3( uv, 1.0 ) ) ).xy;
	#endif

#endif
`;
