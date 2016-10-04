
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index.html');
}



function getTranslation() {
    var translationFile = "EnrollmentFormValues";
    var sheetName = "translation";
    var folder = DriveApp.getRootFolder();
    var ssFile, ssFiles = folder.getFilesByName(translationFile);
 
  
    while (ssFiles.hasNext()) {
     ssFile = ssFiles.next();
    } 
    
    var ss = SpreadsheetApp.open(ssFile);
    var sheet = ss.getSheetByName(sheetName);
    var data = sheet.getDataRange().getValues();
    
    var header = data[0];
    var translationObj = {};
    for (var i = 1; i < data.length; i++) {     
      for (var item in data[i]) {
            if (item == 0) {
              // the first column is the class or ID, we'll use it as the object property 
              // and store the translations as an array associated with it
              translationObj[data[i][item]] = [];
            } else if (data[i][item].length > 0) {
                // push each translation onto the class/ID array
                translationObj[data[i][0]].push(data[i][item]);
            }                
      }
  }
  return translationObj;
    
}




function getValidation() {
  var validationFile = "EnrollmentFormValues";
  var sheetName = "validation";
  var folder = DriveApp.getRootFolder();
  var ssFile, ssFiles = folder.getFilesByName(validationFile);
 
  
  while (ssFiles.hasNext()) {
    ssFile = ssFiles.next();
  } 
    
  var ss = SpreadsheetApp.open(ssFile);
  var sheet = ss.getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  
  var header = data[0];
  var validationObj = {};
  
  for (var i = 0; i < data.length; i++) {
    for (var item in data[i]) {
      if (i == 0) {
          validationObj[header[item]] = [];
      } else {
          if (data[i][item].length > 0) {
              validationObj[header[item]].push(data[i][item]);
          }         
      }     
    }
  }

  return validationObj;
  
}





