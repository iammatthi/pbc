import { defaultCorsemaxAllocation, defaultPreferences } from '@data/default';
import { Result } from '@type/result';
import Papa from 'papaparse';
import { useState } from 'react';

const commonConfig = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
};

export default function Home() {
  const [preferences, setPreferences] = useState<string>(defaultPreferences);
  const [coursesmaxAllocation, setcoursesmaxAllocation] = useState<string>(
    defaultCorsemaxAllocation
  );
  const [result, setResult] = useState<Result>();

  const handleSubmit = () => {
    let preferencesJson = Papa.parse(preferences, commonConfig).data as any; // TODO: fix type
    // Create an object with the student as key and the courses preference as value
    preferencesJson = preferencesJson.reduce((acc: any, curr: any) => {
      const { student, ...courses } = curr;
      acc[student] = courses;
      return acc;
    }, {});

    let coursesmaxAllocationJson = Papa.parse(
      coursesmaxAllocation,
      commonConfig
    ).data as any; // TODO: fix type
    // Create an object with the course as key and the max allocation as value
    coursesmaxAllocationJson = coursesmaxAllocationJson.reduce(
      (acc: any, curr: any) => {
        const { course, max } = curr;
        acc[course] = max;
        return acc;
      },
      {}
    );

    fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
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
