
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2    u_resolution;
uniform vec2    u_mouse;
uniform float   u_time;

varying vec2    v_texcoord;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(0.3);

    vec2 translate = vec2(-.5);
    coord += translate;

    color.r = abs(.1 + length(coord) - .6 * abs(sin(u_time * .9 / 12.0)));
    color.g = abs(.1 + length(coord) - .6 * abs(sin(u_time * .6 / 4.0)));
    color.b = abs(.1 + length(coord) - .6 * abs(sin(u_time * .3 / 9.0)));
    
    gl_FragColor = vec4(.1 / color, 1.0);
}
