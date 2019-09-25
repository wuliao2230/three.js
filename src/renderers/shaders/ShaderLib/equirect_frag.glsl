uniform sampler2D tEquirect;

varying vec3 vWorldPosition;

#include <common>

void main() {

	vec3 direction = normalize( vWorldPosition );

	vec2 sampleUV;
	sampleUV.y = asin( clamp( direction.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;

	#ifdef EGRET  
		sampleUV.y = 1.0 - sampleUV.y;// modified by egret
	#endif
	
	sampleUV.x = atan( direction.z, direction.x ) * RECIPROCAL_PI2 + 0.5;

	gl_FragColor = texture2D( tEquirect, sampleUV );

	// TODO shader texColor #include <tonemapping_fragment>

}
