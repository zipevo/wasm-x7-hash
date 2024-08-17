#include "emscripten.h"
#include "x7.h"

EMSCRIPTEN_KEEPALIVE
uint8_t* create_buffer(uint32_t size) {
  return malloc(size * sizeof(char));
}

EMSCRIPTEN_KEEPALIVE
void destroy_buffer(uint8_t* p) {
  free(p);
}

EMSCRIPTEN_KEEPALIVE
void digest(uint8_t* p_in, uint8_t* p_out, uint32_t input_size) {
    x7_hash((char *) p_in, (char *) p_out, input_size);
}
