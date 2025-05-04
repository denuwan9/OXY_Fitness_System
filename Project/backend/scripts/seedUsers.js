import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = 'mongodb+srv://yenubowangby:VwVSKq5ntuJsMFRj@cluster0.3tjan.mongodb.net/OXY_FITNESS';

const users = [
    {
        name: "Admin User",
        email: "admin@oxyfitness.com",
        password: "Admin@123",
        role: "admin",
        phone: "+94771234567",
        address: {
            street: "123 Admin Street",
            city: "Colombo",
            state: "Western Province",
            zipCode: "10100",
            country: "Sri Lanka"
        },
        membershipType: "vip",
        membershipStartDate: new Date("2024-03-14"),
        membershipEndDate: new Date("2025-03-14"),
        profileImage: "admin-profile.jpg",
        isActive: true
    },
    {
        name: "Manager User",
        email: "manager@oxyfitness.com",
        password: "Manager@123",
        role: "manager",
        phone: "+94772345678",
        address: {
            street: "456 Manager Avenue",
            city: "Colombo",
            state: "Western Province",
            zipCode: "10200",
            country: "Sri Lanka"
        },
        membershipType: "premium",
        membershipStartDate: new Date("2024-03-14"),
        membershipEndDate: new Date("2025-03-14"),
        profileImage: "manager-profile.jpg",
        isActive: true
    },
    {
        name: "Trainer User",
        email: "trainer@oxyfitness.com",
        password: "Trainer@123",
        role: "trainer",
        phone: "+94773456789",
        address: {
            street: "789 Fitness Street",
            city: "Colombo",
            state: "Western Province",
            zipCode: "10300",
            country: "Sri Lanka"
        },
        membershipType: "premium",
        membershipStartDate: new Date("2024-03-14"),
        membershipEndDate: new Date("2025-03-14"),
        profileImage: "trainer-profile.jpg",
        isActive: true
    },
    {
        name: "Regular User",
        email: "user@oxyfitness.com",
        password: "User@123",
        role: "user",
        phone: "+94774567890",
        address: {
            street: "101 Member Lane",
            city: "Colombo",
            state: "Western Province",
            zipCode: "10400",
            country: "Sri Lanka"
        },
        membershipType: "basic",
        membershipStartDate: new Date("2024-03-14"),
        membershipEndDate: new Date("2024-09-14"),
        profileImage: "user-profile.jpg",
        isActive: true
    },
    {
        name: "Supplier User",
        email: "supplier@oxyfitness.com",
        password: "Supplier@123",
        role: "supplier",
        phone: "+94775678901",
        address: {
            street: "202 Supply Road",
            city: "Colombo",
            state: "Western Province",
            zipCode: "10500",
            country: "Sri Lanka"
        },
        membershipType: "basic",
        membershipStartDate: new Date("2024-03-14"),
        membershipEndDate: new Date("2025-03-14"),
        profileImage: "supplier-profile.jpg",
        isActive: true
    }
];

async function seedUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing users
        await User.deleteMany({});
        console.log('Deleted existing users');

        // Hash passwords and create users
        for (const userData of users) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({
                ...userData,
                password: hashedPassword
            });
            await user.save();
            console.log(`Created user: ${userData.email}`);
        }

        console.log('All users created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
}

// Run the seed function
seedUsers();