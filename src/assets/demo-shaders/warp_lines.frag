#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    float color = 0.0;


    for(int n = 0; n < 30; n++){
        float i = float(n);

        i = mod(i, 2.0) == 0.0 ? -1.0 : 1.0;

        color += sin(coord.x * 50.4 * i + u_time * .2 + cos(u_time + coord.x * 10.0 + cos(-coord.x + 60.0 * i + u_time * 2.0))) * 2.0;
        
        
    }

    
    gl_FragColor = vec4(color + coord.x, color + coord.y, color, 1.0);
}