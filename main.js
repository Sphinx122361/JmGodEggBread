const PRICE_PER_ITEM = 20;
const MESSENGER_URL = "https://m.me/61594116885367";

const orderForm = document.getElementById("orderForm");

if (orderForm) {
    const nameInput = document.getElementById("customerName");
    const quantityInput = document.getElementById("quantity");
    const detailsInput = document.getElementById("orderDetails");
    const message = document.getElementById("orderMessage");
    const summary = document.getElementById("orderSummary");
    const copyButton = document.getElementById("copyOrder");

    let currentOrderText = "";

    orderForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const quantity = Number(quantityInput.value);
        const details = detailsInput.value.trim();

        if (!name || !Number.isInteger(quantity) || quantity < 1 || !details) {
            message.textContent = "Please complete all fields correctly.";
            message.style.color = "#b42318";
            return;
        }

        const total = quantity * PRICE_PER_ITEM;

        currentOrderText = [
            "Hello! I want to order EggyBite.",
            "Name: " + name,
            "Quantity: " + quantity,
            "Total: PHP " + total,
            "Pickup details: " + details
        ].join("\n");

        summary.textContent = currentOrderText;
        summary.hidden = false;
        copyButton.hidden = false;

        message.textContent =
            "Your total is PHP " + total +
            ". Copy your order details, then send them in Messenger.";

        message.style.color = "#245b2a";

        window.open(MESSENGER_URL, "_blank", "noopener,noreferrer");
    });

    copyButton.addEventListener("click", async function() {
        if (!currentOrderText) {
            return;
        }

        try {
            await navigator.clipboard.writeText(currentOrderText);

            message.textContent =
                "Order details copied. Paste them into Messenger and press Send.";

            message.style.color = "#245b2a";
        } catch (error) {
            message.textContent =
                "Select and copy the order details shown above, then paste them into Messenger.";

            message.style.color = "#8a4b08";
        }
    });
}