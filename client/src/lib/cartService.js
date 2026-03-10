import { cartData } from "@/data/cartData";

export async function getCartData() {
  //SSR 
  await new Promise((resolve) => setTimeout(resolve, 30));
  return cartData;
}
