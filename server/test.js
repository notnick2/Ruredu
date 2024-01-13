// Assuming you have an array of subjects called 'subjectsArray'
// Here's a sample array for demonstration purposes
const subjectsArray = [
    {
      std: 10,
      name: [
        {
          subject_name: 'Math',
          units: [
            {
              unit_name: 'Algebra',
              topics: [
                { topic_name: 'Equations', topic_description: 'Solving equations' },
                { topic_name: 'Inequalities', topic_description: 'Solving inequalities' },
              ],
            },
            {
              unit_name: 'Geometry',
              topics: [
                { topic_name: 'Triangles', topic_description: 'Properties of triangles' },
                { topic_name: 'Circles', topic_description: 'Properties of circles' },
              ],
            },
          ],
        },
        {
            subject_name: 'Math',
            units: [
              {
                unit_name: 'Algebra',
                topics: [
                  { topic_name: 'Equations', topic_description: 'Solving equations' },
                  { topic_name: 'Inequalities', topic_description: 'Solving inequalities' },
                ],
              },
              {
                unit_name: 'Geometry',
                topics: [
                  { topic_name: 'Triangles', topic_description: 'Properties of triangles' },
                  { topic_name: 'Circles', topic_description: 'Properties of circles' },
                ],
              },
            ],
          },
          {
            subject_name: 'Math',
            units: [
              {
                unit_name: 'Algebra',
                topics: [
                  { topic_name: 'Equations', topic_description: 'Solving equations' },
                  { topic_name: 'Inequalities', topic_description: 'Solving inequalities' },
                ],
              },
              {
                unit_name: 'Geometry',
                topics: [
                  { topic_name: 'Triangles', topic_description: 'Properties of triangles' },
                  { topic_name: 'Circles', topic_description: 'Properties of circles' },
                ],
              },
            ],
          },
          {
            subject_name: 'Math',
            units: [
              {
                unit_name: 'Algebra',
                topics: [
                  { topic_name: 'Equations', topic_description: 'Solving equations' },
                  { topic_name: 'Inequalities', topic_description: 'Solving inequalities' },
                ],
              },
              {
                unit_name: 'Geometry',
                topics: [
                  { topic_name: 'Triangles', topic_description: 'Properties of triangles' },
                  { topic_name: 'Circles', topic_description: 'Properties of circles' },
                ],
              },
            ],
          },
          {
            subject_name: 'Math',
            units: [
              {
                unit_name: 'Algebra',
                topics: [
                  { topic_name: 'Equations', topic_description: 'Solving equations' },
                  { topic_name: 'Inequalities', topic_description: 'Solving inequalities' },
                ],
              },
              {
                unit_name: 'Geometry',
                topics: [
                  { topic_name: 'Triangles', topic_description: 'Properties of triangles' },
                  { topic_name: 'Circles', topic_description: 'Properties of circles' },
                ],
              },
            ],
          },
          {
            subject_name: 'Math',
            units: [
              {
                unit_name: 'Algebra',
                topics: [
                  { topic_name: 'Equations', topic_description: 'Solving equations' },
                  { topic_name: 'Inequalities', topic_description: 'Solving inequalities' },
                ],
              },
              {
                unit_name: 'Geometry',
                topics: [
                  { topic_name: 'Triangles', topic_description: 'Properties of triangles' },
                  { topic_name: 'Circles', topic_description: 'Properties of circles' },
                ],
              },
            ],
          },
      ],
    },
    // Add more subjects as needed
  ];
  
  // Function to convert array of subjects to a dictionary
  function subjectsToDictionary(subjectsArray) {
    const subjectsDictionary = {};
  
    subjectsArray.forEach((subject) => {
      const subjectName = subject.name[0].subject_name;
      const unitsArray = subject.name[0].units;
  
      subjectsDictionary[subjectName] = unitsArray;
    });
  
    return subjectsDictionary;
  }
  
  // Call the function with your array of subjects
  const subjectsDictionary = subjectsToDictionary(subjectsArray);
  
  // Display the result
  console.log(subjectsDictionary);
  