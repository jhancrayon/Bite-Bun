import type { Category } from "./menu-filter";

/** Unsplash photo helper — keeps the long CDN query string in one place. */
const photo = (id: string, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  /** Original price, when the item is on sale. */
  oldPrice?: number;
  rating: number;
  /** Number of reviews, shown next to the rating. */
  reviews: number;
  /** Prep + delivery estimate in minutes. */
  minutes: number;
  kcal: number;
  /** 0–3 chillies. */
  spicy?: number;
  category: Exclude<Category, "all">;
  image: string;
  tag?: string;
  /** Món Signature — mở Smart Pairing khi chọn để tối đa hóa AOV. */
  signature?: boolean;
  /** Món theo mùa — cũng kích hoạt luồng gợi ý ghép bộ + sốt theo mùa. */
  seasonal?: boolean;
  /** Huy hiệu bảo chứng chất lượng, ví dụ "Chef's Choice". */
  trust?: string;
  /** Icon nguồn gốc nguyên liệu cao cấp, hiện trên thẻ Signature. */
  ingredients?: string[];
};

/** Nâng cấp Combo tiết kiệm — gợi ý ghép bộ chính (Smart Pairing). */
export const COMBO_UPGRADE = {
  id: "combo-up",
  label: "Nâng cấp thành Combo tiết kiệm",
  desc: "Khoai tây chiên Lớn & Coca-Cola",
  price: 29000,
  worth: 55000,
};

/** Topping nâng cấp — lợi nhuận biên cao, tăng giá trị đơn. */
export const TOPPINGS: { id: string; label: string; price: number; emoji: string }[] = [
  { id: "cheese", label: "Extra Phô Mai Cheddar", price: 15000, emoji: "🧀" },
  { id: "bacon", label: "Bacon Xông Khói Giòn", price: 20000, emoji: "🥓" },
  { id: "patty", label: "Thêm 1 Miếng Bò Úc", price: 30000, emoji: "🥩" },
  { id: "egg", label: "Trứng Ốp La Lòng Đào", price: 12000, emoji: "🍳" },
];

/** Bộ sưu tập sốt đặc trưng theo mùa (Seasonal Dip Customizer). */
export const SEASONAL_DIPS: { id: string; label: string; price: number; emoji: string; note?: string }[] = [
  { id: "truffle", label: "Sốt Nấm Truffle Đen", price: 18000, emoji: "🍄", note: "Độc quyền mùa lễ 2/9" },
  { id: "lava", label: "Sốt Phô Mai Núi Lửa", price: 15000, emoji: "🌋", note: "Bán theo mùa" },
  { id: "garlic", label: "Sốt Mắm Tỏi Phan Thiết", price: 12000, emoji: "🧄" },
  { id: "korean", label: "Sốt Cay Gochujang", price: 12000, emoji: "🌶️" },
];

export const CATEGORY_META: {
  id: Exclude<Category, "all">;
  label: string;
  emoji: string;
  image: string;
  /** Short line shown under the category heading inside the menu. */
  blurb: string;
}[] = [
  { id: "combo", label: "Combo", emoji: "🍱", image: photo("1594212699903-ec8a3eca50f5", 400), blurb: "Ăn no đã đời, tiết kiệm hơn gọi lẻ" },
  { id: "burger", label: "Burger", emoji: "🍔", image: photo("1619810816144-68dbc1f695e8", 400), blurb: "Bò Úc xay tươi mỗi sáng, nướng lửa than" },
  { id: "pizza", label: "Pizza", emoji: "🍕", image: photo("1565299624946-b28f40a0ae38", 400), blurb: "Đế ủ 48 giờ, nướng lò đá 380°C" },
  { id: "pasta", label: "Mì Ý", emoji: "🍝", image: photo("1546549032-9571cd6b27df", 400), blurb: "Sốt nấu chậm 6 tiếng, mì al dente" },
  { id: "chicken", label: "Gà rán", emoji: "🍗", image: photo("1709164632728-8a943456dd0a", 400), blurb: "Ướp 12 giờ, chiên giòn từng phần" },
  { id: "salad", label: "Salad", emoji: "🥗", image: photo("1512621776951-a57141f2eefd", 400), blurb: "Rau hữu cơ Đà Lạt giao trong ngày" },
  { id: "healthy", label: "Healthy", emoji: "🥑", image: photo("1505576633757-0ac1084af824", 400), blurb: "Ít dầu mỡ, giàu đạm — eat clean mỗi ngày" },
  { id: "dessert", label: "Kem & tráng miệng", emoji: "🍨", image: photo("1710683994911-c59ddf25c5c0", 400), blurb: "Làm thủ công, ít ngọt vừa miệng" },
  { id: "drink", label: "Nước uống", emoji: "🥤", image: photo("1781663904820-7a3a9623e0f7", 400), blurb: "Pha theo đơn, đá viên tinh khiết" },
];

