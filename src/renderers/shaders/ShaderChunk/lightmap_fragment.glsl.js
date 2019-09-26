export default /* glsl */`
#ifdef USE_LIGHTMAP
	#ifdef EGRET
		vec4 lightmapTex = texture2D(lightMap, vUv2);
		// float power = pow( 2.0, lightmapTex.a * 255.0 - 128.0);
		float power = 5.0 * lightmapTex.a;
		reflectedLight.indirectDiffuse += PI * lightmapTex.rgb * power * lightMapIntensity;
	#else
		reflectedLight.indirectDiffuse += PI * texture2D( lightMap, vUv2 ).xyz * lightMapIntensity; // factor of PI should not be present; included here to prevent breakage
	#endif

#endif
`;
