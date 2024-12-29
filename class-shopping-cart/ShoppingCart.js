var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var ShoppingCart = /** @class */ (function () {
    function ShoppingCart() {
        this.items = [];
        this.taxRate = 0.07;
    }
    ShoppingCart.prototype.addItem = function (item, quantity) {
        var existingItemIndex = this.items.findIndex(function (i) { return i.id === item.id; });
        if (existingItemIndex !== -1) {
            this.items[existingItemIndex].quantity += quantity;
        }
        else {
            this.items.push(__assign(__assign({}, item), { quantity: quantity }));
        }
    };
    ShoppingCart.prototype.removeItem = function (itemId) {
        this.items = this.items.filter(function (item) { return item.id !== itemId; });
    };
    ShoppingCart.prototype.calculateSubtotal = function () {
        return this.items.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0);
    };
    ShoppingCart.prototype.calculateTax = function (subtotal) {
        return subtotal * this.taxRate;
    };
    ShoppingCart.prototype.calculateTotal = function () {
        var subtotal = this.calculateSubtotal();
        var tax = this.calculateTax(subtotal);
        return Math.floor((subtotal + tax) * 100) / 100;
    };
    ShoppingCart.prototype.getCartSummary = function () {
        var subtotal = this.calculateSubtotal();
        var tax = this.calculateTax(subtotal);
        var total = this.calculateTotal();
        return "Subtotal: $".concat(subtotal.toFixed(2), ", Tax: $").concat(tax.toFixed(2), ", Total: $").concat(total.toFixed(2));
    };
    ShoppingCart.prototype.applyDiscount = function (discountPercentage) {
        this.items.forEach(function (item) {
            item.price *= 1 - discountPercentage / 100;
        });
    };
    return ShoppingCart;
}());
// Usage example
var cart = new ShoppingCart();
cart.addItem({ id: "1", name: "Laptop", price: 999.99 }, 1);
cart.addItem({ id: "2", name: "T-Shirt", price: 19.99 }, 2);
console.log("This is cart:", cart);
console.log(cart.getCartSummary());
cart.applyDiscount(10); // Apply 10% discount
console.log(cart.getCartSummary());
