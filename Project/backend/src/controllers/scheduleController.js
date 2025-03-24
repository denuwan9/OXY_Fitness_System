const Schedule = require('../models/Schedule');
const MealPlan = require('../models/MealPlan');
const ExercisePlan = require('../models/ExercisePlan');
const User = require('../models/User');
const PDFDocument = require('pdfkit');

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
    const schedule = await Schedule.findOne({ userId: req.params.userId })
      .populate('coachId', 'name email')
      .populate('mealPlan');
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Approve schedule change (Operation Manager only)
exports.approveScheduleChange = async (req, res) => {
  try {
    const { scheduleId, sessionId } = req.params;
    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const session = schedule.sessions.id(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.newDate && session.newTime) {
      session.date = session.newDate;
      session.time = session.newTime;
    }

    session.status = 'scheduled';
    session.pendingApproval = false;
    session.newDate = undefined;
    session.newTime = undefined;

    await schedule.save();
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    // Create or update meal plan
    let mealPlan;
    if (schedule.mealPlan) {
      // Update existing meal plan
      mealPlan = await MealPlan.findById(schedule.mealPlan);
      if (mealPlan) {
        mealPlan.meals = meals;
        mealPlan.membershipType = membershipType;
        await mealPlan.save();
      }
    } else {
      // Create new meal plan
      mealPlan = new MealPlan({
        membershipType,
        meals
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

    res.json(schedule.mealPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to get workout type name
const getWorkoutTypeName = (type) => {
  switch (type) {
    case 1:
      return "Personal Training";
    case 2:
      return "Group Class";
    case 3:
      return "Cardio Session";
    case 4:
      return "Strength Training";
    case 5:
      return "HIIT Training";
    case 6:
      return "Yoga Session";
    default:
      return type?.toString() || "Unknown"; // Handle undefined/null cases
  }
};

// Generate PDF report
exports.generatePDFReport = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ userId: req.params.userId })
      .populate('coachId', 'name email')
      .populate('userId', 'name email')
      .populate('mealPlan');

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=schedule-report.pdf');
    doc.pipe(res);

    // Add header with logo and title
    doc.fontSize(24)
       .text('OXY FITNESS', { align: 'center' })
       .moveDown();
    
    doc.fontSize(20)
       .text('Schedule Report', { align: 'center' })
       .moveDown();

    // Add member information
    doc.fontSize(16)
       .text('Member Information', { underline: true })
       .moveDown();
    
    doc.fontSize(12)
       .text(`Name: ${schedule.userId.name}`)
       .text(`Email: ${schedule.userId.email}`)
       .text(`Membership Type: ${schedule.membershipType}`)
       .text(`Coach: ${schedule.coachId.name}`)
       .moveDown();

    // Add schedule details
    doc.fontSize(16)
       .text('Training Schedule', { underline: true })
       .moveDown();
    
    schedule.sessions.forEach(session => {
      doc.fontSize(12)
         .text(`Date: ${new Date(session.date).toLocaleDateString()}`)
         .text(`Time: ${session.time}`)
         .text(`Workout Type: ${getWorkoutTypeName(session.workoutType)}`)
         .text(`Duration: ${session.duration}`)
         .text(`Location: ${session.location || 'Main Gym'}`)
         .text(`Status: ${session.status.charAt(0).toUpperCase() + session.status.slice(1)}`)
         .text(`Notes: ${session.notes || 'No notes'}`)
         .moveDown();
    });

    // Add meal plan if available
    if (schedule.mealPlan) {
      doc.fontSize(16)
         .text('Meal Plan', { underline: true })
         .moveDown();

      schedule.mealPlan.meals.forEach(meal => {
        doc.fontSize(14)
           .text(meal.day, { underline: true })
           .moveDown()
           .fontSize(12)
           .text(`Breakfast: ${meal.breakfast}`)
           .text(`Lunch: ${meal.lunch}`)
           .text(`Dinner: ${meal.dinner}`)
           .text(`Snacks: ${meal.snacks.join(', ')}`)
           .moveDown();
      });
    }

    // Add footer
    doc.moveDown()
       .fontSize(10)
       .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ message: error.message });
  }
};

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

    // Create new schedule
    const schedule = new Schedule({
      userId,
      coachId: req.user._id,
      membershipType,
      scheduleType,
      sessions: sessions.map(session => ({
        ...session,
        date: new Date(session.date),
        duration: session.duration || '60 minutes' // Default to 60 minutes if not provided
      }))
    });

    console.log('Created schedule object:', JSON.stringify(schedule, null, 2));

    await schedule.save();
    console.log('Schedule saved successfully to database');
    
    res.status(201).json(schedule);
  } catch (error) {
    console.error('=== Create Schedule Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Error creating schedule', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
    if (schedule.coachId.toString() !== req.user._id) {
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