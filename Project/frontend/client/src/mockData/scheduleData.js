export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'member',
    membershipType: 'platinum',
    profileImage: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'member',
    membershipType: 'gold',
    profileImage: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'member',
    membershipType: 'silver',
    profileImage: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '4',
    name: 'Coach Sarah',
    email: 'sarah.coach@example.com',
    role: 'coach',
    profileImage: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: '5',
    name: 'Coach David',
    email: 'david.coach@example.com',
    role: 'coach',
    profileImage: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: '6',
    name: 'Manager Alex',
    email: 'alex.manager@example.com',
    role: 'operation_manager',
    profileImage: 'https://i.pravatar.cc/150?img=6'
  }
];

export const mockSchedules = [
  {
    id: '1',
    userId: '1',
    coachId: '4',
    membershipType: 'platinum',
    scheduleType: 'weekly',
    sessions: [
      {
        id: '1-1',
        type: 'personal_training',
        date: new Date(2024, 2, 20, 9, 0),
        duration: 60,
        status: 'scheduled',
        notes: 'Focus on strength training and form correction',
        location: 'Main Gym - Training Area 1'
      },
      {
        id: '1-2',
        type: 'group_class',
        date: new Date(2024, 2, 22, 10, 0),
        duration: 45,
        status: 'scheduled',
        notes: 'High-intensity interval training',
        location: 'Group Exercise Studio A'
      },
      {
        id: '1-3',
        type: 'personal_training',
        date: new Date(2024, 2, 24, 14, 0),
        duration: 60,
        status: 'scheduled',
        notes: 'Cardio and endurance training',
        location: 'Main Gym - Training Area 2'
      }
    ],
    mealPlan: {
      breakfast: 'Oatmeal with fruits and protein powder',
      lunch: 'Grilled chicken salad with quinoa',
      dinner: 'Salmon with vegetables and brown rice',
      snacks: ['Greek yogurt', 'Mixed nuts', 'Protein bar']
    }
  },
  {
    id: '2',
    userId: '2',
    coachId: '5',
    membershipType: 'gold',
    scheduleType: 'weekly',
    sessions: [
      {
        id: '2-1',
        type: 'group_class',
        date: new Date(2024, 2, 20, 8, 0),
        duration: 45,
        status: 'scheduled',
        notes: 'Yoga and flexibility',
        location: 'Yoga Studio'
      },
      {
        id: '2-2',
        type: 'personal_training',
        date: new Date(2024, 2, 23, 11, 0),
        duration: 45,
        status: 'scheduled',
        notes: 'Weight training and form check',
        location: 'Main Gym - Training Area 3'
      }
    ],
    mealPlan: {
      breakfast: 'Whole grain toast with eggs and avocado',
      lunch: 'Tuna salad with whole grain bread',
      dinner: 'Turkey stir-fry with vegetables',
      snacks: ['Apple', 'Protein shake', 'Rice cakes']
    }
  },
  {
    id: '3',
    userId: '3',
    coachId: '4',
    membershipType: 'silver',
    scheduleType: 'weekly',
    sessions: [
      {
        id: '3-1',
        type: 'group_class',
        date: new Date(2024, 2, 21, 16, 0),
        duration: 45,
        status: 'scheduled',
        notes: 'Zumba fitness',
        location: 'Group Exercise Studio B'
      },
      {
        id: '3-2',
        type: 'group_class',
        date: new Date(2024, 2, 24, 9, 0),
        duration: 45,
        status: 'scheduled',
        notes: 'Circuit training',
        location: 'Group Exercise Studio A'
      }
    ],
    mealPlan: {
      breakfast: 'Smoothie bowl with granola',
      lunch: 'Vegetable soup with whole grain bread',
      dinner: 'Grilled fish with sweet potato',
      snacks: ['Banana', 'Trail mix', 'Greek yogurt']
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

export const mockGymLocations = [
  { id: '1', name: 'Main Gym - Training Area 1', capacity: 20 },
  { id: '2', name: 'Main Gym - Training Area 2', capacity: 15 },
  { id: '3', name: 'Main Gym - Training Area 3', capacity: 15 },
  { id: '4', name: 'Group Exercise Studio A', capacity: 30 },
  { id: '5', name: 'Group Exercise Studio B', capacity: 25 },
  { id: '6', name: 'Yoga Studio', capacity: 20 }
];

export const mockWorkoutTypes = [
  { id: '1', name: 'Personal Training', duration: 60, maxParticipants: 1 },
  { id: '2', name: 'Group Class', duration: 45, maxParticipants: 30 },
  { id: '3', name: 'Yoga', duration: 45, maxParticipants: 20 },
  { id: '4', name: 'Zumba', duration: 45, maxParticipants: 25 },
  { id: '5', name: 'Circuit Training', duration: 45, maxParticipants: 20 },
  { id: '6', name: 'HIIT', duration: 45, maxParticipants: 15 }
]; 