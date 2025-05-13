import express from'express';
import {
  createMembership,
  getAllMemberships,
  getMembership,
  updateMembership,
  deleteMembership,
  downloadMembershipPDF
} from '../controllers/membershipController.js';

const router = express.Router();

router
  .route('/')
  .post(createMembership)
  .get(getAllMemberships);

router
  .route('/:id')
  .get(getMembership)
  .patch(updateMembership)
  .delete(deleteMembership);

router
  .route('/:id/pdf')
  .get(downloadMembershipPDF);

export default router;