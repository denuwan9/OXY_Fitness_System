import mongoose from'mongoose';

const membershipSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    unique: true,
    trim: true,
    index: true  // Added index here instead of separate index()
  },
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    index: true,  // Added index here instead of separate index()
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  package: {
    type: String,
    required: [true, 'Package type is required'],
    enum: {
      values: ['silver', 'gold', 'platinum'],
      message: 'Package must be either silver, gold, or platinum'
    }
  },
  price: {
    type: String,
    required: [true, 'Price is required']
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;  // Remove version key
      delete ret._id;  // Remove internal ID
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret._id;
      return ret;
    }
  }
});

// Removed duplicate index definitions since we added them in schema
// membershipSchema.index({ userId: 1 });  // No longer needed
// membershipSchema.index({ email: 1 });   // No longer needed

const Membership = mongoose.model('Membership', membershipSchema);

export default Membership;


