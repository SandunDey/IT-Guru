import mongoose from 'mongoose';

const testMarkSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testName: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  marksObtained: {
    type: Number,
    required: true,
    min: 0
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 1
  },
  testDate: {
    type: Date,
    default: Date.now
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});


testMarkSchema.pre('save', function(next) {
  this.percentage = (this.marksObtained / this.totalMarks) * 100;
  

  if (this.percentage >= 90) this.grade = 'A+';
  else if (this.percentage >= 80) this.grade = 'A';
  else if (this.percentage >= 70) this.grade = 'B';
  else if (this.percentage >= 60) this.grade = 'C';
  else if (this.percentage >= 50) this.grade = 'D';
  else this.grade = 'F';
  
  next();
});

export default mongoose.model('TestMark', testMarkSchema);