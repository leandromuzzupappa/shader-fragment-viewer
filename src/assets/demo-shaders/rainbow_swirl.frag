#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {

    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(.3);

    float angle = atan(-coord.y + .25, coord.x - .5) * .1;
    float len = length(coord - vec2(.5, .25));

    color.r += sin(len * 50.0 + angle * 40.0 + u_time * 2.0);
    color.g += sin(len * 50.0 + angle * 30.0 - u_time * 2.0);
    color.b += cos(len * 50.0 + angle * 20.0 + 3.0);

    gl_FragColor = vec4(color, 1.0);
}