const CoachAvailability = require('../models/CoachAvailability');
const User = require('../models/User');

// Get coach availability
exports.getCoachAvailability = async (req, res) => {
  try {
    console.log('Getting coach availability for coachId:', req.params.coachId);
    const availability = await CoachAvailability.findOne({ coachId: req.params.coachId })
      .populate('assignedMembers.memberId', 'name email membershipType');
    
    console.log('Found availability:', availability);
    
    if (!availability) {
      console.log('No availability found for coach');
      return res.status(404).json({ message: 'Coach availability not found' });
    }
    
    res.json(availability);
  } catch (error) {
    console.error('Error in getCoachAvailability:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create or update coach availability
exports.updateCoachAvailability = async (req, res) => {
  try {
    console.log('Updating coach availability for user:', req.user);
    console.log('Request body:', req.body);
    
    const { availability } = req.body;
    const coachId = req.user.userId; // Changed from req.user._id to req.user.userId
    
    if (!coachId) {
      console.error('No coach ID found in request:', req.user);
      return res.status(400).json({ message: 'Coach ID is required' });
    }

    // Validate availability data
    if (!Array.isArray(availability)) {
      return res.status(400).json({ message: 'Availability must be an array' });
    }

    // Find existing or create new
    let coachAvailability = await CoachAvailability.findOne({ coachId });
    
    if (!coachAvailability) {
      coachAvailability = new CoachAvailability({
        coachId,
        availability: []
      });
    }

    // Update availability with proper structure
    coachAvailability.availability = availability.map(day => ({
      day: day.day,
      timeRanges: day.timeRanges.map(range => ({
        startTime: range.startTime,
        endTime: range.endTime,
        capacity: range.capacity || 1
      }))
    }));

    try {
      const savedAvailability = await coachAvailability.save();
      console.log('Saved availability:', savedAvailability);
      res.json(savedAvailability);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return res.status(400).json({ 
        message: 'Validation error', 
        details: validationError.message 
      });
    }
  } catch (error) {
    console.error('Error in updateCoachAvailability:', error);
    res.status(500).json({ message: error.message });
  }
};

// Assign member to coach
exports.assignMember = async (req, res) => {
  try {
    console.log('Assigning member to coach');
    console.log('Coach ID:', req.user.userId);
    console.log('Member ID:', req.body.memberId);
    
    const { memberId } = req.body;
    
    const member = await User.findById(memberId);
    console.log('Found member:', member);
    
    if (!member || member.role !== 'user') {
      console.log('Member not found or not a user');
      return res.status(404).json({ message: 'Member not found' });
    }
    
    let coachAvailability = await CoachAvailability.findOne({ coachId: req.user.userId });
    console.log('Found coach availability:', coachAvailability);
    
    if (!coachAvailability) {
      console.log('Creating new coach availability');
      coachAvailability = new CoachAvailability({
        coachId: req.user.userId,
        availability: [],
        assignedMembers: []
      });
    }
    
    // Check if member is already assigned
    const isAlreadyAssigned = coachAvailability.assignedMembers.some(
      assigned => assigned.memberId.toString() === memberId
    );
    
    if (isAlreadyAssigned) {
      console.log('Member already assigned');
      return res.status(400).json({ message: 'Member is already assigned to this coach' });
    }
    
    coachAvailability.assignedMembers.push({ memberId });
    await coachAvailability.save();
    console.log('Updated coach availability:', coachAvailability);
    
    res.json(coachAvailability);
  } catch (error) {
    console.error('Error in assignMember:', error);
    res.status(500).json({ message: error.message });
  }
};

// Remove member from coach
exports.removeMember = async (req, res) => {
  try {
    console.log('Removing member from coach');
    console.log('Coach ID:', req.user.userId);
    console.log('Member ID:', req.params.memberId);
    
    const { memberId } = req.params;
    
    const coachAvailability = await CoachAvailability.findOne({ coachId: req.user.userId });
    console.log('Found coach availability:', coachAvailability);
    
    if (!coachAvailability) {
      console.log('Coach availability not found');
      return res.status(404).json({ message: 'Coach availability not found' });
    }
    
    coachAvailability.assignedMembers = coachAvailability.assignedMembers.filter(
      assigned => assigned.memberId.toString() !== memberId
    );
    
    await coachAvailability.save();
    console.log('Updated coach availability:', coachAvailability);
    res.json(coachAvailability);
  } catch (error) {
    console.error('Error in removeMember:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all assigned members
exports.getAssignedMembers = async (req, res) => {
  try {
    console.log('Getting assigned members for coach:', req.user.userId);
    
    const coachAvailability = await CoachAvailability.findOne({ coachId: req.user.userId })
      .populate('assignedMembers.memberId', 'name email membershipType');
    
    console.log('Found coach availability:', coachAvailability);
    
    if (!coachAvailability) {
      console.log('Coach availability not found');
      return res.status(404).json({ message: 'Coach availability not found' });
    }
    
    res.json(coachAvailability.assignedMembers);
  } catch (error) {
    console.error('Error in getAssignedMembers:', error);
    res.status(500).json({ message: error.message });
  }
}; 