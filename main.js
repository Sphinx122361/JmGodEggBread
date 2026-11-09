const ORIGINAL_PRICE = 15;
const CHEGGY_PRICE = 17;

const orderForm = document.getElementById("orderForm");

if (orderForm) {

    const $ = id => document.getElementById(id);

    const nameInput = $("customerName");
    const originalQuantity = $("originalQuantity");
    const cheggyQuantity = $("cheggyQuantity");
    const detailsInput = $("orderDetails");

    const message = $("orderMessage");
    const orderButton = $("orderButton");

    function showMessage(text, color = "#333") {
        message.textContent = text;
        message.style.color = color;
    }

    function createOrder() {

        const name = nameInput.value.trim();

        const originalQty = Number(originalQuantity.value);
        const cheggyQty = Number(cheggyQuantity.value);

        const details = detailsInput.value.trim();

        if (
            !name ||
            !Number.isSafeInteger(originalQty) ||
            !Number.isSafeInteger(cheggyQty) ||
            originalQty < 0 ||
            cheggyQty < 0 ||
            originalQty + cheggyQty < 1 ||
            !details
        ) {
            showMessage(
                "Please complete all fields and order at least one EggyBite.",
                "#b42318"
            );

            return null;
        }

        const originalTotal = originalQty * ORIGINAL_PRICE;
        const cheggyTotal = cheggyQty * CHEGGY_PRICE;

        const total = originalTotal + cheggyTotal;

        if (!Number.isSafeInteger(total)) {
            showMessage(
                "Your order quantity is too large.",
                "#b42318"
            );

            return null;
        }

        return {
            orderNumber: `EGG-${Date.now()}`,

            customerName: name,

            originalQuantity: originalQty,
            cheggyQuantity: cheggyQty,

            originalPrice: ORIGINAL_PRICE,
            cheggyPrice: CHEGGY_PRICE,

            originalTotal: originalTotal,
            cheggyTotal: cheggyTotal,

            quantity: originalQty + cheggyQty,

            details: details,

            total: total,

            paymentMethod: "Cash on Delivery",

            status: "UNPAID",

            date: new Date().toLocaleString()
        };
    }

    function createOrderText(order) {

        return [
            "Hello! I want to order EggyBite.",
            "",
            `Order Number: ${order.orderNumber}`,
            `Name: ${order.customerName}`,
            "",
            "ORDER DETAILS",
            `Original EggyBite: ${order.originalQuantity} x PHP ${order.originalPrice}`,
            `CheggyBitee: ${order.cheggyQuantity} x PHP ${order.cheggyPrice}`,
            "",
            `Original Subtotal: PHP ${order.originalTotal.toFixed(2)}`,
            `CheggyBitee Subtotal: PHP ${order.cheggyTotal.toFixed(2)}`,
            `Total Quantity: ${order.quantity}`,
            `Total Amount: PHP ${order.total.toFixed(2)}`,
            "",
            `Pickup Details: ${order.details}`,
            `Payment Method: ${order.paymentMethod}`,
            "Payment Status: UNPAID - CASH ON DELIVERY",
            `Date: ${order.date}`
        ].join("\n");
    }

    orderForm.addEventListener("submit", event => {

        event.preventDefault();

        const order = createOrder();

        if (!order) return;

        order.orderText = createOrderText(order);

        try {

            sessionStorage.setItem(
                "codOrder",
                JSON.stringify(order)
            );

            orderButton.disabled = true;

            window.location.href = "cod_confirmation.html";

        } catch (error) {

            orderButton.disabled = false;

            showMessage(
                "Unable to save your order. Please try again.",
                "#b42318"
            );

        }

    });

}
