import Membership from'../models/Membership.js';
import { createPDF } from'../utlis/pdfGenerator.js';

const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Create a new membership
export const createMembership = catchAsync(async (req, res) => {
  const newMembership = await Membership.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      membership: newMembership
    }
  });
});

// Get all memberships
export const getAllMemberships = catchAsync(async (req, res) => {
  const memberships = await Membership.find().sort('-createdAt');
  
  res.status(200).json({
    status: 'success',
    results: memberships.length,
    data: {
      memberships
    }
  });
});

// Get a single membership
export const getMembership = catchAsync(async (req, res, next) => {
  const membership = await Membership.findById(req.params.id);
  
  if (!membership) {
    return next(new Error('No membership found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      membership
    }
  });
});

// Update a membership
export const updateMembership = catchAsync(async (req, res, next) => {
  const membership = await Membership.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!membership) {
    return next(new Error('No membership found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      membership
    }
  });
});

// Delete a membership
export const deleteMembership = catchAsync(async (req, res, next) => {
  const membership = await Membership.findByIdAndDelete(req.params.id);
  
  if (!membership) {
    return next(new Error('No membership found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Download membership PDF
export const downloadMembershipPDF = catchAsync(async (req, res, next) => {
  const membership = await Membership.findById(req.params.id);
  
  if (!membership) {
    return next(new Error('No membership found with that ID', 404));
  }
  
  const pdfBuffer = await createPDF(membership);
  
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename=membership_${membership.userId}.pdf`
  });
  
  res.send(pdfBuffer);
});