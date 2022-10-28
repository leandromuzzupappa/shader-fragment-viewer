#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

uniform sampler2D u_tex0;

float random2d(vec2 coord){
    return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(){
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(0.4);
    float grain = .0;

    grain = random2d(vec2(sin(coord) / atan(999.9)  * u_time));

    vec4 image = texture2D(u_tex0, coord);

    color = vec3(grain);
    color = mix(color, image.rgb, .1);

    gl_FragColor = vec4(color, 1.0);
}