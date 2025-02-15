import { useData } from "../contexts/fetchDataContext";

// Create a function to fetch `levelData` dynamically
export const levelData = () => {
  const { egroup } = useData(); // Retrieve `egroup` from context
  return egroup;
};


const r =
{
  'elementary': {
    title: 'المدرسة الابتدائية',
    grades: [
      {
        id: 'third-year',
        name: 'السنة الثالثة',
        subjects: [
          { id: 'math-3', name: 'رياضيات', icon: '📐', description: 'الرياضيات المتوسطة' },
          { id: 'science-3', name: 'علوم', icon: '🔬', description: 'التحقيق العلمي' },
          { id: 'social-3', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'الدراسات الإقليمية' },
          { id: 'french-3', name: 'فرنسية', icon: '🇫🇷', description: 'الأدب الفرنسي' },
          { id: 'english-3', name: 'إنجليزية', icon: '🗣️', description: 'الأدب الإنجليزي' },
          { id: 'civics-3', name: 'تربية مدنية', icon: '🏛️', description: 'أساسيات التربية المدنية' },
          { id: 'islamic-3', name: 'تربية إسلامية', icon: '🕌', description: 'تاريخ الإسلام' },
          { id: 'arabic-3', name: 'عربية', icon: '📚', description: 'التأليف بالعربية' }
        ]
      },
      {
        id: 'fourth-year',
        name: 'السنة الرابعة',
        subjects: [
          { id: 'math-4', name: 'رياضيات', icon: '📐', description: 'حل المشكلات المتقدم' },
          { id: 'science-4', name: 'علوم', icon: '🔬', description: 'العلوم المتقدمة' },
          { id: 'social-4', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'الدراسات العالمية' },
          { id: 'french-4', name: 'فرنسية', icon: '🇫🇷', description: 'التأليف باللغة الفرنسية' },
          { id: 'english-4', name: 'إنجليزية', icon: '🗣️', description: 'التأليف باللغة الإنجليزية' },
          { id: 'civics-4', name: 'تربية مدنية', icon: '🏛️', description: 'أساسيات التربية المدنية' },
          { id: 'islamic-4', name: 'تربية إسلامية', icon: '🕌', description: 'الأخلاق الإسلامية' },
          { id: 'arabic-4', name: 'عربية', icon: '📚', description: 'العربية المتقدمة' }
        ]
      },
      {
        id: 'fifth-year',
        name: 'السنة الخامسة',
        subjects: [
          { id: 'math-5', name: 'رياضيات', icon: '📐', description: 'التحضير للرياضيات الأساسية' },
          { id: 'science-5', name: 'علوم', icon: '🔬', description: 'العلوم المتكاملة' },
          { id: 'social-5', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'الدراسات الاجتماعية المتقدمة' },
          { id: 'french-5', name: 'فرنسية', icon: '🇫🇷', description: 'الفرنسية المتقدمة' },
          { id: 'english-5', name: 'إنجليزية', icon: '🗣️', description: 'الإنجليزية المتقدمة' },
          { id: 'civics-5', name: 'تربية مدنية', icon: '🏛️', description: 'أساسيات التربية المدنية' },
          { id: 'islamic-5', name: 'تربية إسلامية', icon: '🕌', description: 'الدراسات الإسلامية المتقدمة' },
          { id: 'arabic-5', name: 'عربية', icon: '📚', description: 'الأدب العربي' }
        ]
      }
    ]
  },
  'middle-school': {
    title: 'المدرسة المتوسطة',
    grades: [
      {
        id: 'first-year',
        name: 'السنة الأولى',
        subjects: [
          { id: 'math-m1', name: 'رياضيات', icon: '📐', description: 'أساسيات الجبر' },
          { id: 'science-m1', name: 'علوم', icon: '🔬', description: 'علوم الحياة' },
          { id: 'social-m1', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'تاريخ العالم' },
          { id: 'french-m1', name: 'فرنسية', icon: '🇫🇷', description: 'فنون اللغة الفرنسية' },
          { id: 'english-m1', name: 'إنجليزية', icon: '🗣️', description: 'فنون اللغة الإنجليزية' },
          { id: 'civics-m1', name: 'تربية مدنية', icon: '🏛️', description: 'أساسيات التربية المدنية' },
          { id: 'islamic-m1', name: 'تربية إسلامية', icon: '🕌', description: 'المبادئ الإسلامية' },
          { id: 'arabic-m1', name: 'عربية', icon: '📚', description: 'قواعد اللغة العربية والأدب' }
        ]
      },
      {
        id: 'second-year',
        name: 'السنة الثانية',
        subjects: [
          { id: 'math-m2', name: 'رياضيات', icon: '📐', description: 'ما قبل الجبر' },
          { id: 'science-m2', name: 'علوم', icon: '🔬', description: 'علوم الأرض' },
          { id: 'social-m2', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'الجغرافيا الإقليمية' },
          { id: 'french-m2', name: 'فرنسية', icon: '🇫🇷', description: 'الأدب الفرنسي' },
          { id: 'english-m2', name: 'إنجليزية', icon: '🗣️', description: 'الأدب الإنجليزي' },
          { id: 'civics-m2', name: 'تربية مدنية', icon: '🏛️', description: 'أساسيات التربية المدنية' },
          { id: 'islamic-m2', name: 'تربية إسلامية', icon: '🕌', description: 'تاريخ الإسلام' },
          { id: 'arabic-m2', name: 'عربية', icon: '📚', description: 'التأليف بالعربية' }
        ]
      },
      {
        id: 'third-year',
        name: 'السنة الثالثة',
        subjects: [
          { id: 'math-m3', name: 'رياضيات', icon: '📐', description: 'الجبر I' },
          { id: 'science-m3', name: 'علوم', icon: '🔬', description: 'العلوم الفيزيائية' },
          { id: 'social-m3', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'التاريخ الحديث' },
          { id: 'french-m3', name: 'فرنسية', icon: '🇫🇷', description: 'الأدب الفرنسي' },
          { id: 'english-m3', name: 'إنجليزية', icon: '🗣️', description: 'اللغة الإنجليزية' },
          { id: 'civics-m3', name: 'تربية مدنية', icon: '🏛️', description: 'أساسيات التربية المدنية' },
          { id: 'islamic-m3', name: 'تربية إسلامية', icon: '🕌', description: 'الحضارة الإسلامية' },
          { id: 'arabic-m3', name: 'عربية', icon: '📚', description: 'العربية المتقدمة' }
        ]
      },
      {
        id: 'fourth-year',
        name: 'السنة الرابعة',
        subjects: [
          { id: 'math-m4', name: 'رياضيات', icon: '📐', description: 'الهندسة وعلم المثلثات' },
          { id: 'science-m4', name: 'علوم', icon: '🔬', description: 'العلوم المتكاملة' },
          { id: 'social-m4', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'العالم المعاصر' },
          { id: 'french-m4', name: 'فرنسية', icon: '🇫🇷', description: 'التأليف باللغة الفرنسية' },
          { id: 'english-m4', name: 'إنجليزية', icon: '🗣️', description: 'التأليف باللغة الإنجليزية' },
          { id: 'civics-m4', name: 'تربية مدنية', icon: '🏛️', description: 'أساسيات التربية المدنية' },
          { id: 'islamic-m4', name: 'تربية إسلامية', icon: '🕌', description: 'الدراسات الإسلامية المعاصرة' },
          { id: 'arabic-m4', name: 'عربية', icon: '📚', description: 'الأدب العربي' }
        ]
      }
    ]
  },
  'high-school': {
    title: 'المدرسة الثانوية',
    grades: [
      {
        id: 'first-year',
        name: 'السنة الأولى',
        branches: [
          {
            id: 'technical-mathematic',
            name: 'تقني رياضي',
            subjects: [
              { id: 'math-t1', name: 'الرياضيات', icon: '📐', description: 'أساسيات الرياضيات' },
              { id: 'physics-t1', name: 'الفيزياء', icon: '⚡', description: 'أساسيات الفيزياء' },
              { id: 'civil-engineering-t1', name: 'هندسة مدنية', icon: '🏗️', description: 'مقدمة في الهندسة المدنية' },
              { id: 'electrical-engineering-t1', name: 'هندسة كهربائية', icon: '💡', description: 'أساسيات الهندسة الكهربائية' },
              { id: 'process-engineering-t1', name: 'هندسة الطرائق', icon: '🔧', description: 'أساسيات هندسة الطرائق' },
              { id: 'mechanical-engineering-t1', name: 'هندسة ميكانيكية', icon: '⚙️', description: 'أساسيات الهندسة الميكانيكية' },
              { id: 'history-geography-t1', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'تاريخ وجغرافيا العالم' },
              { id: 'french-t1', name: 'فرنسية', icon: '🇫🇷', description: 'اللغة الفرنسية' },
              { id: 'english-t1', name: 'إنجليزية', icon: '🗣️', description: 'اللغة الإنجليزية' },
              { id: 'arabic-t1', name: 'عربية', icon: '📚', description: 'اللغة العربية' }
            ]
          },
          {
            id: 'scientific',
            name: 'علمي',
            subjects: [
              { id: 'math-h1', name: 'الرياضيات', icon: '📐', description: 'الجبر المتقدم والتفاضل' },
              { id: 'physics-h1', name: 'الفيزياء', icon: '⚡', description: 'الميكانيكا المتقدمة' },
              { id: 'chemistry-h1', name: 'الكيمياء', icon: '⚗️', description: 'الكيمياء العامة' },
              { id: 'biology-h1', name: 'الأحياء', icon: '🧬', description: 'علم الخلايا' },
              { id: 'electrical-h1', name: 'الهندسة الكهربائية', icon: '💡', description: 'أساسيات الدوائر' },
              { id: 'history-geography-h1', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'تاريخ وجغرافيا العالم' },
              { id: 'french-h1', name: 'فرنسية', icon: '🇫🇷', description: 'اللغة الفرنسية' },
              { id: 'english-h1', name: 'إنجليزية', icon: '🗣️', description: 'اللغة الإنجليزية' },
              { id: 'arabic-h1', name: 'عربية', icon: '📚', description: 'اللغة العربية' },
              { id: 'philosophy-h1', name: 'فلسفة', icon: '🤔', description: 'مقدمة في الفلسفة' }
            ]
          },
          {
            id: 'languages',
            name: 'اللغات',
            subjects: [
              { id: 'arabic-h1', name: 'العربية', icon: '📚', description: 'الأدب العربي المتقدم' },
              { id: 'english-h1', name: 'الإنجليزية', icon: '🗣️', description: 'الإنجليزية المتقدمة' },
              { id: 'french-h1', name: 'الفرنسية', icon: '🇫🇷', description: 'الفرنسية المتقدمة' },
              { id: 'spanish-h1', name: 'الإسبانية', icon: '🇪🇸', description: 'اللغة الإسبانية' },
              { id: 'german-h1', name: 'الألمانية', icon: '🇩🇪', description: 'اللغة الألمانية' },
              { id: 'italian-h1', name: 'الإيطالية', icon: '🇮🇹', description: 'اللغة الإيطالية' },
              { id: 'math-h1', name: 'رياضيات', icon: '📐', description: 'أساسيات الرياضيات' },
              { id: 'philosophy-h1', name: 'فلسفة', icon: '🤔', description: 'مقدمة في الفلسفة' },
              { id: 'history-geography-h1', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'تاريخ وجغرافيا العالم' }
            ]
          },
          {
            id: 'arabic-language-and-philosophy',
            name: 'اللغة العربية والفلسفة',
            subjects: [
              { id: 'math-a1', name: 'رياضيات', icon: '📐', description: 'أساسيات الرياضيات' },
              { id: 'philosophy-a1', name: 'فلسفة', icon: '🤔', description: 'مقدمة في الفلسفة' },
              { id: 'history-geography-a1', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'تاريخ وجغرافيا العالم' },
              { id: 'french-a1', name: 'فرنسية', icon: '🇫🇷', description: 'اللغة الفرنسية' },
              { id: 'english-a1', name: 'إنجليزية', icon: '🗣️', description: 'اللغة الإنجليزية' },
              { id: 'arabic-a1', name: 'عربية', icon: '📚', description: 'اللغة العربية' }
            ]
          }
        ]
      },
      {
        id: 'second-year',
        name: 'السنة الثانية',
        branches: [
          {
            id: 'technical-mathematic',
            name: 'تقني رياضي',
            subjects: [
              { id: 'math-t2', name: 'الرياضيات', icon: '📐', description: 'أساسيات الرياضيات' },
              { id: 'physics-t2', name: 'الفيزياء', icon: '⚡', description: 'أساسيات الفيزياء' },
              { id: 'civil-engineering-t2', name: 'هندسة مدنية', icon: '🏗️', description: 'مقدمة في الهندسة المدنية' },
              { id: 'electrical-engineering-t2', name: 'هندسة كهربائية', icon: '💡', description: 'أساسيات الهندسة الكهربائية' },
              { id: 'process-engineering-t2', name: 'هندسة الطرائق', icon: '🔧', description: 'أساسيات هندسة الطرائق' },
              { id: 'mechanical-engineering-t2', name: 'هندسة ميكانيكية', icon: '⚙️', description: 'أساسيات الهندسة الميكانيكية' },
              { id: 'history-geography-t2', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'تاريخ وجغرافيا العالم' },
              { id: 'french-t2', name: 'فرنسية', icon: '🇫🇷', description: 'اللغة الفرنسية' },
              { id: 'english-t2', name: 'إنجليزية', icon: '🗣️', description: 'اللغة الإنجليزية' },
              { id: 'arabic-t2', name: 'عربية', icon: '📚', description: 'اللغة العربية' }
            ]
          },
          {
            id: 'scientific',
            name: 'علمي',
            subjects: [
              { id: 'math-h2', name: 'الرياضيات', icon: '📐', description: 'التفاضل المتقدم' },
              { id: 'physics-h2', name: 'الفيزياء', icon: '⚡', description: 'الكهرومغناطيسية' },
              { id: 'chemistry-h2', name: 'الكيمياء', icon: '⚗️', description: 'الكيمياء العضوية' },
              { id: 'biology-h2', name: 'الأحياء', icon: '🧬', description: 'علم الوراثة' },
              { id: 'electrical-h2', name: 'الهندسة الكهربائية', icon: '💡', description: 'الإلكترونيات' },
              { id: 'history-geography-h2', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'تاريخ وجغرافيا العالم' },
              { id: 'french-h2', name: 'فرنسية', icon: '🇫🇷', description: 'اللغة الفرنسية' },
              { id: 'english-h2', name: 'إنجليزية', icon: '🗣️', description: 'اللغة الإنجليزية' },
              { id: 'arabic-h2', name: 'عربية', icon: '📚', description: 'اللغة العربية' },
              { id: 'philosophy-h2', name: 'فلسفة', icon: '🤔', description: 'الفلسفة الحديثة' }
            ]
          },
          {
            id: 'languages',
            name: 'اللغات',
            subjects: [
              { id: 'arabic-h2', name: 'العربية', icon: '📚', description: 'الأدب العربي الكلاسيكي' },
              { id: 'english-h2', name: 'الإنجليزية', icon: '🗣️', description: 'الأدب الإنجليزي' },
              { id: 'french-h2', name: 'الفرنسية', icon: '🇫🇷', description: 'الأدب الفرنسي' },
              { id: 'spanish-h2', name: 'الإسبانية', icon: '🇪🇸', description: 'التأليف باللغة الإسبانية' },
              { id: 'german-h2', name: 'الألمانية', icon: '🇩🇪', description: 'التأليف باللغة الألمانية' },
              { id: 'italian-h2', name: 'الإيطالية', icon: '🇮🇹', description: 'التأليف باللغة الإيطالية' },
              { id: 'math-h2', name: 'رياضيات', icon: '📐', description: 'أساسيات الرياضيات' },
              { id: 'philosophy-h2', name: 'فلسفة', icon: '🤔', description: 'الفلسفة الحديثة' },
              { id: 'history-geography-h2', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'تاريخ وجغرافيا العالم' }
            ]
          },

          {
            id: 'arabic-language-and-philosophy',
            name: 'اللغة العربية والفلسفة',
            subjects: [
              { id: 'math-a2', name: 'رياضيات', icon: '📐', description: 'أساسيات الرياضيات' },
              { id: 'philosophy-a2', name: 'فلسفة', icon: '🤔', description: 'الفلسفة الحديثة' },
              { id: 'history-geography-a2', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'تاريخ وجغرافيا العالم' },
              { id: 'french-a2', name: 'فرنسية', icon: '🇫🇷', description: 'اللغة الفرنسية' },
              { id: 'english-a2', name: 'إنجليزية', icon: '🗣️', description: 'اللغة الإنجليزية' },
              { id: 'arabic-a2', name: 'عربية', icon: '📚', description: 'اللغة العربية' }
            ]
          }
        ]
      },
      {
        id: 'third-year',
        name: 'السنة الثالثة',
        branches: [
          {
            id: 'technical-mathematic',
            name: 'تقني رياضي',
            subjects: [
              { id: 'math-t3', name: 'الرياضيات', icon: '📐', description: 'أساسيات الرياضيات' },
              { id: 'physics-t3', name: 'الفيزياء', icon: '⚡', description: 'أساسيات الفيزياء' },
              { id: 'civil-engineering-t3', name: 'هندسة مدنية', icon: '🏗️', description: 'مقدمة في الهندسة المدنية' },
              { id: 'electrical-engineering-t3', name: 'هندسة كهربائية', icon: '💡', description: 'أساسيات الهندسة الكهربائية' },
              { id: 'process-engineering-t3', name: 'هندسة الطرائق', icon: '🔧', description: 'أساسيات هندسة الطرائق' },
              { id: 'mechanical-engineering-t3', name: 'هندسة ميكانيكية', icon: '⚙️', description: 'أساسيات الهندسة الميكانيكية' },
              { id: 'history-geography-t3', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'تاريخ وجغرافيا العالم' },
              { id: 'french-t3', name: 'فرنسية', icon: '🇫🇷', description: 'اللغة الفرنسية' },
              { id: 'english-t3', name: 'إنجليزية', icon: '🗣️', description: 'اللغة الإنجليزية' },
              { id: 'arabic-t3', name: 'عربية', icon: '📚', description: 'اللغة العربية' }
            ]
          },
          {
            id: 'scientific',
            name: 'علمي',
            subjects: [
              { id: 'math-h3', name: 'الرياضيات', icon: '📐', description: 'التحليل الرياضي' },
              { id: 'physics-h3', name: 'الفيزياء', icon: '⚡', description: 'الميكانيكا الكمومية' },
              { id: 'chemistry-h3', name: 'الكيمياء', icon: '⚗️', description: 'الكيمياء الفيزيائية' },
              { id: 'biology-h3', name: 'الأحياء', icon: '🧬', description: 'علم الأحياء الجزيئي' },
              { id: 'electrical-h3', name: 'الهندسة الكهربائية', icon: '💡', description: 'الإلكترونيات المتقدمة' },
              { id: 'history-geography-h3', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'تاريخ وجغرافيا العالم' },
              { id: 'french-h3', name: 'فرنسية', icon: '🇫🇷', description: 'اللغة الفرنسية' },
              { id: 'english-h3', name: 'إنجليزية', icon: '🗣️', description: 'اللغة الإنجليزية' },
              { id: 'arabic-h3', name: 'عربية', icon: '📚', description: 'اللغة العربية' },
              { id: 'philosophy-h3', name: 'فلسفة', icon: '🤔', description: 'الفلسفة المعاصرة' }
            ]
          },
          {
            id: 'languages',
            name: 'اللغات',
            subjects: [
              { id: 'arabic-h3', name: 'العربية', icon: '📚', description: 'الأدب العربي الحديث' },
              { id: 'english-h3', name: 'الإنجليزية', icon: '🗣️', description: 'التأليف المتقدم' },
              { id: 'french-h3', name: 'الفرنسية', icon: '🇫🇷', description: 'التأليف المتقدم' },
              { id: 'spanish-h3', name: 'الإسبانية', icon: '🇪🇸', description: 'الأدب الإسباني' },
              { id: 'german-h3', name: 'الألمانية', icon: '🇩🇪', description: 'الأدب الألماني' },
              { id: 'italian-h3', name: 'الإيطالية', icon: '🇮🇹', description: 'الأدب الإيطالي' },
              { id: 'math-h3', name: 'رياضيات', icon: '📐', description: 'أساسيات الرياضيات' },
              { id: 'philosophy-h3', name: 'فلسفة', icon: '🤔', description: 'الفلسفة المعاصرة' },
              { id: 'history-geography-h3', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'تاريخ وجغرافيا العالم' }
            ]
          },

          {
            id: 'arabic-language-and-philosophy',
            name: 'اللغة العربية والفلسفة',
            subjects: [
              { id: 'math-a3', name: 'رياضيات', icon: '📐', description: 'أساسيات الرياضيات' },
              { id: 'philosophy-a3', name: 'فلسفة', icon: '🤔', description: 'الفلسفة المعاصرة' },
              { id: 'history-geography-a3', name: 'تاريخ و جغرافيا', icon: '🌍', description: 'تاريخ وجغرافيا العالم' },
              { id: 'french-a3', name: 'فرنسية', icon: '🇫🇷', description: 'اللغة الفرنسية' },
              { id: 'english-a3', name: 'إنجليزية', icon: '🗣️', description: 'اللغة الإنجليزية' },
              { id: 'arabic-a3', name: 'عربية', icon: '📚', description: 'اللغة العربية' }
            ]
          }
        ]
      }
    ]
  }
};