import csv

def parse_csv(file_path):
    programming_problems = {}
    current_category = None
    problems_to_read = 0  # The number of problems to read for the current category

    with open(file_path, mode='r', encoding='utf-8') as file:
        reader = csv.reader(file)

        for row in reader:
            # Check if we're starting a new category
            #print(row)
            #print(row[0])
            if row and row[0] != 'Incomplete' and row[0] != 'Status' and len(row[0]) > 2:
                current_category = row[0]
                programming_problems[current_category] = [[] for _ in range(3)]  # Lists for easy, medium, hard
                problems_to_read = 0  # Reset for the new category
            
            elif row and row[0] == 'Incomplete':
                problem_name = row[1]
                difficulty = row[2]
                # Determine the index based on difficulty
                difficulty_index = 0 if difficulty == 'Easy' else 1 if difficulty == 'Medium' else 2
                # Add the problem to the correct list under the current category
                programming_problems[current_category][difficulty_index].append(problem_name)

            

    return programming_problems

# Usage
file_path = 'Neetcode150.csv'  # replace with your actual file path
problems = parse_csv(file_path)
#print(problems)
for category, difficulties in problems.items():
    print(f"{category}:")
    for difficulty_index, problem_list in enumerate(difficulties):
        print(f"  {'Easy' if difficulty_index == 0 else 'Medium' if difficulty_index == 1 else 'Hard'}: {problem_list}")




"""programming_problems = {
    "Two Pointers" : [
        ["Valid Palindrome", "125"],
        ["Two Sum II",
         "3Sum",
         "Container With Most Water",],
        ["Trap Rain Water"],
    ],
    
}
"""