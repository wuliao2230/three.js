export default /* glsl */`
vec3 diffuse = vec3( 1.0 );

GeometricContext geometry;
geometry.position = mvPosition.xyz;
geometry.normal = normalize( transformedNormal );
geometry.viewDir = normalize( -mvPosition.xyz );

GeometricContext backGeometry;
backGeometry.position = geometry.position;
backGeometry.normal = -geometry.normal;
backGeometry.viewDir = geometry.viewDir;

vLightFront = vec3( 0.0 );
vIndirectFront = vec3( 0.0 );

#ifdef DOUBLE_SIDED
	vLightBack = vec3( 0.0 );
	vIndirectBack = vec3( 0.0 );
#endif

IncidentLight directLight;
float dotNL;
vec3 directLightColor_Diffuse;

#if NUM_POINT_LIGHTS > 0
	PointLight pointLight;
	#pragma unroll_loop
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

 		// modified by egret
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
			
				float dotNL = dot( geometry.normal, directLight.direction );
				directLightColor_Diffuse = PI * directLight.color;
			
				vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
			
				#ifdef DOUBLE_SIDED
			
					vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
			
				#endif
			}
		#else
			getPointDirectLightIrradiance( pointLights[ i ], geometry, directLight );

			dotNL = dot( geometry.normal, directLight.direction );
			directLightColor_Diffuse = PI * directLight.color;

			vLightFront += saturate( dotNL ) * directLightColor_Diffuse;

			#ifdef DOUBLE_SIDED

				vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;

			#endif

		#endif		
	}
    // #end unroll_loop

#endif

#if NUM_SPOT_LIGHTS > 0
	SpotLight spotLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

 		// modified by egret
		#ifdef EGRET			
			#ifdef LIGHT_CULLING
				spotLight.cullingMask = int(spotLights[ i  * SPOT_LIGHT_SIZE + LIGHT_CULLING + 18]);
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
			
				float dotNL = dot( geometry.normal, directLight.direction );
				directLightColor_Diffuse = PI * directLight.color;
			
				vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
			
				#ifdef DOUBLE_SIDED
			
					vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
			
				#endif
			}
		#else
			getSpotDirectLightIrradiance( spotLights[ i ], geometry, directLight );

			dotNL = dot( geometry.normal, directLight.direction );
			directLightColor_Diffuse = PI * directLight.color;
			vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
			#ifdef DOUBLE_SIDED

				vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;

			#endif
		#endif		
	}
    // #end unroll_loop

#endif

/*
#if NUM_RECT_AREA_LIGHTS > 0

	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		// TODO (abelnation): implement

	}

#endif
*/

#if NUM_DIR_LIGHTS > 0
	DirectionalLight directionalLight;
	#pragma unroll_loop
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

 		// modified by egret
		#ifdef EGRET			
			#ifdef LIGHT_CULLING
				directionalLight.cullingMask = int(directionalLights[ i  * DIR_LIGHT_SIZE + LIGHT_CULLING + 11]);
			#else
				directionalLight.cullingMask = 1;
			#endif
			if(bool(directionalLight.cullingMask)) {
				directionalLight.direction = vec3(directionalLights[ i  * DIR_LIGHT_SIZE + 0], directionalLights[ i  * DIR_LIGHT_SIZE + 1], directionalLights[ i  * DIR_LIGHT_SIZE + 2]);
				directionalLight.color = vec3(directionalLights[ i  * DIR_LIGHT_SIZE + 3], directionalLights[ i  * DIR_LIGHT_SIZE + 4], directionalLights[ i  * DIR_LIGHT_SIZE + 5]);
				getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );
			
				float dotNL = dot( geometry.normal, directLight.direction );
				directLightColor_Diffuse = PI * directLight.color;
			
				vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
			
				#ifdef DOUBLE_SIDED
			
					vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
			
				#endif
			}		
		#else
			getDirectionalDirectLightIrradiance( directionalLights[ i ], geometry, directLight );

			dotNL = dot( geometry.normal, directLight.direction );
			directLightColor_Diffuse = PI * directLight.color;

			vLightFront += saturate( dotNL ) * directLightColor_Diffuse;

			#ifdef DOUBLE_SIDED

				vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;

			#endif
		#endif
	}
    // #end unroll_loop

#endif

#if NUM_HEMI_LIGHTS > 0

	HemisphereLight hemisphereLight;

	#pragma unroll_loop
	for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
		// modified by egret
		#ifdef EGRET			
			#ifdef LIGHT_CULLING
				hemisphereLight.cullingMask = int(hemisphereLights[ i  * HEMI_LIGHT_SIZE + LIGHT_CULLING + 9]);
			#else
				hemisphereLight.cullingMask = 1;
			#endif
			if(bool(hemisphereLight.cullingMask)) {
				hemisphereLight.direction = vec3(hemisphereLights[ i  * HEMI_LIGHT_SIZE + 0], hemisphereLights[ i  * HEMI_LIGHT_SIZE + 1], hemisphereLights[ i  * HEMI_LIGHT_SIZE + 2]);
				hemisphereLight.skyColor = vec3(hemisphereLights[ i  * HEMI_LIGHT_SIZE + 3], hemisphereLights[ i  * HEMI_LIGHT_SIZE + 4], hemisphereLights[ i  * HEMI_LIGHT_SIZE + 5]);
				hemisphereLight.groundColor = vec3(hemisphereLights[ i  * HEMI_LIGHT_SIZE + 6], hemisphereLights[ i  * HEMI_LIGHT_SIZE + 7], hemisphereLights[ i  * HEMI_LIGHT_SIZE + 8]);
			
				vIndirectFront += getHemisphereLightIrradiance( hemisphereLight, geometry );
			
				#ifdef DOUBLE_SIDED
			
					vIndirectBack += getHemisphereLightIrradiance( hemisphereLight, backGeometry );
			
				#endif
			}			
		#else
			vIndirectFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
	
			#ifdef DOUBLE_SIDED
	
				vIndirectBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry );
	
			#endif
		#endif
	}
    // #end unroll_loop

#endif
`;
