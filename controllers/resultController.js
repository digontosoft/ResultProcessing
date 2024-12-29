const Result = require("../models/resultModel");
const Student = require("../models/studentModel");
const asyncHandler = require("express-async-handler");

const createResult = asyncHandler(async (req, res) => {
  const { session, term, className, section, shift, subjectName, results } =
    req.body;
  const insertablePayload = [];
  for (const result of results) {
    const { studentId, subjective, objective, classAssignment, practical } =
      result;
    const payload = {
      studentId,
      session,
      term,
      className,
      section,
      shift,
      subjectName,
      subjective,
      objective,
      classAssignment,
      practical,
    };
    insertablePayload.push(payload);
  }
  try {
    const result = await Result.create(insertablePayload);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getAllResultData = asyncHandler(async (req, res) => {
  try {
    const allResult = await Result.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "studentId", 
          foreignField: "studentId",
          as: "studentInfo"
        }
      },
      {
        $unwind: "$studentInfo"
      },
      {
        $project: {
          studentId: 1,
          session: 1,
          term: 1,
          className: 1,
          section: 1,
          shift: 1,
          subjectName: 1,
          subjective: 1,
          objective: 1,
          classAssignment: 1,
          practical: 1,
          totalMarks: 1,
          grade: 1,
          remarks: 1,
          roll: "$studentInfo.roll",
          studentName: "$studentInfo.studentName"
        }
      }
    ]);
    res.json({
      message: "successfully get all result",
      data: allResult,
    });
  } catch (error) {
    console.log("error ", error);
    res.status(404).json({ message: "Result not found" });
  }
});
//update a single result
const updateResult = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    // console.log("payload", payload);
    const updatedResult = await Result.findByIdAndUpdate(id, payload);
    res
      .status(200)
      .json({ message: "Result updated successfully", data: updatedResult });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//delete a single result
