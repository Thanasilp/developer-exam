"use strict";
class InventoryManager {
    constructor(initialProducts) {
        this.products = [];
        this.discountRules = {
            A: 0.05,
            B: 0.03,
            C: 0.01,
        };
        this.taxRate = 0.08;
        this.products = initialProducts;
    }
    addProduct(product) {
        // Bug: ไม่ตรวจสอบว่าสินค้าซ้ำกันหรือไม่
        this.products.push(product);
    }
    updateStock(productId, newQuantity) {
        const productIndex = this.products.findIndex((p) => p.id === productId);
        if (productIndex !== -1) {
            // Bug: ไม่ตรวจสอบว่า newQuantity เป็นจำนวนเต็มบวกหรือไม่
            this.products[productIndex].stockQuantity = newQuantity;
        }
    }
    calculateRevenue(soldQuantity, productId) {
        const product = this.getProductById(productId);
        if (!product)
            return 0;
        const discountedPrice = product.sellingPrice * (1 - this.getDiscount(product.category));
        const taxAmount = discountedPrice * soldQuantity * this.taxRate;
        const revenue = discountedPrice * soldQuantity + taxAmount;
        // Bug: ไม่ตรวจสอบว่า soldQuantity เกิน stockQuantity หรือไม่
        return revenue;
    }
    calculateProfit(soldQuantity, productId) {
        const product = this.getProductById(productId);
        if (!product)
            return 0;
        const discountedPrice = product.sellingPrice * (1 - this.getDiscount(product.category));
        const cost = product.costPrice * soldQuantity;
        const profit = discountedPrice * soldQuantity - cost;
        // Bug: ไม่คำนวณภาษีในการคำนวณกำไร
        return profit;
    }
    getProductById(id) {
        return this.products.find((p) => p.id === id);
    }
    getDiscount(category) {
        return this.discountRules[category] || 0;
    }
    restock(productId, additionalQuantity) {
        const productIndex = this.products.findIndex((p) => p.id === productId);
        if (productIndex !== -1) {
            // Bug: ไม่ตรวจสอบว่า additionalQuantity เป็นจำนวนเต็มบวกหรือไม่
            this.products[productIndex].stockQuantity += additionalQuantity;
        }
    }
    getLowStockProducts(threshold) {
        return this.products.filter((p) => p.stockQuantity <= threshold);
    }
}
// Usage example
const inventory = new InventoryManager([
    {
        id: "P001",
        name: "Laptop",
        costPrice: 800,
        sellingPrice: 1200,
        stockQuantity: 50,
        category: "A",
    },
    {
        id: "P002",
        name: "Smartphone",
        costPrice: 300,
        sellingPrice: 600,
        stockQuantity: 100,
        category: "B",
    },
]);
inventory.addProduct({
    id: "P003",
    name: "Tablet",
    costPrice: 250,
    sellingPrice: 400,
    stockQuantity: 75,
    category: "C",
});
console.log(inventory.calculateRevenue(5, "P001"));
console.log(inventory.calculateProfit(5, "P001"));
inventory.updateStock("P001", 40);
console.log(inventory.getLowStockProducts(50));
inventory.restock("P002", 20);
console.log(inventory.getLowStockProducts(50));
