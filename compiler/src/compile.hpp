#ifndef TANUKI_COMPILE_HPP_
#define TANUKI_COMPILE_HPP_
#include <string>
#include <vector>

#include "compilable_types.hpp"

class Compilator {
    std::vector<std::string> statements;
public:
    void compile(const Scope &);
    void compile(const LiteralExpression &);
    void compile(const VariableExpression &);
    void compile(const FunctionCall &);
    void compile(const Array &);
    void compile(const ForEachLoop &);
    std::vector<std::string> get_code();
};

#endif /* TANUKI_COMPILE_HPP_ */