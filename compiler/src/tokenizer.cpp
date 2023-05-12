#include "tokenizer.hpp"

#include <iostream>

int main() {
    std::string S;
    std::getline(std::cin, S);
    std::cout << Tokenizer(S).tokenize() << '\n';
    return 0;
}