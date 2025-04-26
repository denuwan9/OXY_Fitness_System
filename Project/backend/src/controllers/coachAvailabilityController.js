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
    console.log('Request body:', req.body);
    
    const { memberId, coachId } = req.body;
    
    if (!memberId) {
      return res.status(400).json({ message: 'Member ID is required' });
    }

    // If coachId is provided (manager assigning), use it; otherwise use the logged-in user's ID
    const targetCoachId = coachId || req.user.userId;
    
    console.log('Target coach ID:', targetCoachId);
    console.log('Member ID:', memberId);
    
    // Add more detailed logging for member lookup
    console.log('Looking up member with ID:', memberId);
    const member = await User.findById(memberId);
    console.log('Member lookup result:', member ? {
      id: member._id,
      name: member.name,
      role: member.role,
      isActive: member.isActive
    } : 'Not found');
    
    if (!member) {
      console.log('Member not found in database');
      return res.status(404).json({ message: 'Member not found' });
    }
    
    if (member.role !== 'user') {
      console.log('Member found but has incorrect role:', member.role);
      return res.status(400).json({ message: 'Member must have role "user"' });
    }
    
    if (!member.isActive) {
      console.log('Member found but is not active');
      return res.status(400).json({ message: 'Member account is not active' });
    }
    
    let coachAvailability = await CoachAvailability.findOne({ coachId: targetCoachId });
    console.log('Found coach availability:', coachAvailability);
    
    if (!coachAvailability) {
      console.log('Creating new coach availability');
      coachAvailability = new CoachAvailability({
        coachId: targetCoachId,
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
    
    // Add member to assigned members with timestamp
    coachAvailability.assignedMembers.push({ 
      memberId,
      assignedAt: new Date()
    });
    
    await coachAvailability.save();
    console.log('Updated coach availability:', coachAvailability);
    
    res.json({
      message: 'Member assigned successfully',
      coachAvailability
    });
  } catch (error) {
    console.error('Error in assignMember:', error);
    res.status(500).json({ 
      message: 'Error assigning member',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Remove member from coach
exports.removeMember = async (req, res) => {
  try {
    console.log('Removing member from coach');
    console.log('Member ID:', req.params.memberId);
    
    const { memberId } = req.params;
    
    // Find all coach availabilities that have this member assigned
    const coachAvailabilities = await CoachAvailability.find({
      'assignedMembers.memberId': memberId
    });
    
    console.log('Found coach availabilities:', coachAvailabilities.length);
    
    if (coachAvailabilities.length === 0) {
      return res.status(404).json({ 
        message: 'Member is not assigned to any coach',
        memberId 
      });
    }
    
    // Remove member from all coach availabilities
    for (const availability of coachAvailabilities) {
      availability.assignedMembers = availability.assignedMembers.filter(
        assigned => assigned.memberId.toString() !== memberId
      );
      await availability.save();
      console.log(`Removed member from coach ${availability.coachId}`);
    }
    
    res.json({ 
      message: 'Member removed successfully from all coaches',
      memberId,
      affectedCoaches: coachAvailabilities.length
    });
  } catch (error) {
    console.error('Error in removeMember:', error);
    res.status(500).json({ 
      message: 'Error removing member',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get assigned members
exports.getAssignedMembers = async (req, res) => {
  try {
    console.log('Getting assigned members for coachId:', req.params.coachId);
    
    const coachAvailability = await CoachAvailability.findOne({ 
      coachId: req.params.coachId 
    }).populate('assignedMembers.memberId', 'name email membershipType');
    
    console.log('Found coach availability:', coachAvailability);
    
    if (!coachAvailability) {
      console.log('No coach availability found');
      return res.status(404).json({ message: 'Coach availability not found' });
    }
    
    // Extract and format the assigned members
    const assignedMembers = coachAvailability.assignedMembers.map(assignment => ({
      memberId: assignment.memberId,
      assignedAt: assignment.assignedAt
    }));
    
    console.log('Returning assigned members:', assignedMembers);
    res.json(assignedMembers);
  } catch (error) {
    console.error('Error in getAssignedMembers:', error);
    res.status(500).json({ 
      message: 'Error getting assigned members',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 