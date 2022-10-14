#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_time;

void main() {
    vec3 color = vec3(.3, .5, .3);
    
    color.r += sin(u_time.x * 1000.0) * .5;
    

    gl_FragColor = vec4(color, .5);

}
