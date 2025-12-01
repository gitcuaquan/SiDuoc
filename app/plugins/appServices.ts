import AuthService from "~/services/AuthService";
import CustomerService from "~/services/CustomerService";
import DiscountService from "~/services/DiscountService";
import { FileService } from "~/services/FileService";
import ItemService from "~/services/ItemService";
import { OrderService } from "~/services/OrderSerice";

export default defineNuxtPlugin((nuxtApp) => {
    let appServices = {
        customer: new CustomerService(),
        items: new ItemService(),
        auth: new AuthService(),
        discount: new DiscountService(),
        order : new OrderService(),
        file: new FileService()
    };
    nuxtApp.provide('appServices', appServices);
})

declare module "#app" {
    interface NuxtApp {
        $appServices: {
            customer: CustomerService;
            items: ItemService;
            auth: AuthService;
            discount: DiscountService;
            order : OrderService;
            file: FileService;
        };
    }
}
