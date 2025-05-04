import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const pdfService = {
  generateSchedulePDF: (schedule, memberInfo, coachInfo) => {
    if (!schedule || !memberInfo || !coachInfo) {
      throw new Error('Missing required data for schedule PDF generation');
    }

    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('OXY Fitness - Training Schedule', 105, 20, { align: 'center' });
    
    // Add member info
    doc.setFontSize(12);
    doc.text(`Member: ${memberInfo.name || 'N/A'}`, 20, 40);
    doc.text(`Membership: ${schedule.membershipType || 'N/A'}`, 20, 50);
    doc.text(`Coach: ${coachInfo.name || 'N/A'}`, 20, 60);
    
    // Add schedule table
    const tableColumn = ['Date', 'Time', 'Workout Type', 'Duration', 'Status'];
    const tableRows = Array.isArray(schedule.sessions) 
      ? schedule.sessions.map(session => [
          session.date ? new Date(session.date).toLocaleDateString() : 'N/A',
          session.time || 'N/A',
          session.workoutType || 'N/A',
          session.duration || 'N/A',
          session.status || 'N/A'
        ])
      : [];
    
    if (tableRows.length > 0) {
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [33, 150, 243] }
      });
    } else {
      doc.setFontSize(12);
      doc.text('No sessions found', 20, 70);
    }
    
    return doc;
  },
  
  generateWorkoutPlanPDF: (exercisePlan, memberInfo) => {
    if (!exercisePlan || !memberInfo) {
      throw new Error('Missing required data for workout plan PDF generation');
    }

    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('OXY Fitness - Workout Plan', 105, 20, { align: 'center' });
    
    // Add member info
    doc.setFontSize(12);
    doc.text(`Member: ${memberInfo.name || 'N/A'}`, 20, 40);
    doc.text(`Day: ${exercisePlan.day || 'N/A'}`, 20, 50);
    
    // Add exercise table
    const tableColumn = ['Exercise', 'Sets', 'Reps'];
    const tableRows = Array.isArray(exercisePlan.exercises)
      ? exercisePlan.exercises.map(exercise => [
          exercise.name || 'N/A',
          exercise.sets || 'N/A',
          exercise.reps || 'N/A'
        ])
      : [];
    
    if (tableRows.length > 0) {
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [33, 150, 243] }
      });
    } else {
      doc.setFontSize(12);
      doc.text('No exercises found', 20, 60);
    }
    
    return doc;
  },
  
  generateMealPlanPDF: (mealPlan, memberInfo) => {
    if (!mealPlan || !memberInfo) {
      throw new Error('Missing required data for meal plan PDF generation');
    }

    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('OXY Fitness - Meal Plan', 105, 20, { align: 'center' });
    
    // Add member info
    doc.setFontSize(12);
    doc.text(`Member: ${memberInfo.name || 'N/A'}`, 20, 40);
    
    // Add meal plan table
    const tableColumn = ['Day', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    const tableRows = Array.isArray(mealPlan.meals)
      ? mealPlan.meals.map(meal => [
          meal.day || 'N/A',
          meal.breakfast || 'N/A',
          meal.lunch || 'N/A',
          meal.dinner || 'N/A',
          Array.isArray(meal.snacks) ? meal.snacks.join(', ') : 'N/A'
        ])
      : [];
    
    if (tableRows.length > 0) {
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [33, 150, 243] },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 },
          4: { cellWidth: 40 }
        }
      });
    } else {
      doc.setFontSize(12);
      doc.text('No meal plan found', 20, 50);
    }
    
    return doc;
  },
  
  downloadPDF: (doc, filename) => {
    if (!doc || !filename) {
      throw new Error('Missing required data for PDF download');
    }
    doc.save(filename);
  }
};

export default pdfService; 