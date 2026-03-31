export function calculateGST(lines, intraState = true) {
  const subtotal = lines.reduce((sum, l) => sum + l.qty * l.rate, 0);
  const taxable = Number(subtotal.toFixed(2));

  if (intraState) {
    const cgst = Number((taxable * 0.09).toFixed(2));
    const sgst = Number((taxable * 0.09).toFixed(2));
    return { taxable, cgst, sgst, igst: 0, total: Number((taxable + cgst + sgst).toFixed(2)) };
  }

  const igst = Number((taxable * 0.18).toFixed(2));
  return { taxable, cgst: 0, sgst: 0, igst, total: Number((taxable + igst).toFixed(2)) };
}

export function nextInvoiceNumber(lastNumber = 'CIVI-0000') {
  const serial = Number(lastNumber.split('-')[1] || 0) + 1;
  return `CIVI-${String(serial).padStart(4, '0')}`;
}
