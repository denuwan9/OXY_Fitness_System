const Schedule = require('../models/Schedule');
const MealPlan = require('../models/MealPlan');
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

// Assign meal plan
exports.assignMealPlan = async (req, res) => {
  try {
    const { scheduleId, mealPlanId } = req.body;
    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    schedule.mealPlan = mealPlanId;
    await schedule.save();
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate PDF report
exports.generatePDFReport = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ userId: req.params.userId })
      .populate('coachId', 'name email')
      .populate('mealPlan');

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=schedule-report.pdf');
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text('Oxy Fitness Schedule Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Member ID: ${schedule.userId}`);
    doc.text(`Coach: ${schedule.coachId.name}`);
    doc.text(`Membership Type: ${schedule.membershipType}`);
    doc.moveDown();

    // Add schedule details
    doc.fontSize(16).text('Training Schedule');
    doc.moveDown();
    schedule.sessions.forEach(session => {
      doc.fontSize(12).text(`Date: ${session.date.toLocaleDateString()}`);
      doc.text(`Time: ${session.time}`);
      doc.text(`Workout Type: ${session.workoutType}`);
      doc.text(`Status: ${session.status}`);
      doc.moveDown();
    });

    // Add meal plan if exists
    if (schedule.mealPlan) {
      doc.fontSize(16).text('Meal Plan');
      doc.moveDown();
      schedule.mealPlan.meals.forEach(meal => {
        doc.fontSize(12).text(`Day: ${meal.day}`);
        doc.text(`Breakfast: ${meal.breakfast}`);
        doc.text(`Lunch: ${meal.lunch}`);
        doc.text(`Dinner: ${meal.dinner}`);
        doc.text('Snacks:');
        meal.snacks.forEach(snack => doc.text(`- ${snack}`));
        doc.moveDown();
      });
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 