function uploadFiles(form) {

// Global vars used to find matches
  var LASTNAMECOL;
  var FIRSTNAMECOL;
  var DOBCOL;  
  
  // Prevent concurrent access to the spreadsheet with a lock
  // we want a public lock, one that locks for all invocations
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
  // got the lock, you may now proceed


  try {
  
  
    // Set folder & spreadsheet variables
    var enrollmentFolderName = "Enrollment_2.0";
    var spreadsheetName = "Enrollment_2.0";
    var FNTITLE = "First Name";
    var LNTITLE = "Last Name";
    var DOBTITLE = "DoB";
    var myEmailAddress = "daniel@harmony-project.org";
    
    
    var thisYear = new Date().getFullYear();
    var timestamp = new Date().toISOString();
    
    
    
    
    /*
    
                _                   _       _        
               (_)                 | |     | |       
   __ _ ___ ___ _  __ _ _ __     __| | __ _| |_ __ _ 
  / _` / __/ __| |/ _` | '_ \   / _` |/ _` | __/ _` |
 | (_| \__ \__ \ | (_| | | | | | (_| | (_| | || (_| |
  \__,_|___/___/_|\__, |_| |_|  \__,_|\__,_|\__\__,_|
                   __/ |                             
                  |___/                              

    
    */
    
    // Student form data
    var thisLastName = form.lastName;
    var thisFirstName = form.firstName;
    var thisProgramSite = form.programSite;
    var dobYear = form.dobYear;
    var dobMonth = form.dobMonth;
    var dobDay = pad2(form.dobDay);
    var thisDob = dobYear + "-" + dobMonth + "-" + dobDay;
    var thisGender = form.gender;
    var thisInstrument = form.instrument;
    var thisInstrumentSerialNo = form.instrumentSerialNo;
    var thisStudentLanguage = form.studentLanguage;
    var thisEthnicity = form.ethnicity + " " + form.ethnicityOther;
    var thisStudentCell = form.studentCellPhone;
    var thisStudentEmail = form.studentEmail;
    var thisStudentSchool = form.studentSchool;
    var thisStudentSchoolWriteIn = form.studentSchoolWriteIn;
    var thisStudentGrade = form.studentGrade;
    var thisStudentOtherActivities = form.studentOtherActivities;
    
    // Parent 1 contact info
    var thisParent1LastName = form.parent1LastName;
    var thisParent1FirstName = form.parent1FirstName;
    var thisParent1Language = form.parent1Language;
    var thisParent1Address = form.parent1Address;
    var thisParent1AptNo = form.parent1AptNo;
    var thisParent1City = form.parent1City;
    var thisParent1State = form.parent1State;
    var thisParent1Zip = form.parent1Zip;
    var thisParent1HomePhone = form.parent1HomePhone;
    var thisParent1CellPhone = form.parent1CellPhone;
    var thisParent1Email = form.parent1Email;
    var thisParent1English = form.parent1English;
    var thisParent1ContactDays = !isEmpty(form.parent1ContactDay) ? form.parent1ContactDay.toString() : "";
    var thisParent1ContactTimes = !isEmpty(form.parent1ContactTime) ? form.parent1ContactTime.toString() : "";
    var thisParent1ContactDaysTimes = thisParent1ContactDays + " (" + thisParent1ContactTimes + ")";
    
    // Parent 2 contact info
    var thisParent2LastName = form.parent2LastName;
    var thisParent2FirstName = form.parent2FirstName;
    var thisParent2Language = form.parent2Language;
    var thisParent2Address = form.parent2Address;
    var thisParent2AptNo = form.parent2AptNo;
    var thisParent2City = form.parent2City;
    var thisParent2State = form.parent2State;
    var thisParent2Zip = form.parent2Zip;
    var thisParent2HomePhone = form.parent2HomePhone;
    var thisParent2CellPhone = form.parent2CellPhone;
    var thisParent2Email = form.parent2Email;
    var thisParent2English = form.parent2English;
    var thisParent2ContactDays = !isEmpty(form.parent2ContactDay) ? form.parent2ContactDay.toString() : "";
    var thisParent2ContactTimes = !isEmpty(form.parent2ContactTime) ? form.parent2ContactTime.toString() : "";
    var thisParent2ContactDaysTimes = thisParent2ContactDays + " (" + thisParent2ContactTimes + ")";
    
    var thisSendMailingsTo = !isEmpty(form.sendMailingsTo) ? form.sendMailingsTo.toString() : "";
    
    // Emergency Contact #1
    var thisEC1Name = form.emergencyContact1Name;
    var thisEC1HomePhone = form.emergencyContact1HomePhone;
    var thisEC1CellPhone = form.emergencyContact1CellPhone;
    var thisEC1WorkPhone = form.emergencyContact1WorkPhone;

    // Emergency Contact #2
    var thisEC2Name = form.emergencyContact2Name;
    var thisEC2HomePhone = form.emergencyContact2HomePhone;
    var thisEC2CellPhone = form.emergencyContact2CellPhone;
    var thisEC2WorkPhone = form.emergencyContact2WorkPhone;
    
    // Medical info
    var thisMedicalPlan = form.medicalPlan;
    var thisInsuranceNo = form.insuranceNo;
    var thisPhysician = form.physician;
    var thisPhysicianPhone = form.physicianPhone;
    var thisDentist = form.dentist;
    var thisDentistPhone = form.dentistPhone;
    var thisMedicalNeeds = !isEmpty(form.medicalNeeds) ? form.medicalNeeds.toString() : "";
    var thisAllergies = form.otherAllergies;
    var thisMeds = form.otherMeds;
    var thisMedicalOther = form.medicalNeedsOther;
    var thisIEP = form.iep;
    var thisIEPSpecify = form.iepSpecify;
    var thisCounselingCurrent = form.counselingCurrent;
    var thisCounselingCurrentSpecify = form.counselingCurrentSpecify;
    var thisAspirinTylenol = form.aspirinTylenol;
    var thisBenadryl = form.benadryl;
    var thisMedicalIssues = !isEmpty(form.disease) ? form.disease.toString() : "";
    
    var thisTdapYear = form.tdapYear;
    var thisHepBYear = form.hepBYear;
    var thisIpvYear = form.ipvYear;
    var thisMmrYear = form.mmrYear;
    var thisVaricellaYear = form.varicellaYear;
    
    // Authorization & Contracts
    var thisAuthParent1 = (!isEmpty(form.authorizationNameParent1Box) ? form.authorizationNameParent1Box : "") + " " + form.authorizationNameParent1;
    var thisAuthParent2 = (!isEmpty(form.authorizationNameParent2Box) ? form.authorizationNameParent2Box : "") + " " + form.authorizationNameParent2;
    var thisParentContract = form.instrumentContractParent + ", " + form.participationContractParent + ", " + form.dropOffContractParent + ", " + form.attendanceContractParent + ", " + form.conductContractParent;
    var thisStudentContract = form.instrumentContractStudent + ", " + form.participationContractStudent + ", " + form.dropOffContractStudent + ", " + form.attendanceContractStudent + ", " + form.conductContractStudent;
    
    
    
     
    
    var studentFolderName = thisLastName +", " + thisFirstName +" " + thisDob;
    var incomeVerificationFilename = thisLastName + thisFirstName + "_" + thisDob + "_incomeVerification_";
    var reportCardFilename = thisLastName + thisFirstName + "_" + thisDob + "_reportCard_";

    // Create folers if needed
    var enrollmentFolder = getOrCreateFolder(DriveApp.getRootFolder(), enrollmentFolderName);
    var yearFolder = getOrCreateFolder(enrollmentFolder, thisYear);
    var programSiteFolder = getOrCreateFolder(yearFolder, thisProgramSite);
    var studentFolder = programSiteFolder;
        
    // Upload and rename files
    var thisIncomeVerificationUrl = uploadToFolder(form.incomeVerificationFile, studentFolder, incomeVerificationFilename);
    var thisReportCardUrl = uploadToFolder(form.reportCardFile, studentFolder, reportCardFilename);
    
    // 
    var thisCompleted = !isEmpty(form.completed) ?  form.completed : "";
    
    
    /*
                               _     _               _                _   _                 
                              | |   | |             | |              | | (_)                
  ___ _ __  _ __ ___  __ _  __| |___| |__   ___  ___| |_    __ _  ___| |_ _  ___  _ __  ___ 
 / __| '_ \| '__/ _ \/ _` |/ _` / __| '_ \ / _ \/ _ \ __|  / _` |/ __| __| |/ _ \| '_ \/ __|
 \__ \ |_) | | |  __/ (_| | (_| \__ \ | | |  __/  __/ |_  | (_| | (__| |_| | (_) | | | \__ \
 |___/ .__/|_|  \___|\__,_|\__,_|___/_| |_|\___|\___|\__|  \__,_|\___|\__|_|\___/|_| |_|___/
     | |                                                                                    
     |_|     
     
     
    */
    var f = getFieldInfo();
    var rowObj = {};
    rowObj[f.LASTNAME.title] = thisLastName;
    rowObj[f.FIRSTNAME.title] = thisFirstName;
    rowObj[f.DOB.title] = thisDob;
    rowObj[f.GENDER.title] = thisGender;
    rowObj[f.PROGRAMSITE.title] = thisProgramSite;
    rowObj[f.INSTRUMENT.title] = thisInstrument;
    rowObj[f.SERIAL.title] = thisInstrumentSerialNo;
    rowObj[f.STUDENTLANGUAGE.title] = thisStudentLanguage;
    rowObj[f.ETHNICITY.title] = thisEthnicity;
    rowObj[f.STUDENTCELL.title] = thisStudentCell;
    rowObj[f.STUDENTEMAIL.title] = thisStudentEmail;
    rowObj[f.SCHOOL.title] = thisStudentSchool;
    rowObj[f.SCHOOLWRITEIN.title] = thisStudentSchoolWriteIn;
    rowObj[f.GRADE.title] = thisStudentGrade;
    rowObj[f.OTHERACTIVITIES.title] = thisStudentOtherActivities;
    rowObj[f.PARENT1LASTNAME.title] = thisParent1LastName;
    rowObj[f.PARENT1FIRSTNAME.title] = thisParent1FirstName;
    rowObj[f.PARENT1LANGUAGE.title] = thisParent1Language;
    rowObj[f.PARENT1ADDRESS.title] = thisParent1Address;
    rowObj[f.PARENT1APT.title] = thisParent1AptNo;
    rowObj[f.PARENT1CITY.title] = thisParent1City;
    rowObj[f.PARENT1STATE.title] = thisParent1State;
    rowObj[f.PARENT1ZIP.title] = thisParent1Zip;
    rowObj[f.PARENT1HOMEPHONE.title] = thisParent1HomePhone;
    rowObj[f.PARENT1CELL.title] = thisParent1CellPhone;
    rowObj[f.PARENT1EMAIL.title] = thisParent1Email;
    rowObj[f.PARENT1ENGLISH.title] = thisParent1English;
    rowObj[f.PARENT1CONTACTDAYS.title] = thisParent1ContactDays;
    rowObj[f.PARENT1CONTACTTIMES.title] = thisParent1ContactTimes;
    rowObj[f.PARENT2LASTNAME.title] = thisParent2LastName;
    rowObj[f.PARENT2FIRSTNAME.title] = thisParent2FirstName;
    rowObj[f.PARENT2LANGUAGE.title] = thisParent2Language;
    rowObj[f.PARENT2ADDRESS.title] = thisParent2Address;
    rowObj[f.PARENT2APT.title] = thisParent2AptNo;
    rowObj[f.PARENT2CITY.title] = thisParent2City;
    rowObj[f.PARENT2STATE.title] = thisParent2State;
    rowObj[f.PARENT2ZIP.title] = thisParent2Zip;
    rowObj[f.PARENT2HOMEPHONE.title] = thisParent2HomePhone;
    rowObj[f.PARENT2CELL.title] = thisParent2CellPhone;
    rowObj[f.PARENT2EMAIL.title] = thisParent2Email;
    rowObj[f.PARENT2ENGLISH.title] = thisParent2English;
    rowObj[f.PARENT2CONTACTDAYS.title] = thisParent2ContactDays;
    rowObj[f.PARENT2CONTACTTIMES.title] = thisParent2ContactTimes;
    rowObj[f.SENDMAILINGSTO.title] = thisSendMailingsTo;
    rowObj[f.EC1NAME.title] = thisEC1Name;
    rowObj[f.EC1HOMEPHONE.title] = thisEC1HomePhone;
    rowObj[f.EC1CELL.title] = thisEC1CellPhone;
    rowObj[f.EC2NAME.title] = thisEC2Name;
    rowObj[f.EC2HOMEPHONE.title] = thisEC2HomePhone;
    rowObj[f.EC2CELL.title] = thisEC2CellPhone;
    rowObj[f.MEDICALPLAN.title] = thisMedicalPlan;
    rowObj[f.INSURANCENUMBER.title] = thisInsuranceNo;
    rowObj[f.PHYSICIAN.title] = thisPhysician;
    rowObj[f.PHYSICIANPHONE.title] = thisPhysicianPhone;
    rowObj[f.DENTIST.title] = thisDentist;
    rowObj[f.DENTISTPHONE.title] = thisDentistPhone;
    rowObj[f.MEDICALNEEDS.title] = thisMedicalNeeds;
    rowObj[f.ALLERGIES.title] = thisAllergies;
    rowObj[f.MEDS.title] = thisMeds;
    rowObj[f.OTHERMEDICALNEEDS.title] = thisMedicalOther;
    rowObj[f.CURRENTCOUNSELING.title] = thisCounselingCurrent;
    rowObj[f.CURRENTCOUNSELINGSPECIFY.title] = thisCounselingCurrentSpecify;
    rowObj[f.IEP.title] = thisIEP;
    rowObj[f.IEPSPECIFY.title] = thisIEPSpecify;
    rowObj[f.ASPIRIN.title] = thisAspirinTylenol;
    rowObj[f.BENADRYL.title] = thisBenadryl;
    rowObj[f.MEDICALISSUES.title] = thisMedicalIssues;
    rowObj[f.TDAP.title] = thisTdapYear;
    rowObj[f.HEPB.title] = thisHepBYear;
    rowObj[f.IPV.title] = thisIpvYear;
    rowObj[f.MMR.title] = thisMmrYear;
    rowObj[f.VARICELLA.title] = thisVaricellaYear;
    rowObj[f.MEDAUTHPARENT1.title] = thisAuthParent1;
    rowObj[f.MEDAUTHPARENT2.title] = thisAuthParent2;
    rowObj[f.CONTRACTSAGREEPARENT.title] = thisParentContract;
    rowObj[f.CONTRACTSAGREESTUDENT.title] = thisStudentContract;
    rowObj[f.INCOMEVERIFICATION.title] = thisIncomeVerificationUrl;
    rowObj[f.REPORTCARD.title] = thisReportCardUrl;
    rowObj[f.TIMESTAMP.title] = timestamp;
    rowObj[f.COMPLETED.title] = thisCompleted;

     
   // If spreadsheet doesn't exist yet (i.e. for a new year)
   // Create a temp header row and create a new sheet
   var headers = Object.keys(rowObj);

   
    // Get spreadsheet
    var spreadsheet = getOrCreateSpreadsheetInFolder(spreadsheetName, headers, yearFolder);
    var enrollmentSheet = SpreadsheetApp.open(spreadsheet);
    var sheet = enrollmentSheet.getSheets()[0];
    var values = sheet.getDataRange().getValues();
    
    // Get headers in order to associate data with columns
    var sheetHeaders = values[0];
    
    // Set column variables for "First Name", "Last Name", "DoB" to find matches
    for (var item in sheetHeaders) {
        var thisItem = sheetHeaders[item]
        if (thisItem === LNTITLE) {
           LASTNAMECOL = item;
        } else if (thisItem === FNTITLE) {
            FIRSTNAMECOL = item;
        } else if (thisItem === DOBTITLE) {
            DOBCOL = item;
        }
    }
 
    
        headers = [];
    var thisStudent = [];
    var emailBodyHTML = "<table>";
    var emailBodyPlain = "";
    
    // Loop through all items and add titles to a header row, data to the student row
    // Also, set columns to check for matches
    for (var item in sheetHeaders) {      
      headers.push(sheetHeaders[item]);
      thisStudent.push(rowObj[sheetHeaders[item]]);
      emailBodyHTML += "<tr><td><b>" + sheetHeaders[item] +"</b></td><td>" + rowObj[sheetHeaders[item]] + "</td></tr>";
      emailBodyPlain += sheetHeaders[item] +": " + rowObj[sheetHeaders[item]] + "\n";
    }
    emailBodyHTML += "</table>";
    
    // Send confirmation email to designated address
    MailApp.sendEmail(myEmailAddress, "ENROLLMENT - " + studentFolderName, emailBodyPlain, {htmlBody: emailBodyHTML});

    
    
    
    
    // Find student on sheet by last name and bday
    // Workaround to deal with Apps Script error where new Date("YYYY-MM-DD") is not valid
    var studentRowNumber = 0;
    var foundMatch = false;
    
    for (var i = 0; i < values.length; i++) {
      var d = new Date(values[i][DOBCOL]);
      var yearMatch = dobYear - d.getFullYear() === 0.0;
      // months are numbered 0-11
      var monthMatch = Number(dobMonth) - d.getMonth() === 1.0;
      var dayMatch = dobDay - d.getDate() === 0.0;
      var lastNameMatch = thisLastName === values[i][LASTNAMECOL];
      var firstNameMatch = thisFirstName === values[i][FIRSTNAMECOL];      
      if (yearMatch && monthMatch && dayMatch && lastNameMatch && firstNameMatch) {
        Logger.log("Found a match!");
        foundMatch = true;
        // rows are 1-indexed
        studentRowNumber = i + 1;
        break;
      }
    }
    if (foundMatch) {
        sheet.deleteRow(studentRowNumber);
    
    }   
    sheet.appendRow(thisStudent);
    // sheets are 1-indexed
    var sortCol = parseInt(LASTNAMECOL) + 1;
    Logger.log(sortCol);
    sheet.sort(sortCol);
    

    // See if there's already a tab for the student's program site. Add new tab if necessary
    var thisProgramSiteSheet;
    if (enrollmentSheet.getSheetByName(thisProgramSite) == null) {
       thisProgramSiteSheet = enrollmentSheet.insertSheet(thisProgramSite);
       thisProgramSiteSheet.insertColumns(thisProgramSiteSheet.getMaxColumns(), sheet.getMaxColumns() - thisProgramSiteSheet.getMaxColumns());
       // Set headers on row 1 to pull from 'All sites' sheet

       thisProgramSiteSheet.getRange("1:1").setFormula("'All sites'!1:1");
       thisProgramSiteSheet.setFrozenRows(1);
    } else {
      thisProgramSiteSheet = enrollmentSheet.getSheetByName(thisProgramSite);
    }
    
    // Append form info to next row of program sheet and sort
    thisProgramSiteSheet.appendRow(thisStudent);
    thisProgramSiteSheet.sort(sortCol);
    
    lock.releaseLock();
    
    return 1;
    
  } catch (error) {
    Logger.log(error);
    return 0;
  }
  
}



/*

  _          _                    __                  _   _                 
 | |        | |                  / _|                | | (_)                
 | |__   ___| |_ __   ___ _ __  | |_ _   _ _ __   ___| |_ _  ___  _ __  ___ 
 | '_ \ / _ \ | '_ \ / _ \ '__| |  _| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 | | | |  __/ | |_) |  __/ |    | | | |_| | | | | (__| |_| | (_) | | | \__ \
 |_| |_|\___|_| .__/ \___|_|    |_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
              | |                                                           
              |_|                                               

*/




function getOrCreateFolder(currentDirectory, folderToGet) {
  var folder, folders = currentDirectory.getFoldersByName(folderToGet);
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = currentDirectory.createFolder(folderToGet);
  }
  return folder;
}

function getOrCreateSpreadsheetInFolder(spreadsheetName, spreadsheetColNames, folder) {
  var ssFile, ssFiles = folder.getFilesByName(spreadsheetName);
  
  if (ssFiles.hasNext()) {
    ssFile = ssFiles.next();
  } else {
  
    // Initialize new spreadsheet 
    var ssNew = SpreadsheetApp.create(spreadsheetName);
    var ssId = ssNew.getId();
    var thisFile = DriveApp.getFileById(ssId);
    var folderId = folder.getId();
    var newFile = thisFile.makeCopy(folder);
    newFile.setName(spreadsheetName);
    var openSheet = SpreadsheetApp.open(newFile);
    var thisSheet = openSheet.getSheets()[0];
    
    // Set up initial page, columns and freeze first row
    thisSheet.setName("All sites");
    thisSheet.appendRow(spreadsheetColNames);
    thisSheet.setFrozenRows(1);
    ssFile = newFile;
    openSheet.insertSheet("ETO");    
    // Remove spreadsheet from root directory
    DriveApp.getFileById(ssId).setTrashed(true);   
  }
  
  // Return spreadsheet
  return ssFile;
}

