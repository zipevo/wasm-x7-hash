#include "emscripten.h"
#include "x11.h"

EMSCRIPTEN_KEEPALIVE
// TODO: replace with uint32_t ?
// https://stackoverflow.com/questions/20077313/uint32-t-vs-int-as-a-convention-for-everyday-programming
uint8_t* create_buffer(int size) {
  return malloc(size * sizeof(char));
}

EMSCRIPTEN_KEEPALIVE
void destroy_buffer(uint8_t* p) {
  free(p);
}

EMSCRIPTEN_KEEPALIVE
void digest(uint8_t* p_in, uint8_t* p_out, uint32_t input_size) {
    // https://stackoverflow.com/questions/42961443/convert-from-uint8-t-to-char-in-c
    char * input = (char *) p_in;
    char * output = (char *) p_out;

    x11_hash(input, output, input_size);
}
