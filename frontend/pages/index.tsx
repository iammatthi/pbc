import { Card } from '@components/card';
import { Instructions } from '@components/instructions';
import { Text } from '@components/text';
import { defaultCorsemaxAllocation, defaultPreferences } from '@data/defaults';
import { Result } from '@type/result';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { GrPowerReset } from 'react-icons/gr';

const commonConfig = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
};

export default function Home() {
  const [preferences, setPreferences] = useState<string>('');
  const [coursesMaxAllocation, setCoursesMaxAllocation] = useState<string>('');
  const [result, setResult] = useState<Result>();

  useEffect(() => {
    // Save preferences to localStorage
    if (preferences) localStorage.setItem('preferences', preferences);
  }, [preferences]);

  useEffect(() => {
    // Save coursesMaxAllocation to localStorage
    if (coursesMaxAllocation)
      localStorage.setItem('coursesMaxAllocation', coursesMaxAllocation);
  }, [coursesMaxAllocation]);

  useEffect(() => {
    // Load preferences and coursesMaxAllocation from localStorage
    const preferencesTmp = localStorage.getItem('preferences');
    if (preferencesTmp) setPreferences(preferencesTmp);
    else setPreferences(defaultPreferences);

    const coursesMaxAllocationTmp = localStorage.getItem(
      'coursesMaxAllocation'
    );
    if (coursesMaxAllocationTmp)
      setCoursesMaxAllocation(coursesMaxAllocationTmp);
    else setCoursesMaxAllocation(defaultCorsemaxAllocation);
  }, []);

  const handleSubmit = () => {
    let preferencesJson = Papa.parse(preferences, commonConfig).data as any; // TODO: fix type
    // Create an object with the student as key and the courses preference as value
    preferencesJson = preferencesJson.reduce((acc: any, curr: any) => {
      const { student, ...courses } = curr;
      acc[student] = courses;
      return acc;
    }, {});

    let coursesMaxAllocationJson = Papa.parse(
      coursesMaxAllocation,
      commonConfig
    ).data as any; // TODO: fix type
    // Create an object with the course as key and the max allocation as value
    coursesMaxAllocationJson = coursesMaxAllocationJson.reduce(
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
        courses_max_allocation: coursesMaxAllocationJson,
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

  const handleReset = () => {
    setPreferences(defaultPreferences);
    setCoursesMaxAllocation(defaultCorsemaxAllocation);
    setResult(undefined);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col gap-8 py-12 px-4 lg:px-8">
        <h1 className="text-center text-3xl lg:text-4xl">
          Preference-based course allocation
        </h1>
        <div className="flex flex-row items-center justify-center">
          <button
            className="flex w-16 flex-row items-center justify-center gap-1"
            onClick={handleReset}
          >
            <GrPowerReset />
            Reset
          </button>
        </div>
        <div>
          <h2 className="text-center text-2xl">How to Use the Tool</h2>
          <div className="mt-4 flex flex-col items-center justify-center">
            <Instructions />
          </div>
        </div>
        <div className="grid grid-flow-row grid-cols-1 gap-4 lg:grid-cols-2">
          <Card title="Preferences (lower value = higher preference)">
            <Text
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            />
          </Card>
          <Card title="Courses max allocation">
            <Text
              value={coursesMaxAllocation}
              onChange={(e) => setCoursesMaxAllocation(e.target.value)}
            />
          </Card>
        </div>
        <div className="flex justify-center">
          <button
            className="w-full rounded-lg bg-gray-100 px-8 py-4 text-2xl"
            onClick={handleSubmit}
          >
            ˅˅ Compute result ˅˅
          </button>
        </div>
        <Card title="Result">
          <div className="flex flex-col gap-2">
            {result?.status && <p>Status: {result.status}</p>}
            {result?.total_cost && result.students_count && (
              <p>
                Avg. preference:{' '}
                {(result.total_cost / result.students_count).toFixed(2)}
              </p>
            )}
            {result?.allocation && <Text value={result.allocation} readOnly />}
          </div>
        </Card>
      </div>
    </>
  );
}
