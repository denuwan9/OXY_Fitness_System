const Schedule = require('../models/Schedule');
const MealPlan = require('../models/MealPlan');
const ExercisePlan = require('../models/ExercisePlan');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const RescheduleRequest = require('../models/RescheduleRequest');
const Exercise = require('../models/Exercise');

// Create a new schedule
exports.createSchedule = async (req, res) => {
  try {
    console.log('=== Create Schedule Controller ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User from request:', req.user);
    
    const { userId, membershipType, scheduleType, sessions } = req.body;
    
    console.log('Extracted data:', {
      userId,
      membershipType,
      scheduleType,
      sessionsCount: sessions?.length
    });

    // Validate required fields
    if (!userId || !membershipType || !scheduleType || !sessions || !sessions.length) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['userId', 'membershipType', 'scheduleType', 'sessions']
      });
    }

    // Check for existing sessions at the same time
    for (const session of sessions) {
      const existingSession = await Schedule.findOne({
        userId: userId,
        'sessions.date': new Date(session.date),
        'sessions.time': session.time,
        'sessions.status': { $nin: ['cancelled', 'pending_reschedule'] }
      });

      if (existingSession) {
        return res.status(400).json({
          message: 'Member already has a session scheduled at this time',
          date: session.date,
          time: session.time
        });
      }
    }

    // Create new schedule
    const schedule = new Schedule({
      userId,
      coachId: req.user.userId,
      membershipType,
      scheduleType,
      sessions: sessions.map(session => ({
        ...session,
        date: new Date(session.date),
        time: session.time,
        endTime: session.endTime,
        duration: session.duration || '60 minutes', // Default to 60 minutes if not provided
        workoutType: session.workoutType,
        notes: session.notes || '',
        status: session.status || 'scheduled'
      }))
    });

    console.log('Created schedule object:', JSON.stringify(schedule, null, 2));

    await schedule.save();
    console.log('Schedule saved successfully to database');
    
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Error creating schedule', error: error.message });
  }
};

