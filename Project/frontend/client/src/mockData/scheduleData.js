export const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    role: "member",
    membershipType: "Platinum",
    email: "john@example.com"
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "member",
    membershipType: "Gold",
    email: "jane@example.com"
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "member",
    membershipType: "Silver",
    email: "mike@example.com"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    role: "instructor",
    email: "sarah@example.com"
  }
];

export const mockWorkoutTypes = [
  {
    id: 1,
    name: "Personal Training",
    type: "personal_training",
    description: "One-on-one training session with a personal trainer",
    duration: "60 minutes"
  },
  {
    id: 2,
    name: "Group Class",
    type: "group_class",
    description: "Group workout session with multiple participants",
    duration: "45 minutes"
  },
  {
    id: 3,
    name: "Cardio Session",
    type: "cardio",
    description: "Cardiovascular training session",
    duration: "30 minutes"
  },
  {
    id: 4,
    name: "Strength Training",
    type: "strength",
    description: "Weight training and strength building session",
    duration: "60 minutes"
  },
  {
    id: 5,
    name: "HIIT Training",
    type: "hiit",
    description: "High-intensity interval training",
    duration: "30 minutes"
  },
  {
    id: 6,
    name: "Yoga Session",
    type: "yoga",
    description: "Yoga and flexibility training",
    duration: "60 minutes"
  }
];

export const mockGymLocations = [
  {
    id: 1,
    name: "Main Branch",
    address: "123 Main St, City",
    capacity: 100
  },
  {
    id: 2,
    name: "Downtown Branch",
    address: "456 Downtown Ave, City",
    capacity: 75
  }
];

export const mockSchedules = [
  {
    id: 1,
    userId: 1,
    membershipType: "Platinum",
    sessions: [
      {
        id: 1,
        date: new Date(2024, 2, 20),
        time: "09:00",
        workoutType: "personal_training",
        duration: "60 minutes",
        location: "Main Gym Area",
        notes: "Focus on upper body strength",
        status: "scheduled"
      },
      {
        id: 2,
        date: new Date(2024, 2, 22),
        time: "10:00",
        workoutType: "group_class",
        duration: "45 minutes",
        location: "Studio Room 1",
        notes: "Group cardio session",
        status: "scheduled"
      }
    ],
    mealPlan: {
      breakfast: "Oatmeal with fruits and nuts",
      lunch: "Grilled chicken salad",
      dinner: "Salmon with vegetables",
      snacks: "Greek yogurt and mixed nuts"
    }
  },
  {
    id: 2,
    userId: 2,
    membershipType: "Gold",
    sessions: [
      {
        id: 3,
        date: new Date(2024, 2, 21),
        time: "14:00",
        workoutType: "hiit",
        duration: "30 minutes",
        location: "HIIT Zone",
        notes: "HIIT cardio session",
        status: "scheduled"
      }
    ],
    mealPlan: {
      breakfast: "Protein smoothie bowl",
      lunch: "Tuna wrap with vegetables",
      dinner: "Lean beef with sweet potato",
      snacks: "Protein bars and fruits"
    }
  },
  {
    id: 3,
    userId: 3,
    membershipType: "Silver",
    sessions: [
      {
        id: 4,
        date: new Date(2024, 2, 23),
        time: "16:00",
        workoutType: "strength",
        duration: "60 minutes",
        location: "Weight Room",
        notes: "Full body strength training",
        status: "scheduled"
      }
    ],
    mealPlan: {
      breakfast: "Whole grain toast with eggs",
      lunch: "Quinoa bowl with vegetables",
      dinner: "Grilled fish with rice",
      snacks: "Mixed nuts and fruits"
    }
  }
];

export const mockChangeRequests = [
  {
    id: '1',
    userId: '1',
    coachId: '4',
    sessionId: '1-1',
    currentDate: new Date(2024, 2, 20, 9, 0),
    requestedDate: new Date(2024, 2, 21, 9, 0),
    reason: 'Work meeting conflict',
    status: 'pending',
    createdAt: new Date(2024, 2, 19, 14, 30)
  },
  {
    id: '2',
    userId: '2',
    coachId: '5',
    sessionId: '2-2',
    currentDate: new Date(2024, 2, 23, 11, 0),
    requestedDate: new Date(2024, 2, 24, 11, 0),
    reason: 'Doctor appointment',
    status: 'approved',
    createdAt: new Date(2024, 2, 18, 16, 45)
  }
]; 