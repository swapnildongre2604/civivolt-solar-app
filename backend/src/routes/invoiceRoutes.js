import { Router } from 'express';
import {
  createInvoice,
  downloadInvoicePdf,
  summaryReport,
  exportReportExcel,
  emailInvoice
} from '../controllers/invoiceController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.use(authRequired);
router.post('/', createInvoice);
router.get('/summary', summaryReport);
router.get('/export/excel', exportReportExcel);
router.get('/:id/pdf', downloadInvoicePdf);
router.post('/email', emailInvoice);

export default router;
