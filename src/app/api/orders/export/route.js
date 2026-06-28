import ExcelJS from 'exceljs';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(req) {
  const session = await getAdminSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const where = {};
  if (status && status !== 'all') where.status = status;

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Khilafat Detergent';
  const sheet = workbook.addWorksheet('Orders');

  sheet.columns = [
    { header: 'Order #', key: 'orderNumber', width: 18 },
    { header: 'Date', key: 'date', width: 18 },
    { header: 'Customer', key: 'customerName', width: 22 },
    { header: 'Phone', key: 'phone', width: 16 },
    { header: 'Email', key: 'email', width: 22 },
    { header: 'Address', key: 'address', width: 36 },
    { header: 'Items', key: 'items', width: 40 },
    { header: 'Notes', key: 'notes', width: 24 },
    { header: 'Total (Rs.)', key: 'total', width: 14 },
    { header: 'Status', key: 'status', width: 14 },
  ];
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0B3A8A' },
  };
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  for (const order of orders) {
    sheet.addRow({
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString().slice(0, 16).replace('T', ' '),
      customerName: order.customerName,
      phone: order.phone,
      email: order.email || '',
      address: order.address,
      items: order.items
        .map((it) => `${it.name} (${it.size}) x${it.qty} @Rs.${it.price}`)
        .join('; '),
      notes: order.notes || '',
      total: order.total,
      status: order.status,
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="khilafat-orders-${Date.now()}.xlsx"`,
    },
  });
}
