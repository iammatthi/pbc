import Papa from 'papaparse';
import { useState } from 'react';

type Result = {
  allocation?: string;
  status: string;
  total_cost?: number;
  students_count?: number;
};

const commonConfig = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
};

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

export default function Home() {
  const [preferences, setPreferences] = useState<string>(defaultPreferences);
  const [coursesmaxAllocation, setcoursesmaxAllocation] = useState<string>(
    defaultCorsemaxAllocation
  );
  const [result, setResult] = useState<Result>();

  const handleSubmit = () => {
    let preferencesJson = Papa.parse(preferences, commonConfig).data;
    // Create an object with the student as key and the courses preference as value
    preferencesJson = preferencesJson.reduce((acc: any, curr: any) => {
      const { student, ...courses } = curr;
      acc[student] = courses;
      return acc;
    }, {});

    let coursesmaxAllocationJson = Papa.parse(
      coursesmaxAllocation,
      commonConfig
    ).data;
    // Create an object with the course as key and the max allocation as value
    coursesmaxAllocationJson = coursesmaxAllocationJson.reduce(
      (acc: any, curr: any) => {
        const { course, max } = curr;
        acc[course] = max;
        return acc;
      },
      {}
    );

    fetch('https://pbc.matthiasberchtold.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preferences: preferencesJson,
        courses_max_allocation: coursesmaxAllocationJson,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let allocation = '';
        for (const [key, value] of Object.entries(data.allocation)) {
          allocation += `${key}:\n`;
          // Iterate over the students (value is an array)
          for (const student of value as string[]) {
            allocation += `- ${student}\n`;
          }
          allocation += '\n';
        }
        data.allocation = allocation;
        setResult(data);
      })
      .catch((error) => {
        setResult({
          status: 'Error',
        });
        console.error(error);
      });
  };

  return (
    <>
      <div className="flex min-h-screen flex-col gap-8 py-12 px-4 lg:px-8">
        <h1 className="mb-4 text-center text-4xl">
          Preference-based course allocation
        </h1>
        <div className="grid grid-flow-row grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg bg-blue-100 py-8 px-4 lg:px-8">
            <h2 className="mb-4 text-2xl">
              Preferences (lower value = higher preference)
            </h2>
            <textarea
              className="h-96 w-full rounded-lg p-4"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            />
          </div>
          <div className="rounded-lg bg-blue-100 py-8 px-4 lg:px-8">
            <h2 className="mb-4 text-2xl">Courses max allocation</h2>
            <textarea
              className="h-96 w-full rounded-lg p-4"
              value={coursesmaxAllocation}
              onChange={(e) => setcoursesmaxAllocation(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="w-full rounded-lg bg-blue-100 px-8 py-4 text-2xl"
            onClick={handleSubmit}
          >
            ˅˅ Compute result ˅˅
          </button>
        </div>
        <div className="rounded-lg bg-blue-100 py-8 px-4 lg:px-8">
          <h2 className="mb-4 text-2xl">Result</h2>
          <div className="flex flex-col gap-2">
            {result?.status && <p>Status: {result.status}</p>}
            {result?.total_cost && result.students_count && (
              <p>
                Avg. preference:{' '}
                {(result.total_cost / result.students_count).toFixed(2)}
              </p>
            )}
            {result?.allocation && (
              <textarea
                className="h-96 w-full rounded-lg p-4"
                value={result.allocation}
                readOnly
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
