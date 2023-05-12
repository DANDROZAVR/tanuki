#include <algorithm>
#include <memory>
#include <stack>
#include <string>
#include <sstream>
#include <variant>
#include <vector>
#include <map>

#include <iostream>

#include "compile.hpp"
#include "tokenizer.hpp"
#include "util.hpp"

class Statement : public Printable {
public:
    virtual void compile(Compilator &) const = 0;
    virtual ~Statement() = default;
};

template<typename Derived>
class StatementImpl : public Statement {
public:
    void compile(Compilator & compilator) const override {
        compilator.compile(static_cast<const Derived &>(*this));
    }
};

class Scope : public StatementImpl<Scope> {
public:
    std::vector<std::string> vars;
    std::vector<std::unique_ptr<Statement>> statements;
    Scope * parent{};
    void print(std::ostream &s, std::string const & prev) const override {
        s << prev << "Scope:\n";
        s << prev << "Variables: ";
        for(auto & v : vars) s << v << " ";
        s << '\n';
        s << prev << "Body: [\n";
        for(auto & st : statements) {
            st->print(s, prev + '\t');
            s << '\n';
        }
        s << prev << ']';
    }
};

class Function : public Printable {
public:
    int arity;
    int priority;
    std::string name;
    Function(std::string name, int arity = 0, int priority = 0) : arity(arity), priority(priority), name(std::move(name)) {}
    virtual ~Function() = default;
    void print(std::ostream &s, std::string const & prev) const override {
        s << prev << name;
    }
};

class DefFunction : public Function {
public:
    std::vector<std::string> args;
    std::string body; // TODO
    DefFunction(std::string const & s) : Function(s) {}
    void print(std::ostream &s, std::string const & prev) const override {
        s << prev << name << '(';
        for(auto & arg : args) s << arg << ", ";
        s << ")\n";
        s << prev << "Body:\n";
        // body->print(s, prev + '\t');
        s << prev << body << '\n';
    }
};

class BinaryOperatorFunction : public Function {
public:
    BinaryOperatorFunction(OperatorToken const & operation) : Function(std::string{operation.repr()}, 2, operation.priority()) {}
};

class Expression : public Statement {

};

template<typename Derived>
class ExpressionImpl : public Expression {
public:
    void compile(Compilator & compilator) const override {
        compilator.compile(static_cast<const Derived &>(*this));
    }
};

class LiteralExpression : public ExpressionImpl<LiteralExpression>, public std::variant<NumberToken, LiteralToken> {
public:
    using std::variant<NumberToken, LiteralToken>::variant;
    void print(std::ostream & s, std::string const & prev) const override {
        std::visit([&](auto const & a){s << prev << a.repr();}, static_cast<std::variant<NumberToken, LiteralToken> const &>(*this));
    }
};

class VariableExpression : public ExpressionImpl<VariableExpression>, public std::string {
public:
    using std::string::string;
    VariableExpression(std::string s) : std::string(std::move(s)) {}
    void print(std::ostream & s, std::string const & prev) const override {
        s << prev << static_cast<const std::string &>(*this);
    }
};

class FunctionCall : public ExpressionImpl<FunctionCall> {
    void print(std::ostream &s, std::string const & prev) const override {
        s << prev << "name: " << function.get().name << '\n';
        s << prev << "args: (\n";
        for(auto &e : args) {
            e->print(s, prev + '\t');
            s << '\n';
        }
        s << prev << ")";
    }
public:
    std::reference_wrapper<Function const> function;
    std::vector<std::unique_ptr<Expression>> args;
    FunctionCall(Function const & function, std::vector<std::unique_ptr<Expression>> && args) : 
    function(function), args(std::move(args)) {}
    FunctionCall(Function const & function) : function(function) {}
};

class Array : public ExpressionImpl<Array>, public std::vector<std::unique_ptr<Expression>> {
    void print(std::ostream &s, std::string const & prev) const override {
        s << prev << "[";
        if(!empty()) {
            (*begin())->print(s,"");
            std::for_each(begin()+1, end(), [&](auto & x) {x->print(s,", ");});
        }
        s << "]";
    }
};

class ForEachLoop : public StatementImpl<ForEachLoop> {
    void print(std::ostream &s, std::string const & prev) const override {
        s << "for (";
        var->print(s, "");
        s << " in ";
        iterable->print(s, "");
        s << ")\n";
        scope->print(s, prev + '\t');
        s << '\n';
    }
public:
    std::unique_ptr<VariableExpression> var;
    std::unique_ptr<Expression> iterable;
    std::unique_ptr<Scope> scope;
};


class Prog_AST : public Printable {
public:
    std::string name = "program";
    std::map<std::string, std::unique_ptr<Function>> functions;
    std::unique_ptr<Scope> code;
    void print(std::ostream & s, std::string const & prev) const override {
        s << prev << "### " << name << " ###\n";
        // s << prev << "Functions: ";
        // for(auto &[_, fun] : functions) {
        //     fun->print(s, "");
        //     s << ", ";
        // }
        // s << '\n';
        s << prev << "Code:\n";
        code->print(s, prev);
    }
};

