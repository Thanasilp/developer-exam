### จากไฟล์ `ShoppingCart.ts`:

> ฟังก์ชัน `addItem(item: Product, quantity: number): void` รับพารามิเตอร์ 2 ตัวคือ:
>
> - `item` (object) ที่เป็นไปตาม Product interface
> - `quantity` (type: number)

ปัญหาเกิดขึ้นเมื่อเรียกใช้ `addItem()` ดังนี้:

```javascript
cart.addItem({ id: "1", name: "Laptop", price: 999.99, quantity: 1 });
```

### วิธีแก้ไข:

- นำค่า quantity ที่ต้องการใช้ออกมานอก object โดยเราจะนำแค่ value ของ quantity ออกมานั่นก็คือ 1 และ 2 ตามค่าที่โจทย์ต้องการเพิ่ม ส่วน object ของ item ใส่ค่าได้ถูกต้องแล้ว เท่านี้ก็จะตรงตามเงื่อนไขของ addItem method ที่ต้องการรับ 2 parameters: `item` และ `quantity`
- การเรียกใช้ method จะได้ดังนี้

```javascript
  > - cart.addItem({ id: "1", name: "Laptop", price: 999.99 }, 1);
  > - cart.addItem({ id: "2", name: "T-Shirt", price: 19.99 }, 1);
```

### ผลลัพธ์ที่ได้หลังจาก compile และ run ผ่าน JavaScript:

> ```javascript
> -console.log(cart.getCartSummary());
> -cart.applyDiscount(10); // Apply 10% discount
> -console.log(cart.getCartSummary());
> ```

> > - Subtotal: $1039.97, Tax: $72.80, Total: $1112.76
> > - Subtotal: $935.97, Tax: $65.52, Total: $1001.49 (หลังใส่ส่วนลด 10%)

```

```