export const MENU: MenuItem[] = [
  // Combo
  { id: "m-cb1", name: "Combo Burger Đôi", desc: "2 Cheese Burger · khoai tây chiên · 2 nước ngọt", price: 165000, oldPrice: 210000, rating: 4.9, reviews: 980, minutes: 18, kcal: 1450, category: "combo", image: photo("1594212699903-ec8a3eca50f5"), tag: "Bán chạy" },
  { id: "m-cb2", name: "Combo Gà Rán Nhóm", desc: "6 miếng gà rán · popcorn gà · 3 nước ngọt", price: 245000, oldPrice: 315000, rating: 4.8, reviews: 640, minutes: 22, kcal: 2100, category: "combo", image: photo("1670688866261-db6697858df8"), tag: "-22%" },
  { id: "m-cb3", name: "Combo Pizza Đôi Bạn", desc: "1 pizza hải sản · mì Ý carbonara · 2 nước ngọt", price: 259000, oldPrice: 337000, rating: 4.8, reviews: 415, minutes: 24, kcal: 1980, category: "combo", image: photo("1552580715-4d9bc27f1e2f") },
  { id: "m-cb4", name: "Combo Cặp Đôi Hạnh Phúc", desc: "2 burger bò bacon · salad · 2 trà đào cam sả", price: 199000, oldPrice: 248000, rating: 4.7, reviews: 372, minutes: 20, kcal: 1560, category: "combo", image: photo("1624855600799-ac8e8bddd1da"), tag: "Mới" },
  { id: "m-cb5", name: "Combo Gia Đình No Nê", desc: "2 burger · 4 gà rán · khoai tây · 4 nước ngọt", price: 355000, oldPrice: 465000, rating: 4.9, reviews: 528, minutes: 28, kcal: 3200, category: "combo", image: photo("1717251211808-e1382fc30592"), tag: "-24%" },

  // Burger
  { id: "m-bg1", name: "Cheese Burger", desc: "Bò nướng · phô mai cheddar tan chảy", price: 75000, rating: 4.9, reviews: 1240, minutes: 15, kcal: 640, category: "burger", image: photo("1619810816144-68dbc1f695e8"), tag: "Bán chạy" },
  { id: "m-bg2", name: "Burger Bò Bacon Phô Mai", desc: "Bacon giòn · sốt BBQ khói", price: 89000, oldPrice: 112000, rating: 4.8, reviews: 860, minutes: 16, kcal: 780, category: "burger", image: photo("1776260699183-ec2f28b1047f"), tag: "-20%" },
  { id: "m-bg3", name: "Triplo Burger", desc: "3 lớp bò Úc · phô mai kép", price: 129000, rating: 4.9, reviews: 512, minutes: 18, kcal: 980, category: "burger", image: photo("1776260486945-5d3246514707"), tag: "Signature", signature: true, trust: "Signature Recipe", ingredients: ["🥩 100% Bò nhập khẩu", "🥖 Bánh mì nướng bơ tươi", "🧑‍🍳 Sốt thủ công độc quyền"] },
  { id: "m-bg4", name: "Monster Burger", desc: "Burger đặc biệt cỡ đại, ăn no căng", price: 85000, rating: 4.7, reviews: 760, minutes: 17, kcal: 890, category: "burger", image: photo("1772884011435-00b8eeceb1a0"), tag: "Signature", signature: true, trust: "Chef's Choice", ingredients: ["🥩 100% Bò nhập khẩu", "🥖 Bánh mì nướng bơ tươi", "🧀 Phô mai cheddar kép"] },
  { id: "m-bg5", name: "Burger Tôm Giòn", desc: "Tôm chiên xù · sốt chanh dây", price: 95000, rating: 4.6, reviews: 214, minutes: 16, kcal: 610, category: "burger", image: photo("1780030869912-9e8c35be7866"), tag: "Theo mùa", seasonal: true, trust: "Best Seller 🔥", ingredients: ["🦐 Tôm tươi chọn lọc", "🥖 Bánh mì nướng bơ tươi", "🍋 Sốt chanh dây nhà làm"] },
  { id: "m-bg6", name: "Burger Gà Cay", desc: "Gà phi lê · ớt Hàn Quốc", price: 79000, rating: 4.7, reviews: 690, minutes: 15, kcal: 700, spicy: 2, category: "burger", image: photo("1619810816144-223f5b027aea") },

  // Pizza
  { id: "m-pz1", name: "Pizza Hải Sản Phô Mai", desc: "Đế mỏng · phô mai kéo sợi", price: 159000, rating: 4.8, reviews: 940, minutes: 22, kcal: 1120, category: "pizza", image: photo("1565299624946-b28f40a0ae38"), tag: "Bán chạy" },
  { id: "m-pz2", name: "Pizza Bò Bằm Sốt Cay", desc: "Bò Mỹ · jalapeño tươi", price: 149000, rating: 4.7, reviews: 470, minutes: 22, kcal: 1040, spicy: 2, category: "pizza", image: photo("1534308983496-4fabb1a015ee") },
  { id: "m-pz3", name: "Pizza 4 Loại Phô Mai", desc: "Mozzarella · cheddar · parmesan · blue", price: 169000, rating: 4.9, reviews: 388, minutes: 24, kcal: 1210, category: "pizza", image: photo("1593504049359-74330189a345") },
  { id: "m-pz4", name: "Pizza Gà Nướng Mật Ong", desc: "Gà nướng · mật ong tỏi", price: 139000, oldPrice: 159000, rating: 4.6, reviews: 302, minutes: 21, kcal: 980, category: "pizza", image: photo("1604382354936-07c5d9983bd3"), tag: "-12%" },

  // Pasta
  { id: "m-ps1", name: "Mì Ý Carbonara", desc: "Kem tươi · thịt xông khói", price: 89000, rating: 4.8, reviews: 980, minutes: 14, kcal: 720, category: "pasta", image: photo("1546549032-9571cd6b27df"), tag: "Bán chạy" },
  { id: "m-ps2", name: "Mì Ý Thịt Viên Sốt Cay", desc: "Sốt cà chua cay · phô mai bào", price: 79000, rating: 4.7, reviews: 640, minutes: 15, kcal: 690, spicy: 2, category: "pasta", image: photo("1515516969-d4008cc6241a") },
  { id: "m-ps3", name: "Mì Ý Sốt Cua Phô Mai", desc: "Thịt cua tươi · sốt kem béo nhẹ", price: 95000, oldPrice: 146000, rating: 4.8, reviews: 275, minutes: 16, kcal: 740, category: "pasta", image: photo("1588013273468-315fd88ea34c"), tag: "-35%" },
  { id: "m-ps4", name: "Mì Cay Kim Chi", desc: "Cấp độ 1–7 · kim chi nhà làm", price: 69000, rating: 4.5, reviews: 530, minutes: 13, kcal: 610, spicy: 3, category: "pasta", image: photo("1719250726371-b4076d48ce6c") },

  // Chicken
  { id: "m-ck1", name: "Gà Rán Sốt Mật Ong", desc: "Giòn rụm · mật ong tỏi", price: 85000, rating: 4.8, reviews: 1130, minutes: 18, kcal: 820, category: "chicken", image: photo("1709164632728-8a943456dd0a"), tag: "Bán chạy" },
  { id: "m-ck2", name: "Gà Giòn Cay", desc: "Ướp ớt Hàn · giòn tan", price: 85000, rating: 4.7, reviews: 720, minutes: 18, kcal: 840, spicy: 3, category: "chicken", image: photo("1600147184950-b0a367a98bc3") },
  { id: "m-ck3", name: "Gà Popcorn Giòn", desc: "Miếng nhỏ · ăn là nghiện", price: 55000, rating: 4.6, reviews: 610, minutes: 12, kcal: 520, category: "chicken", image: photo("1670207415519-3cc41f5768b8") },
  { id: "m-ck4", name: "Sườn Nướng BBQ", desc: "Ướp 12 giờ · sốt BBQ đậm", price: 175000, oldPrice: 235000, rating: 4.9, reviews: 340, minutes: 26, kcal: 1180, category: "chicken", image: photo("1544025162-d76694265947"), tag: "-25%" },
  { id: "m-ck5", name: "Cánh Gà Nướng Muối Ớt", desc: "6 cánh · muối ớt Tây Ninh", price: 89000, rating: 4.7, reviews: 455, minutes: 20, kcal: 660, spicy: 2, category: "chicken", image: photo("1775039983676-6a15a62799bb") },

  // Salad
  { id: "m-sl1", name: "Special Salad", desc: "Salad đặc biệt của bếp trưởng", price: 55000, rating: 4.7, reviews: 870, minutes: 10, kcal: 260, category: "salad", image: photo("1512621776951-a57141f2eefd") },
  { id: "m-sl2", name: "Salad Ức Gà Nướng", desc: "Rau hữu cơ · sốt mè rang", price: 65000, rating: 4.6, reviews: 480, minutes: 11, kcal: 320, category: "salad", image: photo("1546069901-ba9599a7e63c"), tag: "Healthy" },
  { id: "m-sl3", name: "Salad Trộn Giấm Táo", desc: "Giấm táo lên men tự nhiên", price: 65000, oldPrice: 76000, rating: 4.5, reviews: 210, minutes: 10, kcal: 240, category: "salad", image: photo("1540420773420-3366772f4999"), tag: "-15%" },
  { id: "m-sl4", name: "Salad Cá Ngừ Bơ", desc: "Cá ngừ · bơ sáp Đắk Lắk", price: 79000, rating: 4.6, reviews: 190, minutes: 12, kcal: 380, category: "salad", image: photo("1600335895229-6e75511892c8") },

  // Healthy
  { id: "m-hl1", name: "Buddha Bowl Quinoa Bơ", desc: "Diêm mạch · bơ sáp · rau củ nướng · sốt tahini", price: 89000, rating: 4.8, reviews: 320, minutes: 12, kcal: 420, category: "healthy", image: photo("1505576633757-0ac1084af824"), tag: "Healthy" },
  { id: "m-hl2", name: "Cá Hồi Áp Chảo & Rau Củ", desc: "Cá hồi Na Uy · bông cải · măng tây", price: 139000, rating: 4.9, reviews: 246, minutes: 16, kcal: 480, category: "healthy", image: photo("1539136788836-5699e78bfc75"), tag: "Bán chạy" },
  { id: "m-hl3", name: "Bowl Ức Gà Diêm Mạch", desc: "Ức gà nướng · quinoa · rau xanh · sốt mè", price: 79000, oldPrice: 95000, rating: 4.7, reviews: 410, minutes: 13, kcal: 390, category: "healthy", image: photo("1589442305595-62647c1514f9"), tag: "-15%" },
  { id: "m-hl4", name: "Smoothie Bowl Açaí", desc: "Açaí · chuối · granola · hạt chia", price: 65000, rating: 4.8, reviews: 285, minutes: 8, kcal: 310, category: "healthy", image: photo("1610450624105-58a2f25f7911"), tag: "Mới" },
  { id: "m-hl5", name: "Yến Mạch Qua Đêm Trái Cây", desc: "Yến mạch · sữa hạnh nhân · dâu · việt quất", price: 55000, rating: 4.6, reviews: 198, minutes: 6, kcal: 280, category: "healthy", image: photo("1642339800099-921df1a0a958") },
  { id: "m-hl6", name: "Burger Ức Gà Bơ Healthy", desc: "Ức gà nướng · bơ sáp · bánh mì nguyên cám", price: 89000, rating: 4.8, reviews: 264, minutes: 14, kcal: 450, category: "healthy", image: photo("1692737348416-0a4fa4cf1523"), tag: "Healthy" },
  { id: "m-hl7", name: "Burger Chay Đậu Gà & Rau Củ", desc: "Pa-tê đậu gà · rau củ tươi · sốt sữa chua", price: 79000, rating: 4.7, reviews: 182, minutes: 13, kcal: 390, category: "healthy", image: photo("1525059696034-4967a8e1dca2"), tag: "Chay" },
  { id: "m-hl8", name: "Burger Cuốn Xà Lách Low-carb", desc: "Bò nạc · cuốn xà lách thay bánh · ít tinh bột", price: 85000, oldPrice: 99000, rating: 4.6, reviews: 149, minutes: 14, kcal: 340, category: "healthy", image: photo("1676976198608-4f655fb6db99"), tag: "-14%" },

  // Dessert
  { id: "m-ds1", name: "Kem Sữa Dừa", desc: "Dừa non · topping hạt điều", price: 39000, oldPrice: 49000, rating: 4.7, reviews: 520, minutes: 8, kcal: 290, category: "dessert", image: photo("1729168115200-833bf4301876"), tag: "-20%" },
  { id: "m-ds2", name: "Cookie Oreo", desc: "Kem vị Oreo · bánh quy giòn", price: 45000, rating: 4.8, reviews: 640, minutes: 8, kcal: 340, category: "dessert", image: photo("1642646669923-074199898e3c"), tag: "Bán chạy" },
  { id: "m-ds3", name: "Bánh Flan Caramel", desc: "Mềm mịn · caramel đắng nhẹ", price: 29000, rating: 4.6, reviews: 410, minutes: 6, kcal: 210, category: "dessert", image: photo("1544052387-2f094663cd94") },
  { id: "m-ds4", name: "Kem Dâu Tây Tươi", desc: "Dâu Đà Lạt · kem sữa tươi", price: 42000, rating: 4.5, reviews: 260, minutes: 7, kcal: 280, category: "dessert", image: photo("1497034825429-c343d7c6a68f") },

  // Drink
  { id: "m-dr1", name: "Trà Đào Cam Sả", desc: "Đào ngâm · sả tươi", price: 35000, rating: 4.8, reviews: 1310, minutes: 5, kcal: 150, category: "drink", image: photo("1781663904820-7a3a9623e0f7"), tag: "Bán chạy" },
  { id: "m-dr2", name: "Coca Cola", desc: "Lon 330ml · ướp lạnh", price: 15000, rating: 4.5, reviews: 890, minutes: 3, kcal: 139, category: "drink", image: photo("1622483767028-3f66f32aef97") },
  { id: "m-dr3", name: "Nước Ép Cam Tươi", desc: "100% cam vắt · không đường", price: 39000, rating: 4.7, reviews: 430, minutes: 6, kcal: 110, category: "drink", image: photo("1724213653743-2616ee9e962c") },
  { id: "m-dr4", name: "Trà Sữa Trân Châu", desc: "Trân châu đường đen", price: 45000, rating: 4.6, reviews: 720, minutes: 7, kcal: 320, category: "drink", image: photo("1747016804753-866c3ed6b3b7"), tag: "Mới" },
];

/** Number of dishes per category — single source of truth for the counters. */
export function countByCategory(id: Exclude<Category, "all">) {
  return MENU.filter((item) => item.category === id).length;
}
