
import axios from "axios";

const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[char]));

export const sendBillEmail = async (req, res) => {
    try {
        const {
            customer,
            items = [],
            subtotal,
            discount,
            totalAmount,
            paymentMethod,
            paymentStatus,
            billId,
        } = req.body;

        if (!process.env.BREVO_API_KEY ||
            !process.env.BREVO_SENDER_EMAIL) {
            return res.status(500).json({
                status: 0,
                message: "Email service is not configured.",
            });
        }

        if (!customer?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
            return res.status(400).json({
                status: 0,
                message: "A valid customer email is required.",
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                status: 0,
                message: "Bill items are missing.",
            });
        }

        const money = (value) =>
            `₹${Number(value || 0).toFixed(2)}`;

        const itemRows = items.map((item) => {
            const name = escapeHtml(
                item.name || item.productName || item.product?.name || "Product"
            );
            const quantity = Math.max(0, Number(item.quantity) || 0);
            const price = Math.max(0, Number(item.price ?? item.product?.price) || 0);

            return `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #ddd">${name}</td>
          <td style="padding:10px;border-bottom:1px solid #ddd">${quantity}</td>
          <td style="padding:10px;border-bottom:1px solid #ddd">${money(price)}</td>
          <td style="padding:10px;border-bottom:1px solid #ddd">${money(price * quantity)}</td>
        </tr>`;
        }).join("");

        const address = [
            customer.address,
            customer.city,
            customer.pincode,
        ].filter(Boolean).map(escapeHtml).join(", ");

        const htmlContent = `
      <div style="font-family:Arial,sans-serif;color:#222;max-width:700px;margin:auto">
        <h2>Online Cloths Shop — Bill</h2>
        <p>Thank you for your purchase, ${escapeHtml(customer.name || "Customer")}.</p>

        ${billId ? `<p><b>Bill ID:</b> ${escapeHtml(billId)}</p>` : ""}

        <h3>Customer and delivery details</h3>
        <p>
          <b>Name:</b> ${escapeHtml(customer.name || "")}<br/>
          <b>Email:</b> ${escapeHtml(customer.email)}<br/>
          <b>Phone:</b> ${escapeHtml(customer.phone || "")}<br/>
          <b>Delivery address:</b> ${address || "Not provided"}
        </p>

        <h3>Order items</h3>
        <table style="width:100%;border-collapse:collapse;text-align:left">
          <thead>
            <tr>
              <th style="padding:10px">Product</th>
              <th style="padding:10px">Qty</th>
              <th style="padding:10px">Price</th>
              <th style="padding:10px">Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <p><b>Subtotal:</b> ${money(subtotal)}</p>
        <p><b>Discount:</b> ${money(discount)}</p>
        <h3>Total: ${money(totalAmount)}</h3>
        <p><b>Payment method:</b> ${escapeHtml(paymentMethod || "Not specified")}</p>
        <p><b>Payment status:</b> ${escapeHtml(paymentStatus || "Not specified")}</p>
      </div>`;

        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: process.env.BREVO_SENDER_NAME || "Vibe Vault",
                    email: process.env.BREVO_SENDER_EMAIL,
                },
                to: [{
                    email: customer.email,
                    name: customer.name || customer.email,
                }],
                subject: `Your Online Cloths Shop Bill${billId ? ` - ${billId}` : ""}`,
                htmlContent,
            },
            {
                headers: {
                    accept: "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json",
                },
                timeout: 15000,
            }
        );

        return res.status(200).json({
            status: 1,
            message: "Bill email sent successfully.",
            messageId: response.data.messageId,
        });
    } catch (error) {
        console.error(
            "Brevo send bill error:",
            error.response?.data || error.message
        );

        return res.status(502).json({
            status: 0,
            message: "Could not send the bill email. Please try again.",
        });
    }
};