class Parser : private TokenSequence {
    std::map<std::string, std::unique_ptr<Function>> functions;
    using iter = TokenSequence::iterator;
    void load_default_functions() {
        // if(!functions.empty()) return;
        for(auto & oper : OperatorToken::operators) {
            functions.emplace(std::pair{std::string{oper.repr()}, std::make_unique<BinaryOperatorFunction>(oper)});
        }
    }

    void load_normal_function() {
        {
        DefFunction fun("F");
        fun.args = {"arg1"};
        fun.arity = 1;
        fun.priority = 4;
        functions.emplace("F", std::make_unique<DefFunction>(std::move(fun)));
        }
        {
        DefFunction fun("goto");
        fun.args = {"page_address"};
        fun.arity = 1;
        fun.priority = 4;
        functions.emplace("load", std::make_unique<DefFunction>(std::move(fun)));
        }
        {
        DefFunction fun("type");
        fun.args = {"where", "what"};
        fun.arity = 2;
        fun.priority = 4;
        functions.emplace("type", std::make_unique<DefFunction>(std::move(fun)));
        }
        {
        DefFunction fun("click");
        fun.args = {"what"};
        fun.arity = 1;
        fun.priority = 4;
        functions.emplace("click", std::make_unique<DefFunction>(std::move(fun)));
        }
        {
        DefFunction fun("clickTimes");
        fun.args = {"what", "count"};
        fun.arity = 2;
        fun.priority = 4;
        functions.emplace("clickTimes", std::make_unique<DefFunction>(std::move(fun)));
        }
        {
        DefFunction fun("print");
        fun.args = {"what"};
        fun.arity = 1;
        fun.priority = 4;
        functions.emplace("print", std::make_unique<DefFunction>(std::move(fun)));
        }
        {
        DefFunction fun("getText");
        fun.args = {"what"};
        fun.arity = 1;
        fun.priority = 4;
        functions.emplace("getText", std::make_unique<DefFunction>(std::move(fun)));
        }
        {
        DefFunction fun("keyboard.press");
        fun.args = {"what"};
        fun.arity = 1;
        fun.priority = 4;
        functions.emplace("press", std::make_unique<DefFunction>(std::move(fun)));
        }
        
    }

    bool parse_end(iter & it) {
        if(is_same(ControlToken::END, *it)) {
            ++it;
            return true;
        }
        return false;
    }

    [[nodiscard]] std::unique_ptr<Scope> parse_braces(iter &from, iter to, Scope & parent) {
        if(!is_same(ControlToken::LB, *from)) return nullptr;
        iter beg = ++from;
        long deep = 1;
        for(;from != to; ++from) {
            if(is_same(ControlToken::LB, *from)) ++deep;
            else if(is_same(ControlToken::RB, *from)) --deep;
            if(!deep) break;
        }
        if(deep) throw std::string("Braces syntax error");
        std::unique_ptr<Scope> scope = parse_scope(beg, from, parent);
        if(!scope) throw std::string("Syntax error");
        ++from;
        return scope;
    }

    [[nodiscard]] std::unique_ptr<Expression> expression_from_token(Token const & token) {
        if(auto * ptr = std::get_if<LiteralToken>(&token)) {
            return std::make_unique<LiteralExpression>(*ptr);
        } else if(auto * ptr = std::get_if<NumberToken>(&token)){
            return std::make_unique<LiteralExpression>(*ptr);
        } else if(auto * ptr = std::get_if<NameToken>(&token)) { // TODO check existing variables
            return std::make_unique<VariableExpression>(ptr->repr());
        }
        throw std::string("Expression syntax error");
    }

    [[nodiscard]] std::optional<std::reference_wrapper<Function const>> get_function(std::string const & S) {
        if(auto it = functions.find(S); it != functions.end()) {
            return *it->second;
        }
        return std::nullopt;
    }

    void parse_args(iter & from, iter to, unsigned arity, std::vector<std::unique_ptr<Expression>> & res) {
        if(!is_same(ControlToken::LO, *from)) throw std::string("Error parse args");
        ++from;
        for(unsigned i=1;i<arity;++i) {
            res.emplace_back(parse_expression(from, to, {ControlToken::COMMA}));
            ++from;
        }
        res.emplace_back(parse_expression(from, to, {ControlToken::RO}));
    }

    [[nodiscard]] std::unique_ptr<Array> parse_array(iter & from, iter to) {
        if(!is_same(ControlToken::LBR, *from)) return nullptr;
        ++from;
        std::unique_ptr<Array> res = std::make_unique<Array>();
        if(is_same(ControlToken::RBR, *from)) return res; // empty array
        for(;from != to; ++from) {
            res->emplace_back(parse_expression(from, to, {ControlToken::COMMA, ControlToken::RBR}));
            if(is_same(ControlToken::RBR, *from)) return res;
            if(!is_same(ControlToken::COMMA, *from)) return nullptr;
        }
        return nullptr;
    }

    [[nodiscard]] std::unique_ptr<Expression> parse_expression(iter & from, iter to, std::vector<ControlToken> const & end_tokens) {
        if(has_type<KeywordToken>(*from)) return nullptr;
        std::vector<std::variant<std::unique_ptr<Expression>, std::reference_wrapper<Function const>>> rpn;
        std::vector<std::reference_wrapper<Function const>> funs;
        auto it = from;
        auto const insert_function = [&funs, &rpn](Function const & fun) {
            while(!funs.empty() && funs.back().get().priority > fun.priority) {
                rpn.emplace_back(funs.back());
                funs.pop_back();
            }
            funs.emplace_back(fun);
        };
        for(;it != to && std::all_of(end_tokens.begin(),end_tokens.end(),[&it](auto token){return !is_same(token, *it);}); ++it) { // building reverse polish notation
            // std::cerr << *it << '\n';
            if(has_type<OperatorToken>(*it)) {
                auto const & fun = get_function(std::get<OperatorToken>(*it).repr()).value().get();
                insert_function(fun);
            } else if(has_type<NameToken>(*it)) {
                auto const & name_token = std::get<NameToken>(*it);
                if(auto maybe_fun = get_function(name_token)) {
                    auto const & fun = maybe_fun.value().get();
                    auto fun_call = std::make_unique<FunctionCall>(fun);
                    parse_args(++it, to, fun.arity, fun_call->args);
                    rpn.emplace_back(std::move(fun_call));
                } else {
                    rpn.emplace_back(std::move(expression_from_token(*it)));
                }
            } else if(has_type<LiteralToken>(*it) || has_type<NumberToken>(*it)) {
                rpn.emplace_back(std::move(expression_from_token(*it)));
            } else if(is_same(ControlToken::LBR, *it)) {
                auto array = parse_array(it, to);
                if(!array) throw std::string("Expression syntax error");
                rpn.emplace_back(std::move(array));
            } else {
                throw std::string("Expression syntax error");
            }
        }
        while(!funs.empty()) {
            rpn.emplace_back(funs.back());
            funs.pop_back();
        }
        std::vector<std::unique_ptr<Expression>> st;
        for(auto & item : rpn) {
            if(has_type<std::unique_ptr<Expression>>(item)) {
                st.emplace_back(std::move(std::get<std::unique_ptr<Expression>>(item)));
            } else {
                const auto & fun = std::get<std::reference_wrapper<Function const>>(item).get();
                const unsigned arity = fun.arity;
                if(arity > st.size()) throw std::string("Syntax args error");
                std::vector<std::unique_ptr<Expression>> args;
                args.reserve(arity);
                for_each(st.end()-arity, st.end(), [&args](auto & x){args.emplace_back(std::move(x));});
                st.resize(st.size()-arity);
                st.emplace_back(std::make_unique<FunctionCall>(fun, std::move(args)));
            }
        }
        // std::cerr << "AFTER: " << st.size() << '\n';
        // for(auto & x : st) std::cerr << *x << '\n';
        if(st.size() != 1) throw std::string("Syntax expression error");
        from = it;
        return std::move(st.front());
    }

    [[nodiscard]] std::unique_ptr<Statement> parse_control(iter & from, iter to, Scope & parent) {
        if(!has_type<KeywordToken>(*from)) return nullptr;
        if(is_same(KeywordToken::FOR, *from)) {
            std::unique_ptr<ForEachLoop> loop = std::make_unique<ForEachLoop>();
            ++from;
            if(!has_type<NameToken>(*from)) throw std::string("Syntax error");
            loop->var = std::make_unique<VariableExpression>(std::get<NameToken>(*from).repr());
            ++from;
            if(!is_same(KeywordToken::IN, *from))   throw std::string("Syntax error");
            ++from;
            if(!(loop->iterable = parse_array(from, to))) throw std::string("Syntax error");
            ++from;
            if(!(loop->scope = parse_braces(from, to, parent))) throw std::string("Syntax error");
            return loop;
        }
        return nullptr;
    }

    [[nodiscard]] std::unique_ptr<Scope> parse_scope(iter from, iter to, Scope & par) {
        std::unique_ptr<Scope> scope = std::make_unique<Scope>();
        scope->parent = &par;
        while(from != to) {
            if(parse_end(from)) continue;
            std::unique_ptr<Statement> statement =
            parse_braces(from, to, *scope) ?:
            parse_expression(from, to, {ControlToken::END}) ?:
            parse_control(from, to, *scope);
            if(!statement) return nullptr;
            scope->statements.emplace_back(std::move(statement));
        }
        return scope;
    }
public:
    Parser(TokenSequence && seq) : TokenSequence(std::move(seq)) {
        std::cerr << static_cast<TokenSequence&>(*this) << '\n';
        load_default_functions();
        load_normal_function();
    }
    [[nodiscard]] Prog_AST parse() {
        Prog_AST result;
        auto tmp = std::make_unique<Scope>(); // meh hack
        if(!(result.code = parse_scope(begin(), end(), *tmp))) throw std::string("Syntax error");
        result.code->parent = nullptr;
        result.functions = std::move(functions);
        return result;
    }
};