import Papa from 'papaparse';

const defaultPreferences = Papa.unparse([
  {
    student: 'Student 1',
    react: '1',
    vue: '2',
    svelte: '3',
    angular: '4',
  },
  {
    student: 'Student 2',
    react: '3',
    vue: '2',
    svelte: '4',
    angular: '1',
  },
  {
    student: 'Student 3',
    react: '3',
    vue: '1',
    svelte: '2',
    angular: '4',
  },
  {
    student: 'Student 4',
    react: '1',
    vue: '4',
    svelte: '2',
    angular: '3',
  },
  {
    student: 'Student 5',
    react: '3',
    vue: '4',
    svelte: '1',
    angular: '2',
  },
  {
    student: 'Student 6',
    react: '1',
    vue: '3',
    svelte: '4',
    angular: '2',
  },
  {
    student: 'Student 7',
    react: '1',
    vue: '2',
    svelte: '4',
    angular: '3',
  },
]);

const defaultCorsemaxAllocation = Papa.unparse([
  {
    course: 'react',
    max: '3',
  },
  {
    course: 'vue',
    max: '3',
  },
  {
    course: 'svelte',
    max: '3',
  },
  {
    course: 'angular',
    max: '3',
  },
]);

export { defaultPreferences, defaultCorsemaxAllocation };
