import TestMark from '../model/TestMark.js';


export const addTestMarks = async (req, res) => {
  try {
    const { studentId, testName, subject, marksObtained, totalMarks, testDate } = req.body;
    
    const testMark = new TestMark({
      studentId,
      testName,
      subject,
      marksObtained,
      totalMarks,
      testDate: testDate || Date.now()
    });
    
    await testMark.save();
    
    res.status(201).json({
      success: true,
      message: 'Test marks added successfully',
      data: testMark
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding test marks',
      error: error.message
    });
  }
};

export const getStudentTestMarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const testMarks = await TestMark.find({ studentId })
      .sort({ testDate: -1 });
    
    res.status(200).json({
      success: true,
      data: testMarks
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching test marks',
      error: error.message
    });
  }
};


export const getTestAnalysis = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const testMarks = await TestMark.find({ studentId });
    

    const totalTests = testMarks.length;
    const averagePercentage = totalTests > 0 
      ? testMarks.reduce((sum, test) => sum + test.percentage, 0) / totalTests 
      : 0;
    

    const subjectAnalysis = {};
    testMarks.forEach(test => {
      if (!subjectAnalysis[test.subject]) {
        subjectAnalysis[test.subject] = [];
      }
      subjectAnalysis[test.subject].push(test);
    });
    

    const subjectAverages = {};
    Object.keys(subjectAnalysis).forEach(subject => {
      const tests = subjectAnalysis[subject];
      subjectAverages[subject] = tests.reduce((sum, test) => sum + test.percentage, 0) / tests.length;
    });
    

    const progressData = testMarks
      .sort((a, b) => new Date(a.testDate) - new Date(b.testDate))
      .map(test => ({
        date: test.testDate,
        percentage: test.percentage,
        testName: test.testName
      }));
    
    res.status(200).json({
      success: true,
      data: {
        overall: {
          totalTests,
          averagePercentage: Math.round(averagePercentage * 100) / 100,
          bestSubject: Object.keys(subjectAverages).reduce((best, subject) => 
            subjectAverages[subject] > (subjectAverages[best] || 0) ? subject : best, ''
          ),
          worstSubject: Object.keys(subjectAverages).reduce((worst, subject) => 
            subjectAverages[subject] < (subjectAverages[worst] || 100) ? subject : worst, ''
          )
        },
        subjectAverages,
        progressData,
        recentTests: testMarks.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error generating test analysis',
      error: error.message
    });
  }
};


export const updateTestMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTest = await TestMark.findByIdAndUpdate(id, req.body, { new: true });
    
    res.status(200).json({
      success: true,
      message: 'Test marks updated successfully',
      data: updatedTest
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating test marks',
      error: error.message
    });
  }
};


export const deleteTestMarks = async (req, res) => {
  try {
    const { id } = req.params;
    await TestMark.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Test marks deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error deleting test marks',
      error: error.message
    });
  }
};