// Generate AI-powered default training schedule
exports.generateSchedule = async (req, res) => {
  try {
    const { userId, membershipType, scheduleType } = req.body;

    // Find available coaches based on membership type
    const coaches = await User.find({
      role: 'coach',
      membershipType: membershipType
    });

    if (!coaches.length) {
      return res.status(404).json({ message: 'No coaches available for this membership type' });
    }

    // Randomly assign a coach
    const coachId = coaches[Math.floor(Math.random() * coaches.length)]._id;

    // Generate schedule for next 30 days
    const sessions = [];
    const today = new Date();
    const workoutTypes = ['Cardio', 'Strength Training', 'Flexibility', 'HIIT'];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      // Skip weekends if scheduleType is weekday
      if (scheduleType === 'weekday' && (date.getDay() === 0 || date.getDay() === 6)) {
        continue;
      }

      // Skip weekdays if scheduleType is weekend
      if (scheduleType === 'weekend' && date.getDay() !== 0 && date.getDay() !== 6) {
        continue;
      }

      sessions.push({
        date,
        time: '09:00', // Default time, can be modified
        workoutType: workoutTypes[Math.floor(Math.random() * workoutTypes.length)],
        status: 'scheduled'
      });
    }

    const schedule = new Schedule({
      userId,
      coachId,
      membershipType,
      scheduleType,
      sessions
    });

    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's schedule
exports.getUserSchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.params.userId })
      .populate('coachId', 'name email')
      .populate('mealPlan')
      .sort({ 'sessions.date': 1 }); // Sort by session date
    
    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this user' });
    }
    
    res.json(schedules);
  } catch (error) {
    console.error('Get user schedule error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Request schedule change
exports.requestScheduleChange = async (req, res) => {
  try {
    const { sessionId, newDate, newTime } = req.body;
    const schedule = await Schedule.findOne({ userId: req.params.userId });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const session = schedule.sessions.id(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.status = 'rescheduled';
    session.newDate = newDate;
    session.newTime = newTime;
    session.pendingApproval = true;

    await schedule.save();
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reschedule requests (Manager only)
exports.getAllRescheduleRequests = async (req, res) => {
  try {
    console.log('Getting all reschedule requests');
    const requests = await RescheduleRequest.find()
      .populate('userId', 'name email membershipType')
      .populate('scheduleId')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${requests.length} requests`);
    res.json(requests);
  } catch (error) {
    console.error('Error getting reschedule requests:', error);
    res.status(500).json({ 
      message: 'Error retrieving reschedule requests',
      error: error.message 
    });
  }
};

// Approve schedule change (Operation Manager only)
exports.approveScheduleChange = async (req, res) => {
  try {
    const { scheduleId, sessionId } = req.params;
    console.log('Approving schedule change:', { scheduleId, sessionId });

    // Find the reschedule request
    const request = await RescheduleRequest.findById(sessionId);
    if (!request) {
      console.log('Reschedule request not found');
      return res.status(404).json({ message: 'Reschedule request not found' });
    }

    // Find the schedule
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      console.log('Schedule not found');
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Update the schedule with the new date and time
    const session = schedule.sessions.find(s => s._id.toString() === request.sessionId.toString());
    if (session) {
      session.date = request.newDate;
      session.time = request.newTime;
      session.status = 'scheduled';
      session.rescheduled = false;
      session.newDate = undefined;
      session.newTime = undefined;
      session.reason = undefined;
    }

    // Update the request status
    request.status = 'approved';
    await request.save();
    await schedule.save();

    console.log('Schedule change approved successfully');
    res.json({ 
      message: 'Schedule change approved successfully',
      schedule,
      request
    });
  } catch (error) {
    console.error('Error approving schedule change:', error);
    res.status(500).json({ 
      message: 'Error approving schedule change',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Reject schedule change (Operation Manager only)
exports.rejectScheduleChange = async (req, res) => {
  try {
    const { scheduleId, sessionId } = req.params;
    
    // Find the reschedule request
    const request = await RescheduleRequest.findById(sessionId);
    if (!request) {
      return res.status(404).json({ message: 'Reschedule request not found' });
    }

    // Update the request status
    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Schedule change rejected successfully', request });
  } catch (error) {
    console.error('Reject schedule change error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create or update exercise plan
exports.updateExercisePlan = async (req, res) => {
  try {
    const { scheduleId, day, exercises } = req.body;
    const coachId = req.user._id;

    let exercisePlan = await ExercisePlan.findOne({ scheduleId, day });

    if (exercisePlan) {
      exercisePlan.exercises = exercises;
      exercisePlan.updatedAt = Date.now();
    } else {
      exercisePlan = new ExercisePlan({
        scheduleId,
        day,
        exercises,
        createdBy: coachId
      });
    }

    await exercisePlan.save();
    res.json(exercisePlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get exercise plan
exports.getExercisePlan = async (req, res) => {
  try {
    const { scheduleId, day } = req.params;
    const exercisePlan = await ExercisePlan.findOne({ scheduleId, day });

    if (!exercisePlan) {
      return res.status(404).json({ message: 'Exercise plan not found' });
    }

    res.json(exercisePlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign meal plan
exports.assignMealPlan = async (req, res) => {
  try {
    const { scheduleId, meals, membershipType } = req.body;
    console.log('Assigning meal plan:', { scheduleId, meals, membershipType });

    // Find the schedule
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      console.log('Schedule not found:', scheduleId);
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Format meals to ensure proper structure
    const formattedMeals = meals.map(meal => ({
      day: meal.day,
      breakfast: meal.breakfast || '',
      lunch: meal.lunch || '',
      dinner: meal.dinner || '',
      snacks: Array.isArray(meal.snacks) ? meal.snacks : [meal.snacks],
      nutritionalInfo: {
        calories: Number(meal.nutritionalInfo?.calories) || 0,
        protein: Number(meal.nutritionalInfo?.protein) || 0,
        carbs: Number(meal.nutritionalInfo?.carbs) || 0,
        fats: Number(meal.nutritionalInfo?.fats) || 0
      }
    }));

    // Create or update meal plan
    let mealPlan;
    if (schedule.mealPlan) {
      // Update existing meal plan
      mealPlan = await MealPlan.findById(schedule.mealPlan);
      if (mealPlan) {
        mealPlan.meals = formattedMeals;
        mealPlan.membershipType = membershipType;
        await mealPlan.save();
      }
    } else {
      // Create new meal plan
      mealPlan = new MealPlan({
        membershipType,
        meals: formattedMeals
      });
      await mealPlan.save();
    }

    // Update schedule with meal plan reference
    schedule.mealPlan = mealPlan._id;
    await schedule.save();

    console.log('Meal plan assigned successfully:', mealPlan);
    res.json({ 
      message: 'Meal plan assigned successfully',
      schedule,
      mealPlan 
    });
  } catch (error) {
    console.error('Error assigning meal plan:', error);
    res.status(500).json({ 
      message: 'Error assigning meal plan',
      error: error.message 
    });
  }
};

// Get meal plan
exports.getMealPlan = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.scheduleId).populate('mealPlan');
    
    if (!schedule || !schedule.mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    // Get current day of the week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[new Date().getDay()];

    // Find today's meal plan
    const todayMealPlan = schedule.mealPlan.meals.find(meal => meal.day === currentDay);

    if (!todayMealPlan) {
      return res.status(404).json({ message: 'No meal plan found for today' });
    }

    res.json({
      ...schedule.mealPlan.toObject(),
      todayMealPlan
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to get workout type name
const getWorkoutTypeName = (type) => {
  const workoutTypes = {
    1: "Personal Training",
    2: "Group Class",
    3: "Cardio Session",
    4: "Strength Training",
    5: "HIIT Training",
    6: "Yoga Session"
  };
  
  // If type is already a string, return it
  if (typeof type === 'string') {
    return type;
  }
  
  // If type is a number, convert it to string and look up the name
  const typeStr = type?.toString();
  return workoutTypes[typeStr] || "Unknown";
};

// Generate PDF report
exports.generatePDFReport = async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.params.userId })
      .populate('coachId', 'name email phone')
      .populate('userId', 'name email phone membershipType dietType allergies specialGuidelines')
      .populate('mealPlan')
      .sort({ 'sessions.date': 1 });
    if (!schedules.length) {
      return res.status(404).json({ message: 'No schedules found for this user' });
    }
    const ExercisePlan = require('../models/ExercisePlan');
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=oxy-fitness-report.pdf');
    doc.pipe(res);
    const member = schedules[0].userId;
    const coach = schedules[0].coachId;
    const mealPlan = schedules[0].mealPlan;

    // --- Member Info ---
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#2196F3').text('Member Details');
    doc.moveDown(0.7);
    doc.font('Helvetica').fontSize(13).fillColor('#333')
      .text(`Name: ${member.name}`)
      .text(`Email: ${member.email}`)
      .text(`Phone: ${member.phone || 'Not provided'}`)
      .text(`Membership: ${member.membershipType}`)
      .text(`Diet Type: ${member.dietType || 'Not specified'}`)
      .text(`Allergies: ${member.allergies || 'None'}`)
      .text(`Special Guidelines: ${member.specialGuidelines || 'None'}`);
    doc.moveDown(1.2);
    // --- Instructor Info ---
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#388E3C').text('Instructor Details');
    doc.moveDown(0.7);
    doc.font('Helvetica').fontSize(13).fillColor('#333')
      .text(`Name: ${coach.name}`)
      .text(`Email: ${coach.email}`)
      .text(`Phone: ${coach.phone || 'Not provided'}`);
    doc.moveDown(1.2);

    // --- Helper functions for table headers ---
    function renderSessionHeader(y) {
      doc.save();
      doc.font('Helvetica-Bold').fontSize(13);
      doc.rect(50, y, doc.page.width - 100, 24).fill('#F57C00');
      doc.fillColor('#fff');
      doc.text('Date', 55, y + 6, { width: 70 });
      doc.text('Time', 130, y + 6, { width: 60 });
      doc.text('Workout', 200, y + 6, { width: 100 });
      doc.text('Duration', 305, y + 6, { width: 60 });
      doc.text('Status', 370, y + 6, { width: 60 });
      doc.text('Notes', 435, y + 6, { width: 100 });
      doc.restore();
      return y + 24;
    }
    function renderMealHeader(y) {
      doc.save();
      doc.font('Helvetica-Bold').fontSize(13);
      doc.rect(55, y, doc.page.width - 110, 24).fill('#8E24AA');
      doc.fillColor('#fff');
      doc.text('Day', 60, y + 6, { width: 60 });
      doc.text('Breakfast', 125, y + 6, { width: 90 });
      doc.text('Lunch', 220, y + 6, { width: 90 });
      doc.text('Dinner', 315, y + 6, { width: 90 });
      doc.text('Snacks', 410, y + 6, { width: 90 });
      doc.restore();
      return y + 24;
    }
    function renderExerciseHeader(y) {
      doc.save();
      doc.font('Helvetica-Bold').fontSize(13);
      doc.rect(55, y, doc.page.width - 110, 24).fill('#00BCD4');
      doc.fillColor('#fff');
      doc.text('Name', 60, y + 6, { width: 80 });
      doc.text('Category', 145, y + 6, { width: 70 });
      doc.text('Description', 220, y + 6, { width: 120 });
      doc.text('Sets', 345, y + 6, { width: 35 });
      doc.text('Reps', 385, y + 6, { width: 35 });
      doc.text('Difficulty', 425, y + 6, { width: 60 });
      doc.restore();
      return y + 24;
    }

    // --- Sessions Table ---
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#F57C00').text('Sessions');
    let tableY = doc.y + 10; // Explicit gap after title
    tableY = renderSessionHeader(tableY);
    doc.font('Helvetica').fontSize(12);
    let sessionCount = 0;
    schedules.forEach(schedule => {
      schedule.sessions.forEach((session, i) => {
        doc.fillColor(sessionCount % 2 === 0 ? '#FFE0B2' : '#fff');
        doc.rect(50, tableY, doc.page.width - 100, 20).fill();
        doc.fillColor('#333');
        doc.text(new Date(session.date).toLocaleDateString(), 55, tableY + 5, { width: 70 });
        doc.text(session.time, 130, tableY + 5, { width: 60 });
        doc.text(session.workoutType, 200, tableY + 5, { width: 100 });
        doc.text(session.duration || '60 minutes', 305, tableY + 5, { width: 60 });
        doc.text(session.status.charAt(0).toUpperCase() + session.status.slice(1), 370, tableY + 5, { width: 60 });
        doc.text(session.notes || '-', 435, tableY + 5, { width: 100 });
        tableY += 20;
        sessionCount++;
        if (tableY > doc.page.height - 100) {
          doc.addPage();
          tableY = 50;
          tableY = renderSessionHeader(tableY);
          doc.font('Helvetica').fontSize(12);
        }
      });
    });
    if (sessionCount === 0) {
      doc.font('Helvetica').fontSize(12).fillColor('#888').text('No sessions found.', 55, tableY + 5);
      tableY += 20;
    }
    doc.y = tableY + 15;

    // --- Meal Plan Table ---
    if (mealPlan) {
      doc.font('Helvetica-Bold').fontSize(20).fillColor('#8E24AA').text('Meal Plan');
      let mealY = doc.y + 10;
      mealY = renderMealHeader(mealY);
      doc.font('Helvetica').fontSize(11);
      let mealCount = 0;
      mealPlan.meals.forEach((meal, i) => {
        doc.fillColor(i % 2 === 0 ? '#E1BEE7' : '#fff');
        doc.rect(55, mealY, doc.page.width - 110, 18).fill();
        doc.fillColor('#333');
        doc.text(meal.day, 60, mealY + 4, { width: 60 });
        doc.text(meal.breakfast, 125, mealY + 4, { width: 90 });
        doc.text(meal.lunch, 220, mealY + 4, { width: 90 });
        doc.text(meal.dinner, 315, mealY + 4, { width: 90 });
        doc.text(meal.snacks?.join(', ') || '-', 410, mealY + 4, { width: 90 });
        mealY += 18;
        mealCount++;
        if (mealY > doc.page.height - 100) {
          doc.addPage();
          mealY = 50;
          mealY = renderMealHeader(mealY);
          doc.font('Helvetica').fontSize(11);
        }
      });
      if (mealCount === 0) {
        doc.font('Helvetica').fontSize(11).fillColor('#888').text('No meal plan found.', 60, mealY + 4);
        mealY += 18;
      }
      doc.y = mealY + 15;
    }

    // --- Exercises Table (gallery style) ---
    const exercises = await Exercise.find({ 'assignedTo.memberId': member._id });
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#00BCD4').text('Exercises');
    let exY = doc.y + 10;
    exY = renderExerciseHeader(exY);
    doc.font('Helvetica').fontSize(11);
    let exCount = 0;
    exercises.forEach((exercise, i) => {
      doc.fillColor(i % 2 === 0 ? '#B2EBF2' : '#fff');
      doc.rect(55, exY, doc.page.width - 110, 18).fill();
      doc.fillColor('#333');
      doc.text(exercise.name, 60, exY + 4, { width: 80 });
      doc.text(exercise.category, 145, exY + 4, { width: 70 });
      doc.text(exercise.description, 220, exY + 4, { width: 120 });
      doc.text(exercise.sets?.toString() || '-', 345, exY + 4, { width: 35 });
      doc.text(exercise.reps?.toString() || '-', 385, exY + 4, { width: 35 });
      doc.text(exercise.difficulty || '-', 425, exY + 4, { width: 60 });
      exY += 18;
      exCount++;
      if (exY > doc.page.height - 100) {
        doc.addPage();
        exY = 50;
        exY = renderExerciseHeader(exY);
        doc.font('Helvetica').fontSize(11);
      }
    });
    if (exCount === 0) {
      doc.font('Helvetica').fontSize(11).fillColor('#888').text('No exercises found.', 60, exY + 4);
      exY += 18;
    }
    doc.y = exY + 15;

    // --- Footer ---
    doc.moveDown(2);
    doc.font('Helvetica').fontSize(10).fillColor('#999')
      .text('Generated by OXY FITNESS SYSTEM', { align: 'center' })
      .text('Confidential | For Personal Use Only', { align: 'center' });
    doc.end();
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update schedule
exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check if user is authorized to update
    if (schedule.coachId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this schedule' });
    }

    // Update the schedule with the new data
    Object.assign(schedule, req.body);
    
    // Ensure dates are properly formatted
    if (schedule.sessions) {
      schedule.sessions = schedule.sessions.map(session => ({
        ...session,
        date: new Date(session.date)
      }));
    }

    await schedule.save();
    res.json(schedule);
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check if user is authorized to delete
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!['trainer', 'admin'].includes(user.role) && schedule.coachId.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to delete this schedule' });
    }

    await schedule.deleteOne();
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 