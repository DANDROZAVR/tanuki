#ifndef TANUKI_TOKENIZER_HPP_
#define TANUKI_TOKENIZER_HPP_
#include <algorithm>
#include <string>
#include <string_view>
#include <optional>
#include <ostream>
#include <variant>
#include <vector>

template<typename TokenType>
struct ComparableToken {
    bool operator==(TokenType const & t) const {
        return static_cast<const TokenType *>(this)->repr() == t.repr();
    }
};

class NameToken : public std::string, public ComparableToken<NameToken> {
public:
    using std::string::string;
  	NameToken(std::string const & s) : std::string(s) {}
  	NameToken(std::string && s) : std::string(std::move(s)) {}
    friend std::ostream & operator<<(std::ostream & s, NameToken const & v) {
        return s << static_cast<std::string const &>(v);
    }
    std::string const & repr() const {return *this;}
};

class LiteralToken : public std::string, public ComparableToken<LiteralToken> {
public:
    using std::string::string;
  	LiteralToken(std::string const & s) : std::string(s) {}
  	LiteralToken(std::string && s) : std::string(std::move(s)) {}
    friend std::ostream & operator<<(std::ostream & s, LiteralToken const & v) {
        return s << static_cast<std::string const &>(v);
    }
    std::string const & repr() const {return *this;}
};

class NumberToken : public ComparableToken<NumberToken> {
    long val;
public:
    NumberToken(int val) : val(val) {}
    long repr() const {return val;}
    friend std::ostream& operator<<(std::ostream & s, NumberToken const & v) {
        return s << v.val;
    }
};

class ControlToken : public ComparableToken<ControlToken> {
private:
    ControlToken(std::string s) : reprezentation(std::move(s)) {}
    std::string reprezentation;
public:
    ControlToken(ControlToken const &) = default;
    ControlToken(ControlToken &&) = default;
    ControlToken& operator=(ControlToken const &) = default;
    ControlToken& operator=(ControlToken &&) = default;
    std::string const & repr() const {return reprezentation;}
    static ControlToken LO,RO, LB, RB, COMMA, END, LBR, RBR;
    friend std::ostream & operator<<(std::ostream & s, ControlToken const & x) {
        return s << x.reprezentation;
    }
};
ControlToken ControlToken::LO("(");
ControlToken ControlToken::RO(")");
ControlToken ControlToken::LB("{");
ControlToken ControlToken::RB("}");
ControlToken ControlToken::COMMA(",");
ControlToken ControlToken::END("END");
ControlToken ControlToken::LBR("[");
ControlToken ControlToken::RBR("]");

class KeywordToken : public ComparableToken<KeywordToken> {
private:
    KeywordToken(std::string s) : reprezentation(std::move(s)) {}
    std::string reprezentation;
public:
    KeywordToken(KeywordToken const &) = default;
    KeywordToken(KeywordToken &&) = default;
    KeywordToken& operator=(KeywordToken const &) = default;
    KeywordToken& operator=(KeywordToken &&) = default;
    std::string const & repr() const {return reprezentation;}
    static KeywordToken FOR, IN, IF, ELSE;
    friend std::ostream & operator<<(std::ostream & s, KeywordToken const & x) {
        return s << x.reprezentation;
    }
};
KeywordToken KeywordToken::FOR{"for"};
KeywordToken KeywordToken::IN{"in"};
KeywordToken KeywordToken::IF{"if"};
KeywordToken KeywordToken::ELSE{"else"};

class OperatorToken : public ComparableToken<OperatorToken>{
private:
    std::string reprezentation;
    int prio;
    OperatorToken(std::string s, int priority) : reprezentation(std::move(s)), prio(priority) {}
public:
    OperatorToken(OperatorToken const &) = default;
    OperatorToken(OperatorToken &&) = default;
    OperatorToken& operator=(OperatorToken const &) = default;
    OperatorToken& operator=(OperatorToken &&) = default;
    std::string const & repr() const {return reprezentation;}
    int priority() const {return prio;}
    static OperatorToken ADD, SUB, MUL, DIV, MOD, EQ, COMPEQ, LEQ, GEQ, NEQ, ADDEQ, SUBEQ, MULEQ, DIVEQ, MODEQ, LS, GT;
    friend std::ostream & operator<<(std::ostream & s, OperatorToken const & x) {
        return s << x.reprezentation;
    }
    static OperatorToken operators[];
};
OperatorToken OperatorToken::ADD{"+", 2};
OperatorToken OperatorToken::SUB{"-", 2};
OperatorToken OperatorToken::MUL{"*", 3};
OperatorToken OperatorToken::DIV{"/", 3};
OperatorToken OperatorToken::MOD{"%", 3};
OperatorToken OperatorToken::EQ{"=", 0};
OperatorToken OperatorToken::COMPEQ{"==", 1};
OperatorToken OperatorToken::LEQ{"<=", 1};
OperatorToken OperatorToken::GEQ{">=", 1};
OperatorToken OperatorToken::NEQ{"!=", 1};
OperatorToken OperatorToken::ADDEQ{"+=", 0};
OperatorToken OperatorToken::SUBEQ{"-=", 0};
OperatorToken OperatorToken::MULEQ{"*=", 0};
OperatorToken OperatorToken::DIVEQ{"/=", 0};
OperatorToken OperatorToken::MODEQ{"%=", 0};
OperatorToken OperatorToken::LS{"<", 1};
OperatorToken OperatorToken::GT{">", 1};
OperatorToken OperatorToken::operators[] = {ADD, SUB, MUL, DIV, MOD, EQ, COMPEQ, LEQ, GEQ, NEQ, ADDEQ, SUBEQ, MULEQ, DIVEQ, MODEQ, LS, GT};

