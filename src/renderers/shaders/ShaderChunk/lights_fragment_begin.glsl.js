export default /* glsl */`
/**
 * This is a template that can be used to light a material, it uses pluggable
 * RenderEquations (RE)for specific lighting scenarios.
 *
 * Instructions for use:
 * - Ensure that both RE_Direct, RE_IndirectDiffuse and RE_IndirectSpecular are defined
 * - If you have defined an RE_IndirectSpecular, you need to also provide a Material_LightProbeLOD. <---- ???
 * - Create a material parameter that is to be passed as the third parameter to your lighting functions.
 *
 * TODO:
 * - Add area light support.
 * - Add sphere light support.
 * - Add diffuse light probe (irradiance cubemap) support.
 */

GeometricContext geometry;

geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = normalize( vViewPosition );

#ifdef CLEARCOAT

	geometry.clearcoatNormal = clearcoatNormal;

#endif

IncidentLight directLight;

#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		#ifdef EGRET
			#ifdef LIGHT_CULLING
				pointLight.cullingMask = int(pointLights[ i * POINT_LIGHT_SIZE + LIGHT_CULLING + 15]);
			#else
				pointLight.cullingMask = 1;
			#endif		
			if(bool(pointLight.cullingMask)) {
				pointLight.position = vec3(pointLights[ i  * POINT_LIGHT_SIZE + 0], pointLights[ i  * POINT_LIGHT_SIZE + 1], pointLights[ i  * POINT_LIGHT_SIZE + 2]);
				pointLight.color = vec3(pointLights[ i  * POINT_LIGHT_SIZE + 3], pointLights[ i  * POINT_LIGHT_SIZE + 4], pointLights[ i  * POINT_LIGHT_SIZE + 5]);
				pointLight.distance = pointLights[ i  * POINT_LIGHT_SIZE + 6];
				pointLight.decay = pointLights[ i  * POINT_LIGHT_SIZE + 7];

				getPointDirectLightIrradiance( pointLight, geometry, directLight );
				#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )

				pointLight.shadow = int(pointLights[ i  * POINT_LIGHT_SIZE + 8]);
				pointLight.shadowBias = pointLights[ i  * POINT_LIGHT_SIZE + 9];
				pointLight.shadowRadius = pointLights[ i  * POINT_LIGHT_SIZE + 10];
				pointLight.shadowMapSize = vec2(pointLights[ i  * POINT_LIGHT_SIZE + 11], pointLights[ i  * POINT_LIGHT_SIZE + 12]);
				pointLight.shadowCameraNear = pointLights[ i  * POINT_LIGHT_SIZE + 13];
				pointLight.shadowCameraFar = pointLights[ i  * POINT_LIGHT_SIZE + 14];

				directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
				#endif

				RE_Direct( directLight, geometry, material, reflectedLight );
			}	

		#else
			pointLight = pointLights[ i ];

			getPointDirectLightIrradiance( pointLight, geometry, directLight );

			#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
			directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
			#endif

			RE_Direct( directLight, geometry, material, reflectedLight );
		#endif

	}
    // #end unroll_loop

#endif

#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		#ifdef EGRET
			#ifdef LIGHT_CULLING
				spotLight.cullingMask = int(spotLights[ i * SPOT_LIGHT_SIZE + LIGHT_CULLING + 18]);
			#else
				spotLight.cullingMask = 1;
			#endif		
			if(bool(spotLight.cullingMask)) {
				spotLight.position = vec3(spotLights[ i  * SPOT_LIGHT_SIZE + 0], spotLights[ i  * SPOT_LIGHT_SIZE + 1], spotLights[ i  * SPOT_LIGHT_SIZE + 2]);
				spotLight.direction = vec3(spotLights[ i  * SPOT_LIGHT_SIZE + 3], spotLights[ i  * SPOT_LIGHT_SIZE + 4], spotLights[ i  * SPOT_LIGHT_SIZE + 5]);
				spotLight.color = vec3(spotLights[ i  * SPOT_LIGHT_SIZE + 6], spotLights[ i  * SPOT_LIGHT_SIZE + 7], spotLights[ i  * SPOT_LIGHT_SIZE + 8]);
				spotLight.distance = spotLights[ i  * SPOT_LIGHT_SIZE + 9];
				spotLight.decay = spotLights[ i  * SPOT_LIGHT_SIZE + 10];
				spotLight.coneCos = spotLights[ i  * SPOT_LIGHT_SIZE + 11];
				spotLight.penumbraCos = spotLights[ i  * SPOT_LIGHT_SIZE + 12];

				getSpotDirectLightIrradiance( spotLight, geometry, directLight );

				#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )

				spotLight.shadow = int(spotLights[ i  * SPOT_LIGHT_SIZE + 13]);
				spotLight.shadowBias = spotLights[ i  * SPOT_LIGHT_SIZE + 14];
				spotLight.shadowRadius = spotLights[ i  * SPOT_LIGHT_SIZE + 15];
				spotLight.shadowMapSize = vec2(spotLights[ i  * SPOT_LIGHT_SIZE + 16], spotLights[ i  * SPOT_LIGHT_SIZE + 17]);

				directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
				#endif

				RE_Direct( directLight, geometry, material, reflectedLight );
			}
		#else
			spotLight = spotLights[ i ];

			getSpotDirectLightIrradiance( spotLight, geometry, directLight );

			#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
			#endif

			RE_Direct( directLight, geometry, material, reflectedLight );
		#endif
	}
    // #end unroll_loop

#endif

#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

	DirectionalLight directionalLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
	
		#ifdef EGRET
			#ifdef LIGHT_CULLING
				directionalLight.cullingMask = int(directionalLights[ i * DIR_LIGHT_SIZE + LIGHT_CULLING + 11]);
			#else
				directionalLight.cullingMask = 1;
			#endif		
			if(bool(directionalLight.cullingMask)) {
				directionalLight.direction = vec3(directionalLights[ i  * DIR_LIGHT_SIZE + 0], directionalLights[ i  * DIR_LIGHT_SIZE + 1], directionalLights[ i  * DIR_LIGHT_SIZE + 2]);
				directionalLight.color = vec3(directionalLights[ i  * DIR_LIGHT_SIZE + 3], directionalLights[ i  * DIR_LIGHT_SIZE + 4], directionalLights[ i  * DIR_LIGHT_SIZE + 5]);

				getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );

				#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )

				directionalLight.shadow = int(directionalLights[ i  * DIR_LIGHT_SIZE + 6]);
				directionalLight.shadowBias = directionalLights[ i  * DIR_LIGHT_SIZE + 7];
				directionalLight.shadowRadius = directionalLights[ i  * DIR_LIGHT_SIZE + 8];
				directionalLight.shadowMapSize = vec2(directionalLights[ i  * DIR_LIGHT_SIZE + 9], directionalLights[ i  * DIR_LIGHT_SIZE + 10]);

				directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
				#endif

				RE_Direct( directLight, geometry, material, reflectedLight );
			}	
		#else			
			directionalLight = directionalLights[ i ];

			getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );

			#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
			directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
			#endif

			RE_Direct( directLight, geometry, material, reflectedLight );
		#endif
	}
    // #end unroll_loop

#endif

#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		#ifdef EGRET
			#ifdef LIGHT_CULLING
				rectAreaLight.cullingMask = int(rectAreaLights[ i * RECT_AREA_LIGHT_SIZE + LIGHT_CULLING + 12]);
			#else
				rectAreaLight.cullingMask = 1;
			#endif	
			if(bool(rectAreaLight.cullingMask)) {
				rectAreaLight.position = vec3(rectAreaLights[ i  * RECT_AREA_LIGHT_SIZE + 0], rectAreaLights[ i  * RECT_AREA_LIGHT_SIZE + 1], rectAreaLights[ i  * RECT_AREA_LIGHT_SIZE + 2]);
				rectAreaLight.color = vec3(rectAreaLights[ i  * RECT_AREA_LIGHT_SIZE + 3], rectAreaLights[ i  * RECT_AREA_LIGHT_SIZE + 4], rectAreaLights[ i  * RECT_AREA_LIGHT_SIZE + 5]);
				rectAreaLight.halfWidth = vec3(rectAreaLights[ i  * RECT_AREA_LIGHT_SIZE + 6], rectAreaLights[ i  * RECT_AREA_LIGHT_SIZE + 7], rectAreaLights[ i  * RECT_AREA_LIGHT_SIZE + 8]);
				rectAreaLight.halfHeight = vec3(rectAreaLights[ i  * RECT_AREA_LIGHT_SIZE + 9], rectAreaLights[ i  * RECT_AREA_LIGHT_SIZE + 10], rectAreaLights[ i  * RECT_AREA_LIGHT_SIZE + 11]);
				RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
			}	
		#else
			rectAreaLight = rectAreaLights[ i ];
			RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
		#endif
	}
    // #end unroll_loop

#endif

#if defined( RE_IndirectDiffuse )

	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#ifdef EGRET

	#else
		irradiance += getLightProbeIrradiance( lightProbe, geometry );
	#endif
	
	#if (NUM_HEMI_LIGHTS > 0 )
		HemisphereLight hemisphereLight;

		#pragma unroll_loop
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			
			#ifdef EGRET
				#ifdef LIGHT_CULLING
					hemisphereLight.cullingMask = int(hemisphereLights[ i * HEMI_LIGHT_SIZE + LIGHT_CULLING + 9]);
				#else
					hemisphereLight.cullingMask = 1;
				#endif	
				if(bool(hemisphereLight.cullingMask)) {
					hemisphereLight.direction = vec3(hemisphereLights[ i  * HEMI_LIGHT_SIZE + 0], hemisphereLights[ i  * HEMI_LIGHT_SIZE + 1], hemisphereLights[ i  * HEMI_LIGHT_SIZE + 2]);
					hemisphereLight.skyColor = vec3(hemisphereLights[ i  * HEMI_LIGHT_SIZE + 3], hemisphereLights[ i  * HEMI_LIGHT_SIZE + 4], hemisphereLights[ i  * HEMI_LIGHT_SIZE + 5]);
					hemisphereLight.groundColor = vec3(hemisphereLights[ i  * HEMI_LIGHT_SIZE + 6], hemisphereLights[ i  * HEMI_LIGHT_SIZE + 7], hemisphereLights[ i  * HEMI_LIGHT_SIZE + 8]);

					irradiance += getHemisphereLightIrradiance( hemisphereLight, geometry );
				}	
			#else
				irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
			#endif
		}
		// #end unroll_loop

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );

#endif
`;