const deleteResult = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedResult = await Result.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Result deleted successfully", data: deletedResult });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const bulkUploadResults = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const XLSX = require("xlsx");
    const workbook = XLSX.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const results = [];
    for (const row of data) {
      const result = await Result.create({
        studentId: row.studentId,
        // studentName: row['Student Name'],
        subjective: row.CQ,
        objective: row.MCQ,
        classAssignment: row.CA,
        practical: row.PRAC,
        // Include other required fields from your Result model
        // You might need to add these as default values or from request body
        session: req.body.session,
        term: req.body.term,
        className: req.body.className,
        section: req.body.section,
        shift: req.body.shift,
        subjectName: req.body.subjectName,
      });
      results.push(result);
    }

    // Optional: Remove the temporary file
    const fs = require("fs");
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Results uploaded successfully",
      count: results.length,
      results,
    });
  } catch (error) {
    // If file exists, remove it in case of error
    if (req.file) {
      const fs = require("fs");
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

const calculateResultSummary = async (
  TotalResult,
  className,
  section,
  shift
) => {
  // Calculate total marks and obtained marks
  let totalMarks = 0;
  let obtainedMarks = 0;
  let subjectCount ={}

  for (const result of TotalResult) {
    if(subjectCount[result.subject]){
      subjectCount[result.subject]++;
    }else{
      subjectCount[result.subject] = 1;
      totalMarks += result.fullMarks;
      obtainedMarks += result.totalMarks;
    }
  }
  let query = {}
  if(shift !== "All") query.shift = shift;
  if(section !== "All") query.section = section;
  // Get total students count in the class
  const studentsCount = await Student.countDocuments({
    class: className,
    ...query
  });

  // Calculate GPA (assuming 4th subject is Higher Math)
  const mainSubjects = TotalResult.filter(
    (result) => result.subject !== "Highermath"
  );

  // Calculate GPA without 4th subject
  const hasFailingGrade = mainSubjects.some(result => result.GP === 0);
  const gpaWithout4th = hasFailingGrade ? "0.00" : (
    mainSubjects.reduce((sum, result) => sum + result.GP, 0) / 
    mainSubjects.length
  ).toFixed(2);

  // Calculate GPA with 4th subject (if it improves the result)
  const higherMathResult = TotalResult.find(
    (result) => result.subject === "Highermath"
  );
  const gpa = hasFailingGrade ? "0.00" : (
    higherMathResult && higherMathResult.GP > gpaWithout4th
      ? (
          (mainSubjects.reduce((sum, result) => sum + result.GP, 0) +
            higherMathResult.GP) /
          (mainSubjects.length + 1)
        ).toFixed(2)
      : gpaWithout4th
  );

  return {
    totalMarks,
    obtainedMarks,
    studentsCount,
    gpaWithout4th: parseFloat(gpaWithout4th),
    gpa: parseFloat(gpa),
    remark: getRemark(parseFloat(gpa)),
  };
};

const getRemark = (gpa) => {
  if (gpa >= 4.5) return "Excellent";
  if (gpa >= 4.0) return "Very Good";
  if (gpa >= 3.5) return "Good";
  if (gpa >= 3.0) return "Fair";
  return "Need Improvement";
};

const getIndividualResult = asyncHandler(async (req, res) => {
  try {
    const { session, term, className, section, shift, studentId } = req.body;
    const SubjectWiseHighestMarks = await GetSubjectWiseHighestMarks(
      session,
      term,
      className,
      section,
      shift
    );
    // console.log("SubjectWiseHighestMarks", SubjectWiseHighestMarks);
    const results = await Result.find({
      session,
      term,
      className,
      section,
      shift,
      studentId,
    });
    const studentInfo = await Student.findOne({
      studentId,
      class: className,
      section,
      shift,
    });
    //subject vs full marks hash data
    const subjectVsFullMarks = {
      Bangla:100,
        English:100,
        Mathematics:100,
        Science:100,
        "Bangladesh and Global Studies":100,
        "Islam and Moral Education":100,
        "Hindu and Moral Education":100,
        "Christian and Moral Education":100,
        "Digital technology":100,
        "Life and livelihood":100,
        "Art and culture":100,
        "Well being":100,
        "History and social science":100,
      
    };
    const resultGrading = {
      "A+": 5.0,
      A: 4.0,
      "A-": 3.5,
      B: 3.0,
      C: 2.0,
      D: 1.0,
      F: 0.0,
    };
    let TotalResult;
    //there is 3 type of reuslt class 4 to 5, class 6 to 8 and class 9
    if (className >= 4 && className <= 5) {
      // console.log("class 4 to 5");
      TotalResult = ResultForClass4To5(
        results,
        resultGrading,
        subjectVsFullMarks,
        SubjectWiseHighestMarks
      );
      //here will be logic
    } else if (className >= 6 && className <= 9) {
      TotalResult = ResultForClass9AndAbove(
        results,
        resultGrading,
        subjectVsFullMarks,
        SubjectWiseHighestMarks
      );
      //here will be logic
    } else if (className == 10) {
      TotalResult = ResultForClass9AndAbove(
        results,
        resultGrading,
        subjectVsFullMarks,
        SubjectWiseHighestMarks
      );
      //here will be logic
    }

    // Get all students' results from the same class, section, and shift
    const allStudentsResults = await Result.find({
      session,
      term,
      className,
      section,
      shift,
    });

    // Group results by student and calculate their total results
    const studentsMap = new Map();
    for (const result of allStudentsResults) {
      if (!studentsMap.has(result.studentId)) {
        const studentResults = allStudentsResults.filter(
          (r) => r.studentId === result.studentId
        );
        const studentTotalResult = className >= 4 && className <= 5
          ? ResultForClass4To5(studentResults, resultGrading, subjectVsFullMarks, SubjectWiseHighestMarks)
          : ResultForClass9AndAbove(studentResults, resultGrading, subjectVsFullMarks, SubjectWiseHighestMarks);
        
        studentsMap.set(result.studentId, {
          gpa: studentTotalResult.gpa,
          totalMarks: studentTotalResult.totalMarks,
        });
      }
    }

    // Convert map to array and sort by GPA and total marks
    const sortedResults = Array.from(studentsMap.entries())
      .sort((a, b) => {
        if (b[1].gpa !== a[1].gpa) {
          return b[1].gpa - a[1].gpa;
        }
        return b[1].totalMarks - a[1].totalMarks;
      });

    // Find position of current student
    const meritPosition = sortedResults.findIndex(([id]) => id === studentId) + 1;

    // Calculate summary using the new function
    const summary = await calculateResultSummary(
      TotalResult,
      className,
      section,
      shift
    );

    res.status(200).json({
      Message: "Result fetched successfully",
      Data: {
        studentInfo,
        TotalResult,
        summary,
        meritPosition,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getTebulationSheet = asyncHandler(async (req, res) => {
  try {
    const { session, term, className, section, shift, group } = req.body;
    const TebulationSheet = [];
    let query = {}
    if(shift !== "All") query.shift = shift;
    if(section !== "All") query.section = section;
    const students = await Student.find({
      class: className,
      ...query,
      group,
    });
    const SubjectWiseHighestMarks = await GetSubjectWiseHighestMarks(
      session,
      term,
      className,
      section,
      shift
    );
    const SubjectWiseHighestMarksAbove5 = await GetSubjectWiseHighestMarksAbove5(
      session,
      term,
      className,
      section,
      shift
    );
    for (const student of students) {
      const results = await Result.find({
        session,
        term,
        className,
        ...query,
        studentId: student.studentId,
      });
      //subject vs full marks hash data
      const subjectVsFullMarks = {
        Mathmetics:100, 
        Bangla:100,
        English:100,
        Mathematics:100,
        Science:100,
        "Bangladesh and Global Studies":100,
        "Islam and Moral Education":100,
        "Hindu and Moral Education":100,
        "Christian and Moral Education":100,
        "Digital technology":100,
        "Life and livelihood":100,
        "Art and culture":100,
        "Well being":100,
        "History and social science":100,
      };
      const resultGrading = {
        "A+": 5.0,
        A: 4.0,
        "A-": 3.5,
        B: 3.0,
        C: 2.0,
        D: 1.0,
        F: 0.0,
      };
      let TotalResult;
      //there is 3 type of reuslt class 4 to 5, class 6 to 8 and class 9
      if (className >= 4 && className <= 5) {
        TotalResult = ResultForClass4To5(
          results,
          resultGrading,
          subjectVsFullMarks,
          SubjectWiseHighestMarks
        );
        //here will be logic
      } else if (className >= 6 && className <= 8) {
        TotalResult = ResultForClass6to8(
          results,
          resultGrading,
          subjectVsFullMarks,
          SubjectWiseHighestMarksAbove5
        );
        //here will be logic
      } else if (className == 9) {
        TotalResult = ResultForClass9AndAbove(
          results,
          resultGrading,
          subjectVsFullMarks,
          SubjectWiseHighestMarksAbove5
        );
        //here will be logic
      }
      // Calculate summary using the new function
      const summary = await calculateResultSummary(
        TotalResult,
        className,
        section,
        shift
      );
      TebulationSheet.push({
        studentInfo:student,
        TotalResult,
        summary,
      });
    }
    // After calculating results for all students, sort by GPA and total marks
    TebulationSheet.sort((a, b) => {
      // First compare by GPA
      if (b.summary.gpa !== a.summary.gpa) {
        return b.summary.gpa - a.summary.gpa;
      }
      // If GPAs are equal, compare by total obtained marks
      return b.summary.obtainedMarks - a.summary.obtainedMarks;
    });

    // Add merit position to each student's data
    TebulationSheet.forEach((result, index) => {
      result.meritPosition = index + 1;
    });
    //sort by roll
    TebulationSheet.sort((a, b) => a.studentInfo.roll - b.studentInfo.roll);
    res.status(200).json({
      Message: "Tebulation sheet fetched successfully",
      Data: TebulationSheet,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});
const getMarksheet = asyncHandler(async (req, res) => {
  try {
    const startTime = performance.now();
    // console.log("req.body", req.body);
    const {
      session,
      term,
      className,
      section,
      shift,
      start_roll,
      end_roll,
      is_merged,
      group,
    } = req.body;
    const TebulationSheet = [];
    const students = await Student.find({
      class: className,
      section,
      shift,
      year: session,
      group: group,
      roll: { $gte: start_roll, $lte: end_roll },
    }).sort({ roll: 1 });
    // console.log("students", students);
    for (const student of students) {
      const results = await Result.find({
        session,
        term,
        className,
        section,
        shift,
        studentId: student.studentId,
      });
      //subject vs full marks hash data
      const subjectVsFullMarks = {
        Mathmetics:100, 
        Bangla:100,
        English:100,
        Mathematics:100,
        Science:100,
        "Bangladesh and Global Studies":100,
        "Islam and Moral Education":100,
        "Hindu and Moral Education":100,
        "Christian and Moral Education":100,
        "Digital technology":100,
        "Life and livelihood":100,
        "Art and culture":100,
        "Well being":100,
        "History and social science":100,
       
      };
      const resultGrading = {
        "A+": 5.0,
        A: 4.0,
        "A-": 3.5,
        B: 3.0,
        C: 2.0,
        D: 1.0,
        F: 0.0,
      };
      if (is_merged) {
        // console.log("is_merged");
        // Get both half yearly and annual results
        const halfYearlyResults = await Result.find({
          session,
          term: "Half Yearly",
          className,
          section,
          shift,
          studentId: student.studentId,
        });
        // console.log("halfYearlyResults", halfYearlyResults);
        const annualResults = await Result.find({
          session,
          term: "Annual",
          className,
          section,
          shift,
          studentId: student.studentId,
        });
        //subjectWiseHighestMarks
        const halfYearlySubjectWiseHighestMarks =
          await GetSubjectWiseHighestMarksAbove5(
            session,
            "Half Yearly",
            className,
            section,
            shift
          );
        const annualSubjectWiseHighestMarks =
          await GetSubjectWiseHighestMarksAbove5(
            session,
            "Annual",
            className,
            section,
            shift
          );
        let halfYearlyProcessed;
        let annualProcessed;
        let TotalResult;
        if (className >= 4 && className <= 5) {
          halfYearlyProcessed = ResultForClass4To5(
            halfYearlyResults,
            resultGrading,
            subjectVsFullMarks
          );
          annualProcessed = ResultForClass4To5(
            annualResults,
            resultGrading,
            subjectVsFullMarks
          );
          TotalResult = calculateFinalMergedResult(
            halfYearlyProcessed,
            annualProcessed
          );
        } else if (className >= 6 && className <= 8) {
          halfYearlyProcessed = ResultForClass6to8(
            halfYearlyResults,
            resultGrading,
            subjectVsFullMarks
          );
          annualProcessed = ResultForClass6to8(
            annualResults,
            resultGrading,
            subjectVsFullMarks
          );
          TotalResult = calculateFinalMergedResult(
            halfYearlyProcessed,
            annualProcessed
          );
        } else if (className >= 9) {
          // console.log("class 9");
          halfYearlyProcessed = ResultForClass9AndAbove(
            halfYearlyResults,
            resultGrading,
            subjectVsFullMarks,
            halfYearlySubjectWiseHighestMarks
          );
          // console.log("halfYearlyProcessed", halfYearlyProcessed);
          annualProcessed = ResultForClass9AndAbove(
            annualResults,
            resultGrading,
            subjectVsFullMarks,
            annualSubjectWiseHighestMarks
          );
          // console.log("annualProcessed", annualProcessed);
          TotalResult = calculateFinalMergedResult(
            halfYearlyProcessed,
            annualProcessed,
            resultGrading
          );
          // console.log("TotalResult", TotalResult);
        }

        // Calculate summary using the new function
        const summary = await calculateResultSummary(
          TotalResult,
          className,
          section,
          shift
        );

        TebulationSheet.push({
          studentInfo: student,
          halfYearlyResults: halfYearlyProcessed,
          annualResults: annualProcessed,
          TotalResult,
          summary,
        });
      } else {
        let TotalResult;
        const subjectWiseHighestMarks = await GetSubjectWiseHighestMarks(
          session,
          term,
          className,
          section,
          shift
        );
        const subjectWiseHighestMarksAbove5 = await GetSubjectWiseHighestMarksAbove5(
          session,
          term,
          className,
          section,
          shift
        );
        //there is 3 type of reuslt class 4 to 5, class 6 to 8 and class 9
        if (className >= 4 && className <= 5) {
          // console.log("class 4 to 5");
          TotalResult = ResultForClass4To5(
            results,
            resultGrading,
            subjectVsFullMarks,
            subjectWiseHighestMarks
          );
          //here will be logic
        } else if (className >= 6 && className <= 8) {
          TotalResult = ResultForClass6to8(
            results,
            resultGrading,
            subjectVsFullMarks,
            subjectWiseHighestMarksAbove5
          );
          //here will be logic
        } else if (className == 9) {
          TotalResult = ResultForClass9AndAbove(
            results,
            resultGrading,
            subjectVsFullMarks,
            subjectWiseHighestMarksAbove5
          );
          //here will be logic
        }
        // Calculate summary using the new function
        const summary = await calculateResultSummary(
          TotalResult,
          className,
          section,
          shift
        );
        TebulationSheet.push({
          studentInfo: student,
          TotalResult,
          summary,
        });
      }
    }
        // After calculating results for all students, sort by GPA and total marks
        TebulationSheet.sort((a, b) => {
          // First compare by GPA
          if (b.summary.gpa !== a.summary.gpa) {
            return b.summary.gpa - a.summary.gpa;
          }
          // If GPAs are equal, compare by total obtained marks
          return b.summary.obtainedMarks - a.summary.obtainedMarks;
        });
    
        // Add merit position to each student's data
        TebulationSheet.forEach((result, index) => {
          result.meritPosition = index + 1;
        });
        //sort by roll
        TebulationSheet.sort((a, b) => a.studentInfo.roll - b.studentInfo.roll);
        const endTime = performance.now();
        const executionTime = (endTime - startTime) / 1000; // Convert to seconds
    
    res.status(200).json({
      Message: "Tebulation sheet fetched successfully",
      Data: TebulationSheet,
      executionTime: `${executionTime.toFixed(2)} seconds`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const getMarksheetNewfunction = asyncHandler(async (req, res) => {
  // Start timing
  const startTime = performance.now();

  try {
    const {
      session,
      term,
      className,
      section,
      shift,
      start_roll,
      end_roll,
      is_merged,
      group,
    } = req.body;
    let query = {}
    if(shift !== "All") query.shift = shift;
    if(section !== "All") query.section = section;
    // Get all students first
    const students = await Student.find({
      class: className,
      ...query,
      year: session,
      group: group,
      roll: { $gte: start_roll, $lte: end_roll },
    }).sort({ roll: 1 });
    console.log("students", students.length);
    // Process students in batches of 20
    const BATCH_SIZE = 20;
    const batches = [];
    
    for (let i = 0; i < students.length; i += BATCH_SIZE) {
      batches.push(students.slice(i, i + BATCH_SIZE));
    }

    // Process each batch in parallel
    const batchResults = await Promise.all(
      batches.map(async (studentBatch) => {
        return Promise.all(
          studentBatch.map(async (student) => {
            // Constants moved outside the loop
            const subjectVsFullMarks = {
              Mathmetics: 100,
              Bangla: 100,
              English:100,
              Mathematics:100,
              Science:100,
              "Bangladesh and Global Studies":100,
              "Islam and Moral Education":100,
              "Hindu and Moral Education":100,
              "Christian and Moral Education":100,
              "Digital technology":100,
              "Life and livelihood":100,
              "Art and culture":100,
              "Well being":100,
              "History and social science":100,
              // ... rest of the subjects
            };
            
            const resultGrading = {
              "A+": 5.0,
              A: 4.0,
              "A-": 3.5,
              B: 3.0,
              C: 2.0,
              D: 1.0,
              F: 0.0,
            };

            if (is_merged) {
              // Parallel fetch of half yearly and annual results
              const [halfYearlyResults, annualResults, halfYearlyHighestMarks, annualHighestMarks] = 
                await Promise.all([
                  Result.find({
                    session,
                    term: "Half Yearly",
                    className,
                    ...query,
                    studentId: student.studentId,
                  }),
                  Result.find({
                    session,
                    term: "Annual",
                    className,
                    ...query,
                    studentId: student.studentId,
                  }),
                  GetSubjectWiseHighestMarksAbove5(
                    session,
                    "Half Yearly",
                    className,
                    section,
                    shift
                  ),
                  GetSubjectWiseHighestMarksAbove5(
                    session,
                    "Annual",
                    className,
                    section,
                    shift
                  )
                ]);

              let halfYearlyProcessed, annualProcessed, TotalResult;

              // Process based on class level
              if (className >= 4 && className <= 5) {
                [halfYearlyProcessed, annualProcessed] = await Promise.all([
                  ResultForClass4To5(halfYearlyResults, resultGrading, subjectVsFullMarks),
                  ResultForClass4To5(annualResults, resultGrading, subjectVsFullMarks)
                ]);
              } else if (className >= 6 && className <= 8) {
                [halfYearlyProcessed, annualProcessed] = await Promise.all([
                  ResultForClass6to8(halfYearlyResults, resultGrading, subjectVsFullMarks),
                  ResultForClass6to8(annualResults, resultGrading, subjectVsFullMarks)
                ]);
              } else if (className >= 9) {
                [halfYearlyProcessed, annualProcessed] = await Promise.all([
                  ResultForClass9AndAbove(halfYearlyResults, resultGrading, subjectVsFullMarks, halfYearlyHighestMarks),
                  ResultForClass9AndAbove(annualResults, resultGrading, subjectVsFullMarks, annualHighestMarks)
                ]);
              }

              TotalResult = calculateFinalMergedResult(
                halfYearlyProcessed,
                annualProcessed,
                resultGrading
              );

              const summary = await calculateResultSummary(
                TotalResult,
                className,
                section,
                shift
              );

              return {
                studentInfo: student,
                halfYearlyResults: halfYearlyProcessed,
                annualResults: annualProcessed,
                TotalResult,
                summary,
              };
            } else {
              // Non-merged results processing
              const [results, highestMarks, highestMarksAbove5] = await Promise.all([
                Result.find({
                  session,
                  term,
                  className,
                  ...query,
                  studentId: student.studentId,
                }),
                GetSubjectWiseHighestMarks(session, term, className, section, shift),
                GetSubjectWiseHighestMarksAbove5(session, term, className, section, shift)
              ]);

              let TotalResult;
              if (className >= 4 && className <= 5) {
                TotalResult = ResultForClass4To5(results, resultGrading, subjectVsFullMarks, highestMarks);
              } else if (className >= 6 && className <= 8) {
                TotalResult = ResultForClass6to8(results, resultGrading, subjectVsFullMarks, highestMarksAbove5);
              } else if (className == 9) {
                TotalResult = ResultForClass9AndAbove(results, resultGrading, subjectVsFullMarks, highestMarksAbove5);
              }

              const summary = await calculateResultSummary(TotalResult, className, section, shift);
              
              return {
                studentInfo: student,
                TotalResult,
                summary,
              };
            }
          })
        );
      })
    );

    // Flatten batch results into single array
    let TebulationSheet = batchResults.flat();

    // Sort and add merit positions
    TebulationSheet.sort((a, b) => {
      if (b.summary.gpa !== a.summary.gpa) return b.summary.gpa - a.summary.gpa;
      return b.summary.obtainedMarks - a.summary.obtainedMarks;
    });

    TebulationSheet.forEach((result, index) => {
      result.meritPosition = index + 1;
    });

    TebulationSheet.sort((a, b) => a.studentInfo.roll - b.studentInfo.roll);

    // Calculate execution time before sending response
    const endTime = performance.now();
    const executionTime = (endTime - startTime) / 1000; // Convert to seconds

    res.status(200).json({
      Message: "Tabulation sheet fetched successfully",
      Data: TebulationSheet,
      executionTime: `${executionTime.toFixed(2)} seconds`
    });
  } catch (error) {
    const endTime = performance.now();
    const executionTime = (endTime - startTime) / 1000;

    res.status(500).json({ 
      message: error.message,
      executionTime: `${executionTime.toFixed(2)} seconds`
    });
  }
});
function calculateGrade(totalMarks) {
  if (totalMarks >= 80) return "A+";
  if (totalMarks >= 70) return "A";
  if (totalMarks >= 60) return "A-";
  if (totalMarks >= 50) return "B";
  if (totalMarks >= 40) return "C";
  if (totalMarks >= 33) return "D";
  return "F";
}
function ResultForClass4To5(
  results,
  resultGrading,
  subjectVsFullMarks,
  SubjectWiseHighestMarks
) {
  const TotalResult = [];
  //for class 4 and 5 there is no CA and marks is always 100%

  for (const result of results) {
    const { subjectName, subjective, objective, practical } = result;
    const totalMarks = (subjective ?? 0) + (objective ?? 0) + (practical ?? 0);
    const subjectWiseResult = {
      subject: subjectName,
      fullMarks: subjectVsFullMarks[subjectName],
      subjective: subjective ?? 0,
      objective: objective ?? 0,
      practical: practical ?? 0,
      totalMarks:
        Math.abs(totalMarks % 1) >= 0.05
          ? Math.round(totalMarks)
          : Math.floor(totalMarks),
      grade: calculateGrade(
        Math.abs(totalMarks % 1) >= 0.05
          ? Math.round(totalMarks)
          : Math.floor(totalMarks)
      ),
      GP: resultGrading[
        calculateGrade(
          Math.abs(totalMarks % 1) >= 0.05
            ? Math.round(totalMarks)
            : Math.floor(totalMarks)
        )
      ],
      Highest: SubjectWiseHighestMarks?.[subjectName] ?? 0,
    };
    TotalResult.push(subjectWiseResult);
  }
  return TotalResult;
}
function ResultForClass9AndAbove(
  results,
  resultGrading,
  subjectVsFullMarks,
  SubjectWiseHighestMarks
) {
  const TotalResult = [];
   // Normalize the keys in subjectVsFullMarks
   const normalizedSubjectMarks = Object.fromEntries(
    Object.entries(subjectVsFullMarks).map(([key, value]) => [
      key.trim().replace(/\s+/g, ' '),
      value
    ])
  );
  for (const result of results) {
    const { subjectName, subjective, objective, classAssignment, practical } = result;
    
    // Check failing conditions first
    const isFailedDueToSubjective = (subjective ?? 0) < 33;
    const isFailedDueToCA = (classAssignment ?? 0) < 10;
    const isFailed = isFailedDueToSubjective || isFailedDueToCA;
    const normalizedSubjectName = subjectName.trim().replace(/\s+/g, ' ');
    const fullMarks = normalizedSubjectMarks[normalizedSubjectName];
    const rawMarks70 = Math.abs(
      (((subjective ?? 0) + (objective ?? 0) + (practical ?? 0)) * 0.7) % 1
    ) >= 0.05
      ? Math.round(((subjective ?? 0) + (objective ?? 0) + (practical ?? 0)) * 0.7)
      : Math.floor(((subjective ?? 0) + (objective ?? 0) + (practical ?? 0)) * 0.7);
    
    const totalRawMarks = rawMarks70 + (classAssignment ?? 18);

    const subjectWiseResult = {
      subject: subjectName,
      fullMarks: fullMarks,
      subjective: subjective ?? 0,
      objective: objective ?? 0,
      practical: practical ?? 0,
      "70%": rawMarks70,
      "CA(30%)": classAssignment ?? 18,
      totalMarks:
        Math.abs(totalRawMarks % 1) >= 0.05
          ? Math.round(totalRawMarks)
          : Math.floor(totalRawMarks),
      grade: isFailed ? "F" : calculateGrade(
        Math.abs(totalRawMarks % 1) >= 0.05
          ? Math.round(totalRawMarks)
          : Math.floor(totalRawMarks)
      ),
      GP: isFailed ? 0 : resultGrading[
        calculateGrade(
          Math.abs(totalRawMarks % 1) >= 0.05
            ? Math.round(totalRawMarks)
            : Math.floor(totalRawMarks)
        )
      ],
      Highest: SubjectWiseHighestMarks?.[subjectName] ?? 0,
    };
    TotalResult.push(subjectWiseResult);
  }
  return TotalResult;
}
function ResultForClass6to8(
  results,
  resultGrading,
  subjectVsFullMarks,
  SubjectWiseHighestMarks
) {
  const TotalResult = [];
  
  // Normalize the keys in subjectVsFullMarks
  const normalizedSubjectMarks = Object.fromEntries(
    Object.entries(subjectVsFullMarks).map(([key, value]) => [
      key.trim().replace(/\s+/g, ' '),
      value
    ])
  );

  for (const result of results) {
    const { subjectName, subjective, objective, classAssignment, practical } = result;
    
    // Normalize the incoming subject name
    const normalizedSubjectName = subjectName.trim().replace(/\s+/g, ' ');
    
    // Use normalized strings for comparison
    const fullMarks = normalizedSubjectMarks[normalizedSubjectName];

    // Check failing conditions first
    const isFailedDueToSubjective = (subjective ?? 0) < 33;
    const isFailedDueToCA = (classAssignment ?? 0) < 10;
    const isFailed = isFailedDueToSubjective || isFailedDueToCA;

    const rawMarks70 = Math.abs(
      (((subjective ?? 0) + (objective ?? 0) + (practical ?? 0)) * 0.7) % 1
    ) >= 0.05
      ? Math.round(((subjective ?? 0) + (objective ?? 0) + (practical ?? 0)) * 0.7)
      : Math.floor(((subjective ?? 0) + (objective ?? 0) + (practical ?? 0)) * 0.7);
    
    const totalRawMarks = rawMarks70 + (classAssignment ?? 18);
     const subjectWiseResult = {
      subject: subjectName,
      fullMarks: fullMarks,
      subjective: subjective ?? 0,
      objective: objective ?? 0,
      practical: practical ?? 0,
      "70%":
        Math.abs(rawMarks70 % 1) >= 0.05
          ? Math.round(rawMarks70)
          : Math.floor(rawMarks70),
      "CA(30%)": classAssignment ?? 18,
      totalMarks:
        Math.abs(totalRawMarks % 1) >= 0.05
          ? Math.round(totalRawMarks)
          : Math.floor(totalRawMarks),
      grade: isFailed ? "F" : calculateGrade(
        Math.abs(totalRawMarks % 1) >= 0.05
          ? Math.round(totalRawMarks)
          : Math.floor(totalRawMarks)
      ),
      GP: isFailed ? 0 : resultGrading[
        calculateGrade(
          Math.abs(totalRawMarks % 1) >= 0.05
            ? Math.round(totalRawMarks)
            : Math.floor(totalRawMarks)
        )
      ],
      Highest: SubjectWiseHighestMarks?.[subjectName] ?? 0,
    };
    TotalResult.push(subjectWiseResult);
  }
  return TotalResult;
}
async function GetSubjectWiseHighestMarks(
  session,
  term,
  className,
  section,
  shift
) {
  let query = {}
  if(shift !== "All") query.shift = shift;
  if(section !== "All") query.section = section;
  const results = await Result.find({
    session,
    term,
    className,
    ...query,
  });
  const SubjectWiseHighestMarks = {};
  for (const result of results) {
    const { subjectName, subjective, objective, practical } = result;
    const totalMarks = (subjective ?? 0) + (objective ?? 0) + (practical ?? 0);
    SubjectWiseHighestMarks[subjectName] = SubjectWiseHighestMarks[subjectName]
      ? SubjectWiseHighestMarks[subjectName] < totalMarks
        ? totalMarks
        : SubjectWiseHighestMarks[subjectName]
      : totalMarks;
  }
  return SubjectWiseHighestMarks;
}
async function GetSubjectWiseHighestMarksAbove5(
  session,
  term,
  className,
  section,
  shift
) {
  let query = {}
  if(shift !== "All") query.shift = shift;
  if(section !== "All") query.section = section;
  const results = await Result.find({
    session,
    term,
    className,
    ...query,
  });
  const SubjectWiseHighestMarks = {};
  for (const result of results) {
    const { subjectName, subjective, objective, practical, classAssignment } =
      result;
    const rawMarks70 =
      Math.abs(
        (((subjective ?? 0) + (objective ?? 0) + (practical ?? 0)) * 0.7) % 1
      ) >= 0.05
        ? Math.round(
            ((subjective ?? 0) + (objective ?? 0) + (practical ?? 0)) * 0.7
          )
        : Math.floor(
            ((subjective ?? 0) + (objective ?? 0) + (practical ?? 0)) * 0.7
          );
    const totalMarks = rawMarks70 + (classAssignment ?? 18);

    SubjectWiseHighestMarks[subjectName] = SubjectWiseHighestMarks[subjectName]
      ? SubjectWiseHighestMarks[subjectName] < totalMarks
        ? totalMarks
        : SubjectWiseHighestMarks[subjectName]
      : totalMarks;
  }
  return SubjectWiseHighestMarks;
}

// Add this new helper function
function calculateFinalMergedResult(
  halfYearlyResults,
  annualResults,
  resultGrading
) {
  const mergedResults = [];

  // Combine results for each subject
  halfYearlyResults.forEach((halfYearlySubject) => {
    const annualSubject = annualResults.find(
      (annual) => annual.subject === halfYearlySubject.subject
    );

    if (annualSubject) {
      // Calculate 50% of each component
      const halfYearlyWeight = halfYearlySubject.totalMarks * 0.5;
      const annualWeight = annualSubject.totalMarks * 0.5;
      const totalMarks = halfYearlyWeight + annualWeight;

      mergedResults.push({
        subject: halfYearlySubject.subject,
        fullMarks: halfYearlySubject.fullMarks,
        subjective:
          (halfYearlySubject.subjective + annualSubject.subjective) / 2,
        objective: (halfYearlySubject.objective + annualSubject.objective) / 2,
        practical: (halfYearlySubject.practical + annualSubject.practical) / 2,
        "70%": (halfYearlySubject["70%"] + annualSubject["70%"]) / 2,
        "CA(30%)": (halfYearlySubject["CA(30%)"] + annualSubject["CA(30%"]) / 2,
        totalMarks: Math.round(totalMarks),
        grade: calculateGrade(Math.round(totalMarks)),
        GP: resultGrading[calculateGrade(Math.round(totalMarks))],
        Highest: Math.max(halfYearlySubject.Highest, annualSubject.Highest),
        halfYearlyMarks: halfYearlySubject.totalMarks,
        annualMarks: annualSubject.totalMarks,
      });
    }
  });

  return mergedResults;
}

const deleteManyResult = asyncHandler(async(req,res)=>{
  try {
    const {ids} = req.body
    //const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (ids.length === 0) {
      return res.status(400).json({ message: 'No IDs provided' });
    }
    
    const result = await Result.deleteMany({
      _id: { $in: ids }
    });
    res.status(200).json({
      message: `${result.deletedCount} items deleted successfully`
    });

  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ message: 'Internal Server Error' });
  }
})
const getMeritList = asyncHandler(async(req, res) => {
  try {
    const startTime = performance.now();
    const { session, term, className, section, shift, group, is_merged } = req.body;
    //if shif is All or section is All then shift and section is not required in query
    let query = {}
    if(shift !== "All"){
      query.shift = shift
    }
    if(section !== "All"){
      query.section = section
    }
 
    
    // Get all students matching the criteria
    const students = await Student.find({
      class: className,
      ...query,
      group,
      year: session
    }).sort({ roll: 1 });

    const meritList = [];
    const subjectVsFullMarks = {
      Mathmetics: 100,
      Bangla: 100,
      English: 100,
      Mathematics: 100,
      Science: 100,
      "Bangladesh and Global Studies": 100,
      "Islam and Moral Education": 100,
      "Hindu and Moral Education": 100,
      "Christian and Moral Education": 100,
      "Digital technology": 100,
      "Life and livelihood": 100,
      "Art and culture": 100,
      "Well being": 100,
      "History and social science": 100,
    };

    const resultGrading = {
      "A+": 5.0,
      A: 4.0,
      "A-": 3.5,
      B: 3.0,
      C: 2.0,
      D: 1.0,
      F: 0.0,
    };

    // Process each student
    for (const student of students) {
      let results;
      let processedResults;
      let summary;

      if (is_merged) {
        // Get both half yearly and annual results
        const halfYearlyResults = await Result.find({
          session,
          term: "Half Yearly",
          className,
          section,
          shift,
          studentId: student.studentId,
        });

        const annualResults = await Result.find({
          session,
          term: "Annual",
          className,
          section,
          shift,
          studentId: student.studentId,
        });

        // Process results based on class
        const halfYearlyProcessed = ResultForClass9AndAbove(
          halfYearlyResults,
          resultGrading,
          subjectVsFullMarks
        );
        const annualProcessed = ResultForClass9AndAbove(
          annualResults,
          resultGrading,
          subjectVsFullMarks
        );
        processedResults = calculateFinalMergedResult(
          halfYearlyProcessed,
          annualProcessed,
          resultGrading
        );
      } else {
        results = await Result.find({
          session,
          term,
          className,
          section,
          shift,
          studentId: student.studentId,
        });

        processedResults = ResultForClass9AndAbove(
          results,
          resultGrading,
          subjectVsFullMarks
        );
      }

      summary = await calculateResultSummary(
        processedResults,
        className,
        section,
        shift
      );

      // Count failed subjects
      const noOfFail = processedResults.filter(result => result.grade === "F").length;

      meritList.push({
        serial: 0, // Will be set after sorting
        merit: 0, // Will be set after sorting
        name: student.studentName,
        roll: student.roll,
        section: student.section,
        noOfFail,
        gpa: summary.gpa,
        total: summary.obtainedMarks
      });
    }

    // Sort by GPA (descending) and total marks (descending)
    meritList.sort((a, b) => {
      if (b.gpa !== a.gpa) {
        return b.gpa - a.gpa;
      }
      return b.total - a.total;
    });

    // Add serial and merit numbers
    meritList.forEach((student, index) => {
      student.serial = index + 1;
      student.merit = index + 1;
    });
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime.toFixed(2)} milliseconds`);
    res.status(200).json({
      message: "Merit list fetched successfully",
      data: meritList
    });

  } catch (error) {
    console.error("Error in getMeritList:", error);
    res.status(500).json({ 
      message: "Error generating merit list",
      error: error.message 
    });
  }
});
const getMeritListNewfunction = asyncHandler(async(req, res) => {
  try {
    const startTime = performance.now();
    const { session, term, className, section, shift, group, is_merged } = req.body;
    
    // Build query
    let query = {};
    if(shift !== "All") query.shift = shift;
    if(section !== "All") query.section = section;
    
    // Get all students matching the criteria
    const students = await Student.find({
      class: className,
      ...query,
      group,
      year: session
    }).sort({ roll: 1 });

    // Process students in batches of 50
    const BATCH_SIZE = 50;
    const batches = [];
    for (let i = 0; i < students.length; i += BATCH_SIZE) {
      batches.push(students.slice(i, i + BATCH_SIZE));
    }

    // Constants moved outside the loop
    const subjectVsFullMarks = {
      Mathmetics: 100,
      Bangla: 100,
      English: 100,
      Mathematics: 100,
      Science: 100,
      "Bangladesh and Global Studies": 100,
      "Islam and Moral Education": 100,
      "Hindu and Moral Education": 100,
      "Christian and Moral Education": 100,
      "Digital technology": 100,
      "Life and livelihood": 100,
      "Art and culture": 100,
      "Well being": 100,
      "History and social science": 100,
    };

    const resultGrading = {
      "A+": 5.0,
      A: 4.0,
      "A-": 3.5,
      B: 3.0,
      C: 2.0,
      D: 1.0,
      F: 0.0,
    };

    // Process each batch in parallel
    const batchResults = await Promise.all(
      batches.map(async (studentBatch) => {
        return Promise.all(
          studentBatch.map(async (student) => {
            let processedResults;

            if (is_merged) {
              // Parallel fetch of half yearly and annual results
              const [halfYearlyResults, annualResults] = await Promise.all([
                Result.find({
                  session,
                  term: "Half Yearly",
                  className,
                  section,
                  shift,
                  studentId: student.studentId,
                }),
                Result.find({
                  session,
                  term: "Annual",
                  className,
                  section,
                  shift,
                  studentId: student.studentId,
                })
              ]);

              // Process results in parallel
              const [halfYearlyProcessed, annualProcessed] = await Promise.all([
                ResultForClass9AndAbove(halfYearlyResults, resultGrading, subjectVsFullMarks),
                ResultForClass9AndAbove(annualResults, resultGrading, subjectVsFullMarks)
              ]);

              processedResults = calculateFinalMergedResult(
                halfYearlyProcessed,
                annualProcessed,
                resultGrading
              );
            } else {
              const results = await Result.find({
                session,
                term,
                className,
                ...query,
                studentId: student.studentId,
              });
              console.log("results", results.length);
              processedResults = className=='4'||className=='5' ? ResultForClass4To5(
                results,
                resultGrading,
                subjectVsFullMarks
              ) : ResultForClass9AndAbove(
                results,
                resultGrading,
                subjectVsFullMarks
              );
            }
            // console.log("processedResults", processedResults.length);
            const summary = await calculateResultSummary(
              processedResults,
              className,
              section,
              shift
            );
            // console.log("summary", summary);
            const noOfFail = processedResults.filter(result => result.grade === "F").length;

            return {
              serial: 0, // Will be set after sorting
              merit: 0, // Will be set after sorting
              name: student.studentName,
              roll: student.roll,
              section: student.section,
              noOfFail,
              gpa: summary.gpa,
              total: summary.obtainedMarks
            };
          })
        );
      })
    );

    // Flatten batch results into single array
    let meritList = batchResults.flat();

    // Sort by GPA and total marks
    meritList.sort((a, b) => {
      if (b.gpa !== a.gpa) return b.gpa - a.gpa;
      return b.total - a.total;
    });

    // Add serial and merit numbers
    meritList.forEach((student, index) => {
      student.serial = index + 1;
      student.merit = index + 1;
    });
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime.toFixed(2)} milliseconds`);
    res.status(200).json({
      message: "Merit list fetched successfully",
      data: meritList
    });

  } catch (error) {
    console.error("Error in getMeritList:", error);
    res.status(500).json({ 
      message: "Error generating merit list",
      error: error.message 
    });
  }
});
const getFailList = asyncHandler(async(req, res) => {
  console.log("getFailList");
  try {
    const { session, term, className, section, shift, group, is_merged ,start_roll,end_roll} = req.body;
    
    // Build query based on provided filters
    let query = { };
    if (shift !== "All") query.shift = shift;
    if (section !== "All") query.section = section;
    query.class=className;
    if(start_roll && end_roll){
      query.roll = { $gte: start_roll, $lte: end_roll };
    }
    console.log("query", query);
    // Get all students matching the criteria
    const students = await Student.find(query).sort({ roll: 1 });
    console.log("students", students.length);
    const failList = [];
    const subjectVsFullMarks = {
      Mathmetics: 100,
      Bangla: 100,
      English: 100,
      Mathematics: 100,
      Science: 100,
      "Bangladesh and Global Studies": 100,
      "Islam and Moral Education": 100,
      "Hindu and Moral Education": 100,
      "Christian and Moral Education": 100,
      "Digital technology": 100,
      "Life and livelihood": 100,
      "Art and culture": 100,
      "Well being": 100,
      "History and social science": 100,
    };

    const resultGrading = {
      "A+": 5.0, A: 4.0, "A-": 3.5, B: 3.0, C: 2.0, D: 1.0, F: 0.0,
    };

    // Process each student
    for (const student of students) {
      let results;
      let processedResults;

      if (is_merged) {
        // Get both half yearly and annual results
        const halfYearlyResults = await Result.find({
          session,
          term: "Half Yearly",
          className,
          studentId: student.studentId,
          section,
          shift
        });
        console.log("halfYearlyResults", halfYearlyResults.length);

        const annualResults = await Result.find({
          session,
          term: "Annual",
          className,
          studentId: student.studentId,
          section,
          shift
        });
        console.log("annualResults", annualResults.length);

        // Process and merge results
        const halfYearlyProcessed = ResultForClass9AndAbove(
          halfYearlyResults,
          resultGrading,
          subjectVsFullMarks
        );
        const annualProcessed = ResultForClass9AndAbove(
          annualResults,
          resultGrading,
          subjectVsFullMarks
        );
        processedResults = calculateFinalMergedResult(
          halfYearlyProcessed,
          annualProcessed,
          resultGrading
        );
        console.log("processedResults", processedResults.length);
        results = processedResults;
      } else {
        // console.log("not merged", student.studentId, student.roll);
        // Get regular term results
        //there is filed name subjectName in result collection i want to it as subject
        results = await Result.find({
          session,
          term,
          className,
          studentId: student.studentId,
          section,
          shift
        });
        // console.log("results", results.length);
      }

      // Check for failed subjects
      const failedSubjects = [];
      
      for (const result of results) {
        const { 
          subjectName, 
          subjective = 0, 
          objective = 0, 
          practical = 0, 
          classAssignment = 0 
        } = result;
        console.log("result", result);
        // Define failure conditions
        const isSubjectiveFail = subjective < 33;
        let isCAFail = classAssignment < 10;
        // console.log(subjective, "---", classAssignment);
        const totalMarks = subjective + objective + practical;
       //classAssignment is not required for class 4 and 5
       if(className === "4" || className === "5"){
        isCAFail = false;
       }
        if (isSubjectiveFail || isCAFail) {
          // console.log("fais");
          failedSubjects.push({
            "subjectCode": subjectName.substring(0, 4).toUpperCase(),
            "subjectName": subjectName,
            "subjective": subjective,
            "objective": objective,
            "practical": practical,
            "Total": totalMarks,
            "fail": [
              ...(isSubjectiveFail ? ["subjective"] : []),
              ...(isCAFail ? ["classAssignment"] : [])
            ].join(", ")
          });
        }
      }
      // console.log("failedSubjects", failedSubjects);

      // Only add student to fail list if they have failed subjects
      if (failedSubjects.length > 0) {
        failList.push({
          "studentInfo": {
            "studentId": student.studentId,
            "class": student.class,
            "rollNo": student.roll,
            "studentName": student.studentName
          },
          "subjects": failedSubjects
        });
      }
    }
  //  console.log("final faillist", failList);
    // Sort fail list by roll number
    failList.sort((a, b) => a["Roll No"] - b["Roll No"]);

    res.status(200).json({
      message: "Fail list generated successfully",
      data: failList
    });

  } catch (error) {
    console.error("Error in getFailList:", error);
    res.status(500).json({ 
      message: "Error generating fail list",
      error: error.message 
    });
  }
});

module.exports = {
  createResult,
  bulkUploadResults,
  getIndividualResult,
  getAllResultData,
  updateResult,
  deleteResult,
  getTebulationSheet,
  deleteManyResult,
  getMarksheet,
  getMeritList,
  getFailList,
  getMarksheetNewfunction,
  getMeritListNewfunction
};
