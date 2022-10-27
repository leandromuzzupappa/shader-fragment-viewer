#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159

#define PROCESSING_COLOR_SHADER
const vec3 turquoise = vec3(0.102,0.737,0.612);
const vec3 green_sea = vec3(0.086,0.627,0.522);
const vec3 emerald = vec3(0.18,0.8,0.443);
const vec3 nephritis = vec3(0.153,0.682,0.376);
const vec3 peter_river = vec3(0.204,0.596,0.859);
const vec3 belize_hole = vec3(0.161,0.502,0.725);
const vec3 amethyst = vec3(0.608,0.349,0.714);
const vec3 wisteria = vec3(0.557,0.267,0.678);
const vec3 wet_asphalt = vec3(0.204,0.286,0.369);
const vec3 midnight_blue = vec3(0.173,0.243,0.314);
const vec3 sun_flower = vec3(0.945,0.769,0.059);
const vec3 orange = vec3(0.953,0.612,0.071);
const vec3 carrot = vec3(0.902,0.494,0.133);
const vec3 pumpkin = vec3(0.827,0.329,0.);
const vec3 alizarin = vec3(0.906,0.298,0.235);
const vec3 pomegranade = vec3(0.753,0.224,0.169);
const vec3 clouds = vec3(0.925,0.941,0.945);
const vec3 silver = vec3(0.741,0.765,0.78);
const vec3 concrete = vec3(0.584,0.647,0.651);
const vec3 asbestos = vec3(0.498,0.549,0.553);


uniform vec2 u_resolution;
uniform float u_time;

// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// http://iquilezles.org/www/articles/voronoise/voronoise.htm
vec3 hash3( vec2 p ) {
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
                   dot(p,vec2(269.5,183.3)), 
                   dot(p,vec2(419.2,371.9)) );
    return fract(sin(q)*43758.5453);
}

float iqnoise( in vec2 x, float u, float v, float s ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
        
    float k = 1.0+63.0*pow(1.0-v,4.0);
    
    float va = 0.0;
    float wt = 0.0;
    vec4 ret;
    for ( float j=-2.; j<=2.; j+=1.) {
        for (float i=-2.; i<=2.; i+=1.) {
            
            vec2 g = vec2(i,j);
            vec3 o = hash3(p + g)*vec3(u,u,1.0);
            vec2 r = g - f + o.xy;
            
            float d = dot(r,r);
            float ww = pow( 1.0-smoothstep(0.0,s,sqrt(d)), k );
            va += o.z*ww;
            wt += ww;
        }
    }
    return va/wt;
}


void main(){
    
    vec2 coord = 2.0 * gl_FragCoord.xy / u_resolution.xy;
    coord.x *= u_resolution.x / u_resolution.y;

    float time = u_time * 10. * iqnoise( coord, 0., 0., sin(u_time * 1.3) );

    float si = sin( time * .1 );
    float co = cos( time * .1 );
    float n = iqnoise( ( coord - vec2( 0., time*.1 ) ) * 3.5, 0.5, 0., 10.1 );

    vec2 vt = ( coord - vec2( 0., time*.1 ) ) + n * ( co+si );
    float v0 = pow( iqnoise( vt * 3., 1., si, max( 0., 0.5 + si * .5 ) ), 3. );
    float v1 = pow( iqnoise( vt * 6., co, min( 1., co*si ),1.1 ), 3. );

    vec3 color = mix( 
        mix( mix(turquoise * si, pomegranade * n, emerald), wisteria, v0 ) * n,
        mix( sun_flower, emerald, v1 ), 
        si
    );


    gl_FragColor = vec4( color, 1. );

}