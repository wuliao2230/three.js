export default /* glsl */`
#ifdef USE_INSTANCED
	mat3 normalMatrix = transposeMat3(inverseMat3(modelViewMatrix));
#endif
vec3 transformedNormal = normalMatrix * objectNormal;

#ifdef FLIP_SIDED

	transformedNormal = - transformedNormal;

#endif

#ifdef USE_TANGENT

	vec3 transformedTangent = normalMatrix * objectTangent;

	#ifdef FLIP_SIDED

		transformedTangent = - transformedTangent;

	#endif

#endif
`;
