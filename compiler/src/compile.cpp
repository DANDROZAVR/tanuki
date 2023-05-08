#include <iostream>
#include <string>
#include <vector>

#include "compile.hpp"
#include "parser.hpp"
#include "util.hpp"

std::string pref = "const puppeteer = require('puppeteer');\n\nasync function start() {\n\tconst browser = await puppeteer.launch({headless: false});\n\tconst page = await browser.newPage();\n\tasync function getText(XPath) {\n\t\tawait page.waitForXPath(XPath, {timeout:0});\n\t\tconst [getXpath] = await page.$x(XPath);\n\t\treturn await page.evaluate(name => name.textContent, getXpath);\n\t}\n";
std::string suf = "\n}\n\nexports.start = start;";


/* Compiler implementation */ 

void Compilator::compile(const Scope & scope)  {
    statements.emplace_back("{");
    statements.emplace_back("\n");
    for(auto & st : scope.statements) {
        st->compile(*this);
        statements.emplace_back("\n");
    }
    statements.emplace_back("}");
}

void Compilator::compile(const LiteralExpression & expression) {
    if(has_type<NumberToken>(expression)) {
        auto it = std::get<NumberToken>(expression);
        statements.emplace_back(std::to_string(it.repr()));
    } else {
        auto it = std::get<LiteralToken>(expression);
        statements.emplace_back("'" + it.repr() + "'");
    }
}

void Compilator::compile(const VariableExpression & expression) {
    statements.emplace_back(static_cast<const std::string &>(expression));
}

void Compilator::compile(const FunctionCall & function_call) {
    auto & name = function_call.function.get().name;
    if(name == "clickTimes") { //  await page.click('#pow', {clickCount: 3})
        statements.emplace_back("await page.click(");
        function_call.args[0]->compile(*this);
        statements.emplace_back(", {clickCount: ");
        function_call.args[1]->compile(*this);
        statements.emplace_back("});");
        return;
    }
    if(name == "print") {
        statements.emplace_back("console.log(");
        function_call.args[0]->compile(*this);
        statements.emplace_back(");");
        return;
    }
    if(name == "getText") {
        statements.emplace_back("await getText(");
        function_call.args[0]->compile(*this);
        statements.emplace_back(");");
        return;
    }
    if(name == "=") { // TODO fix infix functions (operators)
        function_call.args[0]->compile(*this);
        statements.emplace_back(" = ");
        function_call.args[1]->compile(*this);
        statements.emplace_back(";");
        return;
    }
    statements.emplace_back("await page." + function_call.function.get().name + '(');
    function_call.args[0]->compile(*this);
    for(int i=1;i<function_call.function.get().arity;++i) {
        statements.emplace_back(", ");
        function_call.args[i]->compile(*this);
    }
    statements.emplace_back(");");
}

void Compilator::compile(const Array & array) {
    statements.emplace_back("[");
    if(!array.empty()) {
        array[0]->compile(*this);
        for_each(array.begin()+1, array.end(), [&](auto & x){statements.emplace_back(", "); x->compile(*this);});
    }
    statements.emplace_back("]");
}

void Compilator::compile(const ForEachLoop & loop) {
    statements.emplace_back("for (");
    loop.var->compile(*this);
    statements.emplace_back(" of ");
    loop.iterable->compile(*this);
    statements.emplace_back(")");
    statements.emplace_back("\n");
    loop.scope->compile(*this);
}

std::vector<std::string> Compilator::get_code() {
    return std::move(statements);
}

/* Compiler implementation END */

std::string get_compiled_code(Prog_AST const & prog) {
    Compilator compilator;
    compilator.compile(*prog.code);
    std::vector<std::string> comm = compilator.get_code();
    int level = 1;
    std::string res = pref;
    auto const tabulation = [&] {for(int i=0;i<level;i++) res += '\t';};
    std::for_each(comm.begin()+1,comm.end()-2,[&](auto & v) {
        if(v == "\n") {
            res += '\n';
            tabulation();
            return;
        }
        if(v == "}") {
            if(res.back() == '\t') res.pop_back(); // removing '\t'
            level--;
        }
        if(v == "{") level++;
        res += v;
    });
    return res + suf;
}

int main() {
    using namespace std;
    string s = read_input();
    // cout << Parser(Tokenizer(s).tokenize()).parse() << '\n';
    auto tree = Parser(Tokenizer(s).tokenize()).parse();
    cerr << tree << '\n';
    cout << get_compiled_code(tree) << '\n';
    return 0;
}

