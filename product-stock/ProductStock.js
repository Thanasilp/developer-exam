var InventoryManager = /** @class */ (function () {
    function InventoryManager(initialProducts) {
        this.products = [];
        this.discountRules = {
            A: 0.05,
            B: 0.03,
            C: 0.01,
        };
        this.taxRate = 0.08;
        this.products = initialProducts;
    }
    // version แรก เช็คแค่ว่า id ซ้ำกันหรือไม่ก่อนที่จะ add สินค้าตัวใหม่
    InventoryManager.prototype.addProduct = function (product) {
        // Bug: ไม่ตรวจสอบว่าสินค้าซ้ำกันหรือไม่
        // อ้างอิงจาก method getProductById ด้านล่าง
        if (this.getProductById(product.id)) {
            console.error("This product already exists : ".concat(product.id, ", please try again"));
            return; // หยุดการทำงานหากพบว่าสินค้าซ้ำ
        }
        this.products.push(product); // เพิ่มสินค้าใหม่
        console.log("The new product \"".concat(product.name, "\" was added!")); //แจ้งว่าเพิ่มสินค้าสำเร็จแล้ว
    };
    // addProduct version2 จะทำการเช็คทั้ง id/name/category ของสินค้า ว่าเคยมีแล้วหรือไม่
    InventoryManager.prototype.addProduct2 = function (product) {
        var isDuplicate = this.products.some(
        // เช็ค product โดยการใช้ method some จะวนลูปตรวจสอบสินค้าใน this.products และหากพบสินค้าอย่างน้อย 1 รายการที่ตรงเงื่อนไข จะหยุดการวนลูปทันทีและคืนค่า true
        function (p) {
            return p.id === product.id ||
                (p.name.trim().toLowerCase() === product.name.trim().toLowerCase() &&
                    p.category === product.category);
        });
        if (isDuplicate) {
            // ถ้าค่า id ซ้ำ หรือว่า name + category ซ้ำ จะถูกมาเช็คในเงื่อนไขนี้และแสดง error ให้แก่ผู้ใช้งาน
            console.error("This product already exists: ID=".concat(product.id, ", Name=\"").concat(product.name, "\", Category=\"").concat(product.category, "\"."));
            return;
        }
        this.products.push(product);
        console.log("The new product \"".concat(product.name, "\" was added!"));
    };
    InventoryManager.prototype.updateStock = function (productId, newQuantity) {
        // Bug: ไม่ตรวจสอบว่า newQuantity เป็นจำนวนเต็มบวกหรือไม่
        // จาก method updateStock เรารับ parameter มาสองค่า คือ productId และ newQuantity อันดับแรกต้องเช็คดูว่าค่า newQuantity ที่เข้ามาเป็นค่าลบหรือไม่ และเช็คว่าเป็นจำนวนเต็มหรือไม่ผ่าน !Number.isInteger
        if (newQuantity < 0 || !Number.isInteger(newQuantity)) {
            console.error("Quantity cannot be negative");
            return;
        }
        // ถ้าหาผ่านเงื่อนไขด้านบน ต้องทำการเช็คอีกหนึ่งเงื่อนไขว่า มี id ของ product ก่อนหน้า ในคลังอยู่แล้วหรือไม่ ผ่าน method findIndex((p) => p.id === productId)
        var productIndex = this.products.findIndex(function (p) { return p.id === productId; });
        if (productIndex !== -1) {
            this.products[productIndex].stockQuantity = newQuantity;
            console.log("Your product_ID \"".concat(productId, "\"'stock has been updated to ").concat(newQuantity));
        }
        else {
            console.error("".concat(productId, " not found"));
        }
    };
    InventoryManager.prototype.calculateRevenue = function (soldQuantity, productId) {
        var product = this.getProductById(productId);
        // Bug: ไม่ตรวจสอบว่า soldQuantity เกิน stockQuantity หรือไม่
        // เช็คว่ามี product หรือไม่
        if (!product) {
            console.error("Product with ID ".concat(productId, " not found."));
            return 0;
        }
        // เช็คว่าปริมาณที่ขายมากกว่าปริมาณ stock ที่มีหรือไม่
        if (soldQuantity > product.stockQuantity) {
            console.error("Sold quantity exceeds available stock.");
            return 0;
        }
        var discountedPrice = product.sellingPrice * (1 - this.getDiscount(product.category));
        // console.log("DISCOUNT: " + discountedPrice);
        var taxAmount = discountedPrice * soldQuantity * this.taxRate; // คำนวณภาษีรวมของสินค้า
        // console.log("TAX: " + taxAmount);
        var revenue = discountedPrice * soldQuantity + taxAmount; // รายได้สุทธิ
        // console.log("REVENUE :" + revenue);
        return revenue;
    };
    // Bug: ไม่คำนวณภาษีในการคำนวณกำไร
    InventoryManager.prototype.calculateProfit = function (soldQuantity, productId) {
        var product = this.getProductById(productId);
        if (!product)
            return 0; // ถ้าไม่เจอ product ให้ return 0
        // เช็คว่าปริมาณที่ขายมากกว่าใน stock หรือไม่
        if (soldQuantity > product.stockQuantity) {
            console.error("Sold quantity exceeds available stock.");
            return 0;
        }
        var discountedPrice = product.sellingPrice * (1 - this.getDiscount(product.category));
        var cost = product.costPrice * soldQuantity; // คำนวณค่า cost ของสินค้า
        var revenue = discountedPrice * soldQuantity; //คำนวณรายได้สุทธิของสินค้า(ยังไม่รวมภาษี)
        var taxAmount = revenue * this.taxRate; // คำนวณภาษีจากรายได้สุทธิ
        var profit = revenue - cost - taxAmount; // กำไรทั้งหมดจะคิดจากเอารายได้สุทธิ ไปหัก cost และ ภาษี
        return profit;
    };
    // หา product_ID จาก method นี้ โดยจะไปหา id ใน object ของ Product
    InventoryManager.prototype.getProductById = function (id) {
        return this.products.find(function (p) { return p.id === id; });
    };
    InventoryManager.prototype.getDiscount = function (category) {
        return this.discountRules[category] || 0;
    };
    // ใน method นี้จะทำเหมือนกับ method updateStock ด้่านบน
    InventoryManager.prototype.restock = function (productId, additionalQuantity) {
        // Bug: ไม่ตรวจสอบว่า additionalQuantity เป็นจำนวนเต็มบวกหรือไม่
        if (additionalQuantity < 0 || !Number.isInteger(additionalQuantity)) {
            console.error("Quantity cannot be negative");
            return;
        }
        var productIndex = this.products.findIndex(function (p) { return p.id === productId; });
        if (productIndex !== -1) {
            this.products[productIndex].stockQuantity += additionalQuantity;
            console.log("Your product_ID \"".concat(productId, "\"'stock has been restocked to ").concat(additionalQuantity));
        }
        else {
            console.error("Product with ID ".concat(productId, " not found."));
        }
    };
    InventoryManager.prototype.getLowStockProducts = function (threshold) {
        return this.products.filter(function (p) { return p.stockQuantity <= threshold; });
    };
    return InventoryManager;
}());
// Usage example
var inventory = new InventoryManager([
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
// เช็ค ID ซ้ำ ผ่าน addProduct2
inventory.addProduct2({
    id: "P003",
    name: "SmartPhone",
    costPrice: 250,
    sellingPrice: 400,
    stockQuantity: 75,
    category: "C",
});
// เช็ค name + category ซ้ำ
inventory.addProduct2({
    id: "P004",
    name: "Tablet ",
    costPrice: 250,
    sellingPrice: 400,
    stockQuantity: 75,
    category: "C",
});
console.log(inventory.calculateRevenue(5, "P001"));
console.log(inventory); // เช็ค stock ของ "P001" ว่าลดลงไป 5 หรือไม่
console.log(inventory.calculateRevenue(5, "P006")); // ลองใส่ product ที่ไม่มีจริง
console.log(inventory.calculateRevenue(500, "P001")); // ลองใส่เกินจำนวน stock
console.log(inventory.calculateProfit(5, "P001"));
inventory.updateStock("P001", 40);
inventory.updateStock("p001", -10); // ลองใส่ค่า negative
console.log(inventory.getLowStockProducts(50));
inventory.restock("P002", 20);
console.log(inventory.getLowStockProducts(50));