// Tests if a string is empty or null
function isEmpty(str) {
    return (!str || 0 === str.length);
}

// Pads a single digit out to two spaces
function pad2(number) {
     return (number < 10 ? '0' : '') + number;
}

function uploadToFolder(file, folder, nameToPrepend) {
  if (!isEmpty(file)) {
    Logger.log("Creating file " + nameToPrepend);
    var tempFile = folder.createFile(file);
    var tempFileName = tempFile.getName();
    tempFile.setName(nameToPrepend + tempFileName);
    return tempFile.getUrl();
  } else {
    return "";
  }
}

function getInputType() {

}


// If column names change on the spreadsheet, the title property MUST be updated here too
function getFieldInfo() {
    var fieldInfo = {
       STUDENTID : { title : "Student ID", type : "text", id : "studentID"},
       LASTNAME : { title: "Last Name", type : "text", id : "lastName" },
       FIRSTNAME : { title: "First Name", type : "text", id : "firstName" },
       DOB : { title : "DoB", type : "other", id : "dob" },
       GENDER : { title : "Gender", type : "radio", id : "gender" },
       PROGRAMSITE : { title : "Program Site", type : "select", id : "programSite" },
       INSTRUMENT : { title : "Instrument", type : "select", id : "instrument" },
       SERIAL : { title : "Serial #", type : "text", id : "serial" },
       STUDENTLANGUAGE : { title : "Language", type : "select", id : "studentLanguage" },
       ETHNICITY : { title : "Ethnicity", type : "radio/input", id : "ethnicity" },
       STUDENTCELL : { title : "Student Cell", type : "text", id : "studentCell" },
       STUDENTEMAIL : { title : "Student Email", type : "text", id : "studentEmail" },
       SCHOOL : { title : "School", type : "select", id : "studentSchool" },
       SCHOOLWRITEIN : { title : "School (Write-In)", type : "text", id : "studentSchoolWriteIn" },
       GRADE : { title : "Grade", type : "select", id : "grade" },
       OTHERACTIVITIES : { title : "Other Activities", type : "text", id : "otherActivities" },
       PARENT1LASTNAME : { title : "Parent #1 Last Name", type : "text", id : "parent1LastName" },
       PARENT1FIRSTNAME : { title : "Parent #1 First Name", type : "text", id : "parent1FirstName" },
       PARENT1LANGUAGE : { title : "Parent #1 Language", type : "select", id : "parent1Language" },
       PARENT1ADDRESS : { title : "Parent #1 Address", type : "text", id : "parent1Address" },
       PARENT1APT : { title : "Parent #1 Apt. #", type : "text", id : "parent1Apt" },
       PARENT1CITY : { title : "Parent #1 City", type : "text", id : "parent1City" }, 
       PARENT1STATE : { title : "Parent #1 State", type : "text", id : "parent1State" },
       PARENT1ZIP : { title : "Parent #1 Zip", type : "text", id : "parent1Zip" },
       PARENT1HOMEPHONE : { title : "Parent #1 Home Phone", type : "text", id : "parent1HomePhone" },
       PARENT1CELL : { title : "Parent #1 Cell Phone", type : "text", id : "parent1Cell" },
       PARENT1EMAIL : { title : "Parent #1 Email", type : "text", id : "parent1Email" },
       PARENT1ENGLISH : { title : "Parent #1 Speaks English", type : "radio", id : "parent1English" },
       PARENT1CONTACTDAYS : { title : "Parent #1 Contact Days", type : "checkbox", id : "parent1ContactDay" },
       PARENT1CONTACTTIMES : { title : "Parent #1 Contact Times", type : "checkbox", id : "parent1ContactTime" },
       PARENT2LASTNAME : { title : "Parent #2 Last Name", type : "text", id : "parent2LastName" },
       PARENT2FIRSTNAME : { title : "Parent #2 First Name", type : "text", id : "parent2FirstName" },
       PARENT2LANGUAGE : { title : "Parent #2 Language", type : "select", id : "parent2Language" },
       PARENT2ADDRESS : { title : "Parent #2 Address", type : "text", id : "parent2Address" },
       PARENT2APT : { title : "Parent #2 Apt. #", type : "text", id : "parent2Apt" },
       PARENT2CITY : { title : "Parent #2 City", type : "text", id : "parent2City" }, 
       PARENT2STATE : { title : "Parent #2 State", type : "text", id : "parent2State" },
       PARENT2ZIP : { title : "Parent #2 Zip", type : "text", id : "parent2Zip" },
       PARENT2HOMEPHONE : { title : "Parent #2 Home Phone", type : "text", id : "parent2HomePhone" },
       PARENT2CELL : { title : "Parent #2 Cell Phone", type : "text", id : "parent2Cell" },
       PARENT2EMAIL : { title : "Parent #2 Email", type : "text", id : "parent2Email" },
       PARENT2ENGLISH : { title : "Parent #2 Speaks English", type : "radio", id : "parent2English" },
       PARENT2CONTACTDAYS : { title : "Parent #2 Contact Days", type : "checkbox", id : "parent2ContactDay" },
       PARENT2CONTACTTIMES : { title : "Parent #2 Contact Times", type : "checkbox", id : "parent2ContactTime" },
       SENDMAILINGSTO : { title : "Send Mailings To", type : "checkbox", id : "sendMailingsTo" },
       EC1NAME : { title : "Emergency Contact #1", type : "text", id : "emergencyContact1Name" },
       EC1HOMEPHONE : { title : "EC #1 Home Phone", type : "text", id : "emergencyContact1HomePhone" },
       EC1CELL : { title: "EC #1 Cell Phone", type : "text", id : "emergencyContact1CellPhone" },
       EC2NAME : { title : "Emergency Contact #2", type : "text", id : "emergencyContact2Name" },
       EC2HOMEPHONE : { title : "EC #2 Home Phone", type : "text", id : "emergencyContact2HomePhone" },
       EC2CELL : { title : "EC #2 Cell Phone", type : "text", id : "emergencyContact2CellPhone" },
       MEDICALPLAN : { title : "Medical Plan", type : "text", id : "medicalPlan" },
       INSURANCENUMBER : { title : "Insurance #", type : "text", id : "insuranceNo" },
       PHYSICIAN : { title : "Physician", type : "text", id : "physician" },
       PHYSICIANPHONE : { title : "Physician Ph. #", type : "text", id : "physicianPhone" },
       DENTIST : { title : "Dentist", type : "text", id : "dentist" },
       DENTISTPHONE : { title : "Dentist Ph. #", type : "text", id : "dentistPhone" },
       MEDICALNEEDS : { title : "Medical Needs", type : "checkbox/text", id : "medicalNeeds" },
       ALLERGIES : { title : "Allergies", type : "checkbox/text", id : "otherAllergies" },
       MEDS : { title : "Medications", type : "checkbox/text", id : "otherMeds" },
       OTHERMEDICALNEEDS : { title : "Other Medical Needs", type: "checkbox/text", id : "medicalNeedsOther" },
       CURRENTCOUNSELING : { title : "Current Counseling", type : "select", id : "counselingCurrent" },
       CURRENTCOUNSELINGSPECIFY : { title : "Specify Current Counseling", type : "text", id : "counselingCurrent" },
       IEP :  { title : "IEP", type : "select", id : "iep" },
       IEPSPECIFY :  { title : "IEP Describe", type : "text", id : "iepSpecify" },
       ASPIRIN : { title : "Aspirin/Tylenol OK", type : "select", id : "aspirinTylenol" },
       BENADRYL : { title : "Benadryl OK", type : "select", id : "benadrylSelect" },
       MEDICALISSUES : { title : "Medical Issues", type : "checkbox", id : "disease" },
       TDAP : { title : "DTaP/DT/Tdap", type : "text", id : "tdapYear" },
       HEPB : { title : "HepB", type : "text", id : "hepBYear" },
       IPV : { title : "IPV", type : "text", id : "ipvYear" },
       MMR : { title : "MMR", type : "text", id : "mmrYear" },
       VARICELLA : { title : "Varicella", type : "text", id : "varicellaYear" },
       MEDAUTHPARENT1 : { title : "Medical Authorization: Parent #1", type : "checkbox/text", id : "parent1AgreeBox" },
       MEDAUTHPARENT2 : { title : "Medical Authorization: Parnet #2", type : "checkbox/text", id : "parent2AgreeBox" },
       CONTRACTSAGREEPARENT : { title : "Contracts Agreed To (Parent)", type : "checkbox", id : "" },
       CONTRACTSAGREESTUDENT : { title : "Contracts Agreed To (Student)", type : "checkbox", id : "" },
       INCOMEVERIFICATION : { title : "Income Verification", type : "text", id : "incomeVerificationFile" },
       REPORTCARD : { title : "Report Card", type : "text", id : "reportCardFile" },
       TIMESTAMP : { title : "Timestamp", type : "text", id : "timestamp" },
       COMPLETED : { title: "Completed", type : "checkbox", id : "completed" }
    }
    return fieldInfo;


}

