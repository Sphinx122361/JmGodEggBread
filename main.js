
const PRICE_PER_ITEM = 15;

const orderForm = document.getElementById("orderForm");

if (orderForm) {
    const $ = id => document.getElementById(id);

    const nameInput = $("customerName");
    const quantityInput = $("quantity");
    const detailsInput = $("orderDetails");
    const paymentInput = $("paymentMethod");

    const message = $("orderMessage");
    const summary = $("orderSummary");
    const copyButton = $("copyOrder");

    const gcashPayment = $("gcashPayment");
    const gcashAmount = $("gcashAmount");
    const confirmPayment = $("confirmPayment");
    const paymentStatus = $("paymentStatus");
    const closeGcash = $("closeGcash");

    let currentOrder = null;
    let currentOrderText = "";

    function showMessage(text, color = "#333") {
        message.textContent = text;
        message.style.color = color;
    }

    function calculateTotal() {
        const quantity = Number(quantityInput.value);

        return Number.isInteger(quantity) && quantity > 0
            ? quantity * PRICE_PER_ITEM
            : 0;
    }

    function updateGcashAmount() {
        gcashAmount.textContent =
            `₱${calculateTotal().toFixed(2)}`;
    }

    function resetOrder() {
        currentOrder = null;
        currentOrderText = "";

        paymentStatus.textContent = "";
        summary.textContent = "";
        summary.hidden = true;
        copyButton.hidden = true;
    }

    function createOrder() {
        const name = nameInput.value.trim();
        const quantity = Number(quantityInput.value);
        const details = detailsInput.value.trim();

        const paymentMethod = getPaymentMethod();

        if (
            !name ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            !details ||
            !paymentMethod
        ) {
            showMessage(
                "Please complete all fields correctly.",
                "#b42318"
            );
            return null;
        }

        return {
            orderNumber: `EGG-${Date.now()}`,
            customerName: name,
            quantity,
            details,
            total: quantity * PRICE_PER_ITEM,
            paymentMethod
        };
    }

    function getPaymentMethod() {
        const selectedOption =
            paymentInput.options[paymentInput.selectedIndex];

        const selectedPayment = (
            paymentInput.value + " " +
            (selectedOption?.textContent || "")
        ).trim().toLowerCase();

        if (selectedPayment.includes("gcash")) {
            return "GCash";
        }

        if (
            selectedPayment.includes("cash on delivery") ||
            /\bcod\b/.test(selectedPayment)
        ) {
            return "Cash on Delivery";
        }

        return "";
    }

    function createOrderText(order, status) {
        return [
            "Hello! I want to order EggyBite.",
            `Order Number: ${order.orderNumber}`,
            `Name: ${order.customerName}`,
            `Quantity: ${order.quantity}`,
            `Total: PHP ${order.total.toFixed(2)}`,
            `Pickup details: ${order.details}`,
            `Payment Method: ${order.paymentMethod}`,
            `Payment Status: ${status}`
        ].join("\n");
    }

    function updatePaymentDisplay() {
        resetOrder();

        gcashPayment.hidden = true;

        if (getPaymentMethod() === "GCash") {
            updateGcashAmount();

            showMessage(
                "Complete your order and click Order Us to continue.",
                "#007dce"
            );
        } else {
            showMessage("");
        }
    }

    function closeGcashPopup() {
        gcashPayment.hidden = true;
    }

    paymentInput.addEventListener(
        "change",
        updatePaymentDisplay
    );

    closeGcash.addEventListener(
        "click",
        closeGcashPopup
    );

    gcashPayment.addEventListener("click", event => {
        if (event.target === gcashPayment) {
            closeGcashPopup();
        }
    });

    quantityInput.addEventListener("input", () => {
        updateGcashAmount();
        resetOrder();
    });

    nameInput.addEventListener("input", resetOrder);
    detailsInput.addEventListener("input", resetOrder);

    orderForm.addEventListener("submit", event => {
        event.preventDefault();

        const order = createOrder();

        if (!order) return;

        currentOrder = order;

        if (order.paymentMethod === "GCash") {
            updateGcashAmount();

            paymentStatus.textContent = "";

            gcashPayment.hidden = false;

            showMessage("");

            return;
        }

        const codOrder = {
            ...order,
            status: "UNPAID",
            orderText: createOrderText(
                order,
                "UNPAID - CASH ON DELIVERY"
            ),
            date: new Date().toLocaleString()
        };

        sessionStorage.setItem(
            "codOrder",
            JSON.stringify(codOrder)
        );

        window.location.href = "cod_confirmation.html";
    });

    confirmPayment.addEventListener("click", () => {
        if (
            !currentOrder ||
            currentOrder.paymentMethod !== "GCash"
        ) {
            showMessage(
                "Please complete your order first.",
                "#b42318"
            );
            return;
        }

        const payment = {
            ...currentOrder,
            status: "PAID",
            orderText: createOrderText(
                currentOrder,
                "PAID"
            ),
            date: new Date().toLocaleString()
        };

        sessionStorage.setItem(
            "demoPayment",
            JSON.stringify(payment)
        );

        paymentStatus.textContent =
            "Payment successful! Redirecting...";

        paymentStatus.style.color = "#20a65a";

        window.location.href = "payment_result.html";
    });

    copyButton?.addEventListener("click", async () => {
        if (!currentOrderText) return;

        try {
            await navigator.clipboard.writeText(
                currentOrderText
            );

            showMessage(
                "Order details copied successfully!",
                "#245b2a"
            );
        } catch {
            showMessage(
                "Select and copy the order details shown above.",
                "#8a4b08"
            );
        }
    });

    updateGcashAmount();
    updatePaymentDisplay();
}

