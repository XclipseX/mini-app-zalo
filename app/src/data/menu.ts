// Dữ liệu giả lấy từ menu trong brand guideline Niên.
// Khi nối Firebase, các mảng này sẽ được đọc từ Firestore (collection "products", "categories", "stores").
import { Category, OptionGroup, Product, Store } from "./types";

export const categories: Category[] = [
  { id: "viet", name: "Cà phê Việt" },
  { id: "intl", name: "Cà phê Quốc tế" },
  { id: "tea", name: "Trà" },
  { id: "bakery", name: "Bakery" },
];

const sugar: OptionGroup = { id: "sugar", name: "Đường", options: [
  { id: "less", label: "Ít", price: 0 }, { id: "normal", label: "Vừa", price: 0 }, { id: "more", label: "Nhiều", price: 0 } ] };
const ice: OptionGroup = { id: "ice", name: "Đá", options: [
  { id: "normal", label: "Bình thường", price: 0 }, { id: "less", label: "Ít đá", price: 0 }, { id: "none", label: "Không đá", price: 0 } ] };
const shot: OptionGroup = { id: "shot", name: "Espresso", options: [
  { id: "1", label: "1 shot", price: 0 }, { id: "2", label: "2 shot", price: 6000 } ] };

const COFFEE = "#6b4226", MILK = "#c8945f", GREEN = "#879466", ORANGE = "#E76433";

export const products: Product[] = [
  { id: "phin", name: "Cà phê Phin", enName: "Hot Filter Coffee", price: 20000, categoryId: "viet", color: COFFEE, optionGroups: [sugar] },
  { id: "da", name: "Cà phê Đá", enName: "Saigon Iced Coffee", price: 25000, categoryId: "viet", color: COFFEE, optionGroups: [sugar, ice] },
  { id: "suada", name: "Cà phê Sữa Sài Gòn", enName: "Milk Coffee", price: 25000, categoryId: "viet", color: MILK, optionGroups: [sugar, ice], popular: true },
  { id: "trung", name: "Cà phê Trứng", enName: "Egg Coffee", price: 35000, categoryId: "viet", color: "#d9b37c", popular: true },
  { id: "dua", name: "Cà phê Dừa", enName: "Coconut Coffee", price: 35000, categoryId: "viet", color: "#efe3cf", optionGroups: [sugar], popular: true },
  { id: "daxay", name: "Cà phê Đá xay", enName: "Blended Iced Coffee", price: 35000, categoryId: "viet", color: MILK, optionGroups: [sugar] },
  { id: "americano", name: "Americano", price: 25000, categoryId: "intl", color: COFFEE, optionGroups: [shot, ice] },
  { id: "latte", name: "Latte", price: 39000, categoryId: "intl", color: MILK, description: "Espresso, sữa nóng và bọt sữa mỏng", optionGroups: [shot, sugar], popular: true },
  { id: "cappu", name: "Cappuccino", price: 39000, categoryId: "intl", color: MILK, description: "Espresso, sữa nóng và bọt sữa dày", optionGroups: [shot, sugar] },
  { id: "matcha", name: "Matcha Latte", price: 45000, categoryId: "tea", color: GREEN, optionGroups: [sugar, ice] },
  { id: "dao", name: "Trà Đào", price: 39000, categoryId: "tea", color: ORANGE, optionGroups: [sugar, ice] },
  { id: "croissant", name: "Croissant bơ", price: 30000, categoryId: "bakery", color: "#e0a24a" },
];

export const stores: Store[] = [
  { id: "starcity", name: "Niên – Vinhomes Star City", address: "358 Lê Lai, Thanh Hóa", hotline: "19001068" },
];
