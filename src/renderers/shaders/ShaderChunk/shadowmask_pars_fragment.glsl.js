export default /* glsl */`
float getShadowMask() {

	float shadow = 1.0;

	#ifdef USE_SHADOWMAP

	#if NUM_DIR_LIGHT_SHADOWS > 0

	DirectionalLight directionalLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {

		#ifdef EGRET
			directionalLight.shadow = int(directionalLights[ i  * DIR_LIGHT_SIZE + 6]);
			directionalLight.shadowBias = directionalLights[ i  * DIR_LIGHT_SIZE + 7];
			directionalLight.shadowRadius = directionalLights[ i  * DIR_LIGHT_SIZE + 8];
			directionalLight.shadowMapSize = vec2(directionalLights[ i  * DIR_LIGHT_SIZE + 9], directionalLights[ i  * DIR_LIGHT_SIZE + 10]);
			#ifdef LIGHT_CULLING
				directionalLight.cullingMask = int(directionalLights[ i * DIR_LIGHT_SIZE + LIGHT_CULLING + 11]);
			#else
				directionalLight.cullingMask = 1;
			#endif

			shadow *= bool( directionalLight.shadow * directionalLight.cullingMask ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#else
			directionalLight = directionalLights[ i ];
			shadow *= bool( directionalLight.shadow ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

		#endif
	}
    // #end unroll_loop

	#endif

	#if NUM_SPOT_LIGHT_SHADOWS > 0

	SpotLight spotLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {

		#ifdef EGRET
			spotLight.shadow = int(spotLights[ i  * SPOT_LIGHT_SIZE + 13]);
			spotLight.shadowBias = spotLights[ i  * SPOT_LIGHT_SIZE + 14];
			spotLight.shadowRadius = spotLights[ i  * SPOT_LIGHT_SIZE + 15];
			spotLight.shadowMapSize = vec2(spotLights[ i  * SPOT_LIGHT_SIZE + 16], spotLights[ i  * SPOT_LIGHT_SIZE + 17]);
			#ifdef LIGHT_CULLING
				spotLight.cullingMask = int(spotLights[ i * SPOT_LIGHT_SIZE + LIGHT_CULLING + 18]);
			#else
				spotLight.cullingMask = 1;
			#endif

			shadow *= bool(spotLight.shadow * spotLight.cullingMask) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
		#else
			spotLight = spotLights[ i ];
			shadow *= bool(spotLight.shadow) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
		#endif
			
	}
    // #end unroll_loop

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

	PointLight pointLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {

		#ifdef EGRET
			pointLight.shadow = int(pointLights[ i  * POINT_LIGHT_SIZE + 8]);
			pointLight.shadowBias = pointLights[ i  * POINT_LIGHT_SIZE + 9];
			pointLight.shadowRadius = pointLights[ i  * POINT_LIGHT_SIZE + 10];
			pointLight.shadowMapSize = vec2(pointLights[ i  * POINT_LIGHT_SIZE + 11], pointLights[ i  * POINT_LIGHT_SIZE + 12]);
			pointLight.shadowCameraNear = pointLights[ i  * POINT_LIGHT_SIZE + 13];
			pointLight.shadowCameraFar = pointLights[ i  * POINT_LIGHT_SIZE + 14];
			#ifdef LIGHT_CULLING
				pointLight.cullingMask = int(pointLights[ i  * POINT_LIGHT_SIZE + LIGHT_CULLING + 15 ]);
			#else
				pointLight.cullingMask = 1;
			#endif

			shadow *= bool(pointLight.shadow * pointLight.cullingMask) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
		
		#else
			pointLight = pointLights[ i ];
			shadow *= bool(pointLight.shadow) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
		#endif
		
	}
    // #end unroll_loop

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): update shadow for Area light

	#endif
	*/

	#endif

	return shadow;

}
`;
