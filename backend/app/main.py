from typing import Dict

import pandas as pd
import pulp
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/")
def allocate_courses(preferences: Dict[str, Dict[str, int]], courses_max_allocation: Dict[str, int]):
    print(preferences)
    print(courses_max_allocation)
    # Convert preferences and course max to dataframes
    df_preferences = pd.DataFrame.from_dict(preferences, orient='index')
    df_course_max = pd.DataFrame.from_dict(
        courses_max_allocation, orient='index')

    # Define the data
    students = df_preferences.index
    courses = df_preferences.columns

    # Define the problem
    prob = pulp.LpProblem("Course_Allocation_Problem", pulp.LpMinimize)

    # Define the decision variables
    x = pulp.LpVariable.dicts(
        name="x", indices=[(i, j) for i in students for j in courses], cat=pulp.LpBinary)

    # Define the objective function
    prob += pulp.lpSum([df_preferences.loc[i, j] * x[(i, j)]
                       for i in students for j in courses])

    # Define the constraints
    for i in students:
        prob += pulp.lpSum([x[(i, j)] for j in courses]) == 1

    # Maximum number of students per course
    for j in courses:
        prob += pulp.lpSum([x[(i, j)]
                           for i in students]) <= df_course_max.loc[j]

    # Solve the problem
    prob.solve()

    # Get the course allocation for each student
    result = {
        "status": pulp.LpStatus[prob.status],
        "total_cost": pulp.value(prob.objective),
        "allocation": {}
    }
    for i in students:
        for j in courses:
            if x[(i, j)].value() == 1:
                if j in result["allocation"]:
                    result["allocation"][j].append(i)
                else:
                    result["allocation"][j] = [i]

    # Sort the allocation by course name
    result["allocation"] = {k: v for k, v in sorted(
        result["allocation"].items(), key=lambda item: item[0])}

    # Sort the students in each course by name
    for (k, v) in result["allocation"].items():
        result["allocation"][k] = sorted(v)

    result["students_count"] = len(students)

    return result
