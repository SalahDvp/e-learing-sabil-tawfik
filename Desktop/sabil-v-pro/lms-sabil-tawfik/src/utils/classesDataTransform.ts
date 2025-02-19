export interface Level {
  id: string; // Example: 'first-year-arabic-m1'
  name: string; // Example: 'First Year - Arabic - M1'
  teachers: Teacher[];
}

export interface Teacher {
  id: string;
  name: string;
}

export interface ClassData {
  subGroups:any
  id:string;
  level: string; // Example: 'Primary School', 'Middle School', 'High School'
  grade: string; // Example: 'First Year', 'Second Year'
  branch: string; // Example: 'Mathematics', 'Science', or '-' for no branch
  subject: string; // Placeholder for subject
  description: string; // Placeholder for description
}

export function transformClassesData(levelData: Record<string, Level>): ClassData[] {
  const data: ClassData[] = [];

  Object.values(levelData).forEach((level) => {
    const [yearPart, branchPart] = level.id.split('-');

    // Map levels to their human-readable equivalents
    let levelName = '';
    if (level.id.includes('m1') || level.id.includes('m2') || level.id.includes('m3') || level.id.includes('m4')) {
      levelName = 'Middle School';
    } else if (level.id.includes('h3') ||  level.id.includes('h1')|| level.id.includes('h2')) {
      levelName = 'High School';
    }
    else {
      levelName = 'Primary School';
    } 

    // Determine the grade (year)
    let grade = '';
    if (yearPart === 'first') grade = 'First Year';
    if (yearPart === 'second') grade = 'Second Year';
    if (yearPart === 'third') grade = 'Third Year';
    if (yearPart === 'fourth') grade = 'Fourth Year';
    if (yearPart === 'fifth') grade = 'Fifth Year';

    // Determine the branch (if any)
    let branch = '-';
    if (branchPart === 'math') branch = 'Mathematics';
    if (branchPart === 'science') branch = 'Science';
    if (branchPart === 'economy') branch = 'Economy';
    if (branchPart === 'literature') branch = 'Literature';
    if (branchPart === 'philosophy') branch = 'Philosophy';
    if (branchPart === 'electric') branch = 'Electric';
    if (branchPart === 'civil') branch = 'Civil Engineering';

    // Extract the subject from the name (e.g., "First Year - Arabic - M1")
    


    data.push({
      subGroups:level.subGroups,
      id:level.id,
      level: levelName,
      grade,
      branch,
      subject:level.name,
      description: level.name, // Use the full name as a description
    });
  });

  return data;
}