using Token = std::variant<NameToken, LiteralToken, NumberToken, ControlToken, KeywordToken, OperatorToken>;

class TokenSequence : public std::vector<Token> {
    using std::vector<Token>::vector;
    friend std::ostream & operator<<(std::ostream & s, TokenSequence const & V) {
        s << "{";
        for(auto v : V) {
            std::visit([&](auto x){s << x << ", ";}, v);
        }
        return s << "}";
    }
};

class Tokenizer : private std::string_view {
    const char * it;
    TokenSequence result;

    bool read_end() {
        if(*it == '\n') {
            ++it;
            result.emplace_back(ControlToken::END);
            return true;
        }
        return false;
    }

    bool read_white() {
        char z = *it;
        if(z == ' ' || z == '\t') {
            ++it;
            return true;
        }
        return false;
    }
    
    bool read_word() {
        auto is_alpha = [](char z) {return ('a' <= z && z <= 'z') || ('A' <= z && z <= 'Z');};
        auto is_alphanumeric = [&](char z) {return is_alpha(z) || ('0' <= z && z <= '9');};
        auto is_keyword = [](std::string const & s) -> std::optional<KeywordToken> {
            if(s == "for")  return KeywordToken::FOR;
            if(s == "in")   return KeywordToken::IN;
            if(s == "if")   return KeywordToken::IF;
            if(s == "else") return KeywordToken::ELSE;
            return std::nullopt;
        };
        if(!is_alpha(*it)) return false;
        auto beg = it; ++it;
        while(is_alphanumeric(*it)) ++it;
        std::string word = std::string(beg, it);
        if(auto maybe_keyword = is_keyword(word); maybe_keyword.has_value()) {
            result.emplace_back(maybe_keyword.value());
            return true;
        }
        result.emplace_back(NameToken(std::move(word)));
        return true;
    }

    bool read_literal() {
        if(*it != '\'') return false;
        auto beg = it; ++beg;
        auto curr = it; ++curr;
        while(curr < end() && *curr != '\'') ++curr;
        if(curr == end()) return false;
        result.emplace_back(LiteralToken(beg, curr));
        it = ++curr;
        return true;
    }

    bool read_number() {
        auto is_numeric = [](char z) {return '0' <= z && z <= '9';};
        auto curr = it;
        long sign = 1;
        if(!is_numeric(*curr) && *curr != '-') return false;
        if(*curr == '-') {
            ++curr;
            if(!is_numeric(*curr)) return false;
            sign = -1;
        }
        long val = 0;
        while(is_numeric(*curr)) {
            val = val * 10 + (*curr & 15);
            ++curr;
        }
        it = curr;
        result.emplace_back(NumberToken(val * sign));
        return true;
    }

    bool read_control() {
        auto is_control = [](char z) -> std::optional<ControlToken> {
            if(z == '(') return ControlToken::LO;
            if(z == ')') return ControlToken::RO;
            if(z == '{') return ControlToken::LB;
            if(z == '}') return ControlToken::RB;
            if(z == '[') return ControlToken::LBR;
            if(z == ']') return ControlToken::RBR;
            if(z == ',') return ControlToken::COMMA;
            return std::nullopt;
        };
        if(auto maybe_control = is_control(*it); maybe_control.has_value()) {
            ++it;
            result.emplace_back(maybe_control.value());
            return true;
        }
        return false;
    }

    bool read_operator() {
        constexpr static decltype(auto) opers = "+-*/%=<>";
        auto is_oper_char = [&](char z) {return std::find(std::begin(opers), std::end(opers), z) != std::end(opers);};
        auto is_operator = [](std::string_view s) -> std::optional<OperatorToken> {
            for(auto & oper : OperatorToken::operators) {
                if(s == oper.repr()) return oper;
            }
            return std::nullopt;
        };
        auto beg = it;
        auto curr = it;
        std::size_t cnt = 0;
        while(is_oper_char(*curr)) ++curr, cnt++;
        if(auto maybe_operator = is_operator(std::string_view{beg, cnt}); maybe_operator.has_value()) {
            result.emplace_back(maybe_operator.value());
            it = curr;
            return true;
        }
        return false;
    }

    void get_token() {
        if( read_end() || read_white() || read_word() || read_literal() || 
            read_number() || read_control() || read_operator()) return;
        throw std::string("Syntax error");
    }
    
public:
    template<typename... T>
    Tokenizer(T && ... args) : std::string_view(std::forward<T>(args)...), it(begin()) {}
    Tokenizer(Tokenizer const &) = delete;
    Tokenizer(Tokenizer &&) = delete;
    Tokenizer& operator=(Tokenizer const &) = delete;
    Tokenizer& operator=(Tokenizer &&) = delete;
    ~Tokenizer() = default;

    TokenSequence tokenize() {
        try {
        while(it != end()) {
            get_token();
        }
        } catch(...) {
            result.emplace_back(NameToken{"ERROR"});
            return result;
        }
        result.emplace_back(ControlToken::END);
        return result;
    }
};

#endif /* TANUKI_TOKENIZER_HPP_ */