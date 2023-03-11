import { FC } from 'react';

type Props = {};

const Instructions: FC<Props> = () => (
  <>
    <div className="text-lg md:max-w-2xl">
      <ol className="flex list-inside list-decimal flex-col">
        <li>
          Enter the preferences of the students in the first text area in a
          CSV-like format as shown in the example.
        </li>
        <li>
          Enter the max allocation of the courses in the second text area in a
          CSV-like format as shown in the example.
        </li>
        <li>
          Click on the &quot;Compute result&quot; button to get the allocation.
        </li>
        <li>Click on the &quot;Reset&quot; button to reset the tool.</li>
      </ol>
      <p className="mt-4">
        Note: The tool will save the preferences and courses max allocation in
        the local storage of your browser. This means that if you refresh the
        page, the preferences and courses max allocation will be automatically
        loaded.
      </p>
    </div>
  </>
);

export default Instructions;
