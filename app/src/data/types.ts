export interface Option { id: string; label: string; price: number }
export interface OptionGroup { id: string; name: string; options: Option[] }
export interface Product {
  id: string; name: string; enName?: string; price: number; categoryId: string;
  description?: string; image?: string; color: string; optionGroups?: OptionGroup[]; popular?: boolean;
}
export interface Category { id: string; name: string }
export interface Store { id: string; name: string; address: string; hotline: string }
export interface Voucher { id: string; title: string; badge: string; expires: string }
export interface CartItem { key: string; product: Product; options: Record<string, Option>; note: string; qty: number }
