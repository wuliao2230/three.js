export default /* glsl */`
#ifdef USE_ENVMAP

	#ifdef ENV_WORLDPOS

		vWorldPosition = worldPosition.xyz;

	#else

		vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );

		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );

		#ifdef EGRET
			#ifndef ENVMAP_MODE_REFRACTION
				vReflect = reflect( cameraToVertex, worldNormal );
			#else
				vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
			#endif
			
		#else

			#ifdef ENVMAP_MODE_REFLECTION

				vReflect = reflect( cameraToVertex, worldNormal );

			#else

				vReflect = refract( cameraToVertex, worldNormal, refractionRatio );

			#endif

		#endif

		

	#endif

#endif
`;
