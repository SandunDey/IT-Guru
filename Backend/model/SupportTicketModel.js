import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema(
  {
    // -- අලුතින් එකතු වූ Fields --
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      trim: true,
      lowercase: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required.'],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required.'],
      trim: true,
    },
    courseOrExamYear: {
      type: String,
      required: [true, 'Course or Exam Year is required.'],
    },
    subject: { // This replaces 'title'
      type: String,
      required: [true, 'Subject is required.'],
      trim: true,
    },
    message: { // This replaces 'description'
      type: String,
      required: [true, 'Message is required.'],
    },
    attachments: [
        { 
            fileName: String, 
            filePath: String 
        }
    ], // For file uploads

    referenceCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    // Track who created the ticket for security
    createdBy: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // --- පවතින Fields ---
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium', // Student ට මේක select කරන්න බෑ, ඒත් default එකක් තියෙනවා
    },

    // --- නව replies field එකතු කිරීම ---
    replies: [
      {
        text: {
          type: String,
          required: true
        },
        repliedBy: {
          type: String,
          required: true
        },
        repliedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries by user email
supportTicketSchema.index({ email: 1, createdAt: -1 });
supportTicketSchema.index({ createdBy: 1, createdAt: -1 });

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

export default SupportTicket;