import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function listInvoices() {
  const data = await sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;

  return data;
}

// export async function GET() {
//   return Response.json({
//     message:
//       "Uncomment this file and remove this line. You can delete this file when you are finished.",
//   });
//   try {
//     return Response.json(await listInvoices());
//   } catch (error) {
//     return Response.json({ error }, { status: 500 });
//   }
// }

export async function GET() {
  try {
    const data = await listInvoices();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
