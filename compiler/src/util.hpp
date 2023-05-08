#ifndef TANUKI_UTIL_HPP_
#define TANUKI_UTIL_HPP_
#include <ostream>
#include <functional>
#include <variant>

class Printable {
public:
    virtual void print(std::ostream& s, std::string const & prev) const = 0;
    friend std::ostream& operator<<(std::ostream & s, Printable const & x) {
        x.print(s, "");
        return s;
    }
    virtual ~Printable() = default;
};

// template<typename Arg, typename... Parsers>
// bool parse_alternative(Arg && arg, Parsers && ... parsers) {
//     return ([&res, &arg](auto && parser){
//         res = parser(arg);
//         return res.has_value();
//     }(parsers) || ...);
// }

template<typename T, typename... Types>
bool is_same(T && type, std::variant<Types...> const & val) {
    const auto * ptr = std::get_if<typename std::remove_cv_t<typename std::remove_reference_t<T>>>(&val);
    return ptr && *ptr == type;
}

template<typename T, typename... Types>
bool has_type(std::variant<Types...> const & val) {
    return std::get_if<typename std::remove_reference_t<T>>(&val);
}

template<typename... T>
std::ostream & operator<<(std::ostream & s, std::variant<T...> const & v) {
    std::visit([&s](auto & x){s << x;}, v);
    return s;
}

std::string read_input() {
    std::string res;
    std::getline(std::cin, res, '\0');
    return res;
}

#endif /* TANUKI_UTIL_HPP_